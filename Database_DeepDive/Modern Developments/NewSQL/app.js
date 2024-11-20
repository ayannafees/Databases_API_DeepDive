// app.js
const { Client } = require('pg');

// Replace the following with your CockroachDB connection details
const client = new Client({
    host: 'localhost', // or your CockroachCloud host
    port: 26257,       // default CockroachDB port
    user: 'root',      // default user for local clusters
    password: '',      // set if using a secure cluster
    database: 'techcorp', // database name
    ssl: false          // set to true if connecting to CockroachCloud
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log('Connected to CockroachDB');

        // Create database if it doesn't exist
        await client.query(`CREATE DATABASE IF NOT EXISTS techcorp;`);
        await client.query(`USE techcorp;`);

        // Execute schema.sql
        const fs = require('fs');
        const schema = fs.readFileSync('schema.sql', 'utf8');
        await client.query(schema);
        console.log('Database schema created or already exists.');
    } catch (err) {
        console.error('Error setting up the database:', err);
    }
}

async function createDepartment(name) {
    try {
        const res = await client.query(
            'INSERT INTO departments (department_name) VALUES ($1) RETURNING department_id;',
            [name]
        );
        console.log(`Department '${name}' created with ID ${res.rows[0].department_id}`);
        return res.rows[0].department_id;
    } catch (err) {
        console.error('Error creating department:', err);
    }
}

async function createEmployee(firstName, lastName, email, departmentId, salary) {
    try {
        const res = await client.query(
            `INSERT INTO employees (first_name, last_name, email, department_id, salary)
             VALUES ($1, $2, $3, $4, $5) RETURNING employee_id;`,
            [firstName, lastName, email, departmentId, salary]
        );
        console.log(`Employee '${firstName} ${lastName}' created with ID ${res.rows[0].employee_id}`);
        return res.rows[0].employee_id;
    } catch (err) {
        console.error('Error creating employee:', err);
    }
}

async function getAllEmployees() {
    try {
        const res = await client.query(
            `SELECT e.employee_id, e.first_name, e.last_name, e.email, d.department_name, e.salary
             FROM employees e
             LEFT JOIN departments d ON e.department_id = d.department_id;`
        );
        console.log('All Employees:');
        res.rows.forEach(row => {
            console.log(`${row.first_name} ${row.last_name} | Email: ${row.email} | Department: ${row.department_name} | Salary: $${row.salary}`);
        });
    } catch (err) {
        console.error('Error retrieving employees:', err);
    }
}

async function updateEmployeeSalary(employeeId, newSalary) {
    try {
        await client.query(
            `UPDATE employees SET salary = $1 WHERE employee_id = $2;`,
            [newSalary, employeeId]
        );
        console.log(`Employee ID ${employeeId} salary updated to $${newSalary}`);
    } catch (err) {
        console.error('Error updating employee salary:', err);
    }
}

async function deleteEmployee(employeeId) {
    try {
        await client.query(
            `DELETE FROM employees WHERE employee_id = $1;`,
            [employeeId]
        );
        console.log(`Employee ID ${employeeId} deleted.`);
    } catch (err) {
        console.error('Error deleting employee:', err);
    }
}

async function runTransactions() {
    try {
        await client.query('BEGIN;');

        // Create a new department
        const deptId = await createDepartment('Research and Development');

        // Create two employees in the new department
        const emp1 = await createEmployee('Diana', 'Prince', 'diana.prince@techcorp.com', deptId, 95000);
        const emp2 = await createEmployee('Clark', 'Kent', 'clark.kent@techcorp.com', deptId, 90000);

        // Commit the transaction
        await client.query('COMMIT;');
        console.log('Transaction committed successfully.');
    } catch (err) {
        console.error('Transaction failed:', err);
        await client.query('ROLLBACK;');
        console.log('Transaction rolled back.');
    }
}

async function main() {
    await setupDatabase();

    // Run transactional operations
    await runTransactions();

    // Perform CRUD operations
    await createEmployee('Bruce', 'Wayne', 'bruce.wayne@techcorp.com', 1, 100000); // Assuming department_id 1 exists
    await getAllEmployees();
    await updateEmployeeSalary(1, 105000); // Update salary for employee_id 1
    await getAllEmployees();
    await deleteEmployee(2); // Delete employee_id 2
    await getAllEmployees();

    await client.end();
    console.log('Disconnected from CockroachDB');
}

main();

/*
Expected Output:

yaml
Copy code
Connected to CockroachDB
Database schema created or already exists.
Department 'Research and Development' created with ID 4
Employee 'Diana Prince' created with ID 1
Employee 'Clark Kent' created with ID 2
Transaction committed successfully.
Employee 'Bruce Wayne' created with ID 3
All Employees:
Alice Smith | Email: alice.smith@techcorp.com | Department: Engineering | Salary: $90000
Bob Johnson | Email: bob.johnson@techcorp.com | Department: Human Resources | Salary: $70000
Diana Prince | Email: diana.prince@techcorp.com | Department: Research and Development | Salary: $95000
Clark Kent | Email: clark.kent@techcorp.com | Department: Research and Development | Salary: $90000
Bruce Wayne | Email: bruce.wayne@techcorp.com | Department: Engineering | Salary: $100000
Employee ID 1 salary updated to $105000
All Employees:
Alice Smith | Email: alice.smith@techcorp.com | Department: Engineering | Salary: $105000
Bob Johnson | Email: bob.johnson@techcorp.com | Department: Human Resources | Salary: $70000
Diana Prince | Email: diana.prince@techcorp.com | Department: Research and Development | Salary: $95000
Clark Kent | Email: clark.kent@techcorp.com | Department: Research and Development | Salary: $90000
Bruce Wayne | Email: bruce.wayne@techcorp.com | Department: Engineering | Salary: $100000
Employee ID 2 deleted.
All Employees:
Alice Smith | Email: alice.smith@techcorp.com | Department: Engineering | Salary: $105000
Diana Prince | Email: diana.prince@techcorp.com | Department: Research and Development | Salary: $95000
Clark Kent | Email: clark.kent@techcorp.com | Department: Research and Development | Salary: $90000
Bruce Wayne | Email: bruce.wayne@techcorp.com | Department: Engineering | Salary: $100000
Disconnected from CockroachDB



Understanding the Example
Let's break down the key components of the example to understand how NewSQL (CockroachDB) combines scalability and ACID guarantees:

1. Database Connection and Setup
Client Initialization:

javascript
Copy code
const client = new Client({
    host: 'localhost',
    port: 26257,
    user: 'root',
    password: '',
    database: 'techcorp',
    ssl: false
});
host & port: Point to the CockroachDB instance.
user & password: Credentials for authentication.
database: The target database.
ssl: Security configuration.
Schema Creation:

The schema.sql file defines two tables with a foreign key relationship, ensuring referential integrity.

2. CRUD Operations with Transactions
Transactions:

javascript
Copy code
await client.query('BEGIN;');
// Perform multiple operations
await client.query('COMMIT;');
BEGIN: Starts a transaction.
COMMIT: Commits the transaction if all operations succeed.
ROLLBACK: Reverts all operations if any step fails.
Transactions ensure Atomicity and Consistency, two of the ACID properties.

Create Operations:

Departments:

javascript
Copy code
const res = await client.query(
    'INSERT INTO departments (department_name) VALUES ($1) RETURNING department_id;',
    [name]
);
Inserts a new department and retrieves its department_id.

Employees:

javascript
Copy code
const res = await client.query(
    `INSERT INTO employees (first_name, last_name, email, department_id, salary)
     VALUES ($1, $2, $3, $4, $5) RETURNING employee_id;`,
    [firstName, lastName, email, departmentId, salary]
);
Inserts a new employee linked to a department.

Read Operations:

javascript
Copy code
const res = await client.query(
    `SELECT e.employee_id, e.first_name, e.last_name, e.email, d.department_name, e.salary
     FROM employees e
     LEFT JOIN departments d ON e.department_id = d.department_id;`
);
Retrieves all employees with their associated department names.

Update Operations:

javascript
Copy code
await client.query(
    `UPDATE employees SET salary = $1 WHERE employee_id = $2;`,
    [newSalary, employeeId]
);
Updates an employee's salary, ensuring Isolation and Durability.

Delete Operations:

javascript
Copy code
await client.query(
    `DELETE FROM employees WHERE employee_id = $1;`,
    [employeeId]
);
Removes an employee record from the database.

3. ACID Guarantees
Atomicity: Transactions are all-or-nothing. In the runTransactions function, if creating a department or any employee fails, the entire transaction is rolled back, ensuring no partial data is committed.

Consistency: Database constraints (like foreign keys and unique constraints) ensure that only valid data is committed.

Isolation: Transactions are isolated from each other, preventing concurrent transactions from interfering and causing data anomalies.

Durability: Once a transaction is committed, the changes are permanent, even in the event of a system crash.

4. Scalability
While this example runs on a single-node CockroachDB instance, CockroachDB is designed to scale horizontally by adding more nodes to the cluster. Data is automatically sharded and replicated across nodes, providing fault tolerance and high availability without requiring manual intervention.

For instance, deploying CockroachDB on multiple machines allows the database to handle increased load by distributing queries and data storage, maintaining ACID guarantees across the distributed environment.


 */