// cassandra.js
const cassandra = require('cassandra-driver');

// Create a client instance
const client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], // Replace with your Cassandra nodes
    localDataCenter: 'datacenter1', // Replace with your data center
    keyspace: 'techcorp'
});

async function run() {
    try {
        // Connect to Cassandra
        await client.connect();
        console.log('Connected to Cassandra');

        // Create Keyspace (if not exists)
        const createKeyspaceQuery = `
            CREATE KEYSPACE IF NOT EXISTS techcorp
            WITH replication = {'class': 'SimpleStrategy', 'replication_factor' : 1};
        `;
        await client.execute(createKeyspaceQuery);
        console.log('Keyspace "techcorp" ensured');

        // Use Keyspace
        await client.execute('USE techcorp');

        // Create Table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS employees (
                employee_id int PRIMARY KEY,
                first_name text,
                last_name text,
                department text,
                skills set<text>
            );
        `;
        await client.execute(createTableQuery);
        console.log('Table "employees" ensured');

        // Insert Data
        const insertQuery = 'INSERT INTO employees (employee_id, first_name, last_name, department, skills) VALUES (?, ?, ?, ?, ?)';
        await client.execute(insertQuery, [1001, 'Alice', 'Smith', 'Engineering', new Set(['JavaScript', 'Cassandra'])], { prepare: true });
        await client.execute(insertQuery, [1002, 'Bob', 'Johnson', 'Human Resources', new Set(['Recruitment'])], { prepare: true });
        console.log('Inserted employees');

        // Query Data
        const selectQuery = 'SELECT * FROM employees WHERE department = ?';
        const result = await client.execute(selectQuery, ['Engineering'], { prepare: true });
        console.log('Engineering Department Employees:', result.rows);

        // Update Data
        const updateQuery = 'UPDATE employees SET skills = skills + ? WHERE employee_id = ?';
        await client.execute(updateQuery, [new Set(['Node.js']), 1001], { prepare: true });
        console.log('Updated Alice\'s skills');

        // Delete Data
        const deleteQuery = 'DELETE FROM employees WHERE employee_id = ?';
        await client.execute(deleteQuery, [1002], { prepare: true });
        console.log('Deleted Bob');

        // Final State
        const finalResult = await client.execute('SELECT * FROM employees');
        console.log('Final Employees:', finalResult.rows);
    } catch (err) {
        console.error('An error occurred:', err);
    } finally {
        // Close the connection
        await client.shutdown();
        console.log('Cassandra connection closed');
    }
}

run();


/*
Expected Output:

Connected to Cassandra
Keyspace "techcorp" ensured
Table "employees" ensured
Inserted employees
Engineering Department Employees: [
  {
    employee_id: 1001,
    first_name: 'Alice',
    last_name: 'Smith',
    department: 'Engineering',
    skills: Set { 'JavaScript', 'Cassandra' }
  }
]
Updated Alice's skills
Deleted Bob
Final Employees: [
  {
    employee_id: 1001,
    first_name: 'Alice',
    last_name: 'Smith',
    department: 'Engineering',
    skills: Set { 'JavaScript', 'Cassandra', 'Node.js' }
  }
]
Cassandra connection closed
Explanation:

Create Keyspace and Table: Defines the database namespace and the employees table with a primary key and a set of skills.
Insert: Adds two employees with their respective skills.
Query: Retrieves employees in the Engineering department.
Update: Adds a new skill to Alice's skill set.
Delete: Removes Bob from the table.
Final State: Displays the remaining employees.
Notes:

Sets: Column types like set<text> allow storing unordered collections without duplicates.
Prepared Statements: Enhance performance and security by precompiling queries.
*/