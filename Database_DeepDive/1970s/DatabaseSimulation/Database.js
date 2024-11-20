// database.js
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (creates the file if it doesn't exist)
const db = new sqlite3.Database('./techcorp.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the TechCorp database.');
    }
});

// Create Departments table
db.run(`CREATE TABLE IF NOT EXISTS Departments (
    DepartmentID INTEGER PRIMARY KEY,
    DepartmentName TEXT NOT NULL
);`, (err) => {
    if (err) {
        console.error('Error creating Departments table:', err.message);
    } else {
        console.log('Departments table ready.');
    }
});

// Create Employees table with a foreign key referencing Departments
db.run(`CREATE TABLE IF NOT EXISTS Employees (
    EmployeeID INTEGER PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    DepartmentID INTEGER,
    Email TEXT UNIQUE,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);`, (err) => {
    if (err) {
        console.error('Error creating Employees table:', err.message);
    } else {
        console.log('Employees table ready.');
    }
});

// Insert initial data into Departments
const departments = [
    { DepartmentID: 1, DepartmentName: 'Engineering' },
    { DepartmentID: 2, DepartmentName: 'Human Resources' },
    { DepartmentID: 3, DepartmentName: 'Marketing' }
];

const insertDepartment = db.prepare(`INSERT OR IGNORE INTO Departments (DepartmentID, DepartmentName) VALUES (?, ?);`);

departments.forEach((dept) => {
    insertDepartment.run(dept.DepartmentID, dept.DepartmentName, (err) => {
        if (err) {
            console.error('Error inserting department:', err.message);
        }
    });
});

insertDepartment.finalize(() => {
    console.log('Initial departments inserted.');
});

// Insert initial data into Employees
const employees = [
    { EmployeeID: 101, FirstName: 'Alice', LastName: 'Smith', DepartmentID: 1, Email: 'alice.smith@techcorp.com' },
    { EmployeeID: 102, FirstName: 'Bob', LastName: 'Johnson', DepartmentID: 2, Email: 'bob.johnson@techcorp.com' },
    { EmployeeID: 103, FirstName: 'Charlie', LastName: 'Williams', DepartmentID: 1, Email: 'charlie.williams@techcorp.com' }
];

const insertEmployee = db.prepare(`INSERT OR IGNORE INTO Employees (EmployeeID, FirstName, LastName, DepartmentID, Email) VALUES (?, ?, ?, ?, ?);`);

employees.forEach((emp) => {
    insertEmployee.run(emp.EmployeeID, emp.FirstName, emp.LastName, emp.DepartmentID, emp.Email, (err) => {
        if (err) {
            console.error('Error inserting employee:', err.message);
        }
    });
});

insertEmployee.finalize(() => {
    console.log('Initial employees inserted.');
});

// Close the database connection after setup
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database setup complete.');
    }
});


