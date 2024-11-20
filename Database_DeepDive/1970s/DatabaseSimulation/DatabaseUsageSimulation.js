// app.js
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./techcorp.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the TechCorp database.');
    }
});

// Function to add a new employee
function addEmployee(employee, callback) {
    const { EmployeeID, FirstName, LastName, DepartmentID, Email } = employee;
    const sql = `INSERT INTO Employees (EmployeeID, FirstName, LastName, DepartmentID, Email) VALUES (?, ?, ?, ?, ?);`;
    db.run(sql, [EmployeeID, FirstName, LastName, DepartmentID, Email], function(err) {
        if (err) {
            console.error('Error adding employee:', err.message);
            callback(err);
        } else {
            console.log(`Employee ${FirstName} ${LastName} added with ID ${EmployeeID}.`);
            callback(null);
        }
    });
}

// Function to retrieve all employees
function getAllEmployees(callback) {
    const sql = `
        SELECT Employees.EmployeeID, Employees.FirstName, Employees.LastName, Departments.DepartmentName, Employees.Email
        FROM Employees
        LEFT JOIN Departments ON Employees.DepartmentID = Departments.DepartmentID;
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving employees:', err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

// Function to update an employee's department
function updateEmployeeDepartment(EmployeeID, newDepartmentID, callback) {
    const sql = `UPDATE Employees SET DepartmentID = ? WHERE EmployeeID = ?;`;
    db.run(sql, [newDepartmentID, EmployeeID], function(err) {
        if (err) {
            console.error('Error updating employee:', err.message);
            callback(err);
        } else {
            if (this.changes === 0) {
                console.log(`No employee found with ID ${EmployeeID}.`);
            } else {
                console.log(`Employee ID ${EmployeeID} department updated to ${newDepartmentID}.`);
            }
            callback(null);
        }
    });
}

// Function to delete an employee
function deleteEmployee(EmployeeID, callback) {
    const sql = `DELETE FROM Employees WHERE EmployeeID = ?;`;
    db.run(sql, [EmployeeID], function(err) {
        if (err) {
            console.error('Error deleting employee:', err.message);
            callback(err);
        } else {
            if (this.changes === 0) {
                console.log(`No employee found with ID ${EmployeeID}.`);
            } else {
                console.log(`Employee ID ${EmployeeID} deleted.`);
            }
            callback(null);
        }
    });
}

// Example Usage
function runExamples() {
    // Add a new employee
    const newEmployee = {
        EmployeeID: 104,
        FirstName: 'Diana',
        LastName: 'Prince',
        DepartmentID: 3,
        Email: 'diana.prince@techcorp.com'
    };
    addEmployee(newEmployee, (err) => {
        if (!err) {
            // Retrieve all employees
            getAllEmployees((err, employees) => {
                if (!err) {
                    console.log('\nAll Employees:');
                    employees.forEach(emp => {
                        console.log(`${emp.EmployeeID}: ${emp.FirstName} ${emp.LastName} - ${emp.DepartmentName} - ${emp.Email}`);
                    });

                    // Update an employee's department
                    updateEmployeeDepartment(104, 1, (err) => {
                        if (!err) {
                            // Retrieve updated employees
                            getAllEmployees((err, updatedEmployees) => {
                                if (!err) {
                                    console.log('\nUpdated Employees:');
                                    updatedEmployees.forEach(emp => {
                                        console.log(`${emp.EmployeeID}: ${emp.FirstName} ${emp.LastName} - ${emp.DepartmentName} - ${emp.Email}`);
                                    });

                                    // Delete an employee
                                    deleteEmployee(104, (err) => {
                                        if (!err) {
                                            // Final list of employees
                                            getAllEmployees((err, finalEmployees) => {
                                                if (!err) {
                                                    console.log('\nFinal Employees:');
                                                    finalEmployees.forEach(emp => {
                                                        console.log(`${emp.EmployeeID}: ${emp.FirstName} ${emp.LastName} - ${emp.DepartmentName} - ${emp.Email}`);
                                                    });

                                                    // Close the database connection
                                                    db.close((err) => {
                                                        if (err) {
                                                            console.error('Error closing database:', err.message);
                                                        } else {
                                                            console.log('\nDatabase connection closed.');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

// Run the example operations
runExamples();



/*
Expected Output:

sql
Copy code
Connected to the TechCorp database.
Employee Diana Prince added with ID 104.

All Employees:
101: Alice Smith - Engineering - alice.smith@techcorp.com
102: Bob Johnson - Human Resources - bob.johnson@techcorp.com
103: Charlie Williams - Engineering - charlie.williams@techcorp.com
104: Diana Prince - Marketing - diana.prince@techcorp.com
Employee ID 104 department updated to 1.

Updated Employees:
101: Alice Smith - Engineering - alice.smith@techcorp.com
102: Bob Johnson - Human Resources - bob.johnson@techcorp.com
103: Charlie Williams - Engineering - charlie.williams@techcorp.com
104: Diana Prince - Engineering - diana.prince@techcorp.com
Employee ID 104 deleted.

Final Employees:
101: Alice Smith - Engineering - alice.smith@techcorp.com
102: Bob Johnson - Human Resources - bob.johnson@techcorp.com
103: Charlie Williams - Engineering - charlie.williams@techcorp.com

Database connection closed.
*/