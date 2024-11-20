// Hierarchical Data Structure
const company = {
    name: "TechCorp",
    departments: [
        {
            name: "Engineering",
            employees: [
                { id: 1, name: "Alice", role: "Engineer" },
                { id: 2, name: "Bob", role: "Senior Engineer" }
            ]
        },
        {
            name: "HR",
            employees: [
                { id: 3, name: "Charlie", role: "HR Manager" }
            ]
        }
    ]
};

//Operations
//Add a Department
//Add an Employee to a Department
//Retrieve All Employees in a Department
// Hierarchical Model Simulation
// Function to add a new department
function addDepartment(deptName) {
    // Check if department already exists
    const exists = company.departments.some(dept => dept.name === deptName);
    if (exists) {
        console.log(`Department "${deptName}" already exists.`);
        return;
    }
    company.departments.push({ name: deptName, employees: [] });
    console.log(`Department "${deptName}" added.`);
}

// Function to add an employee to a department
function addEmployee(deptName, employee) {
    const department = company.departments.find(dept => dept.name === deptName);
    if (!department) {
        console.log(`Department "${deptName}" not found.`);
        return;
    }
    department.employees.push(employee);
    console.log(`Employee "${employee.name}" added to "${deptName}" department.`);
}

// Function to get all employees in a department
function getEmployees(deptName) {
    const department = company.departments.find(dept => dept.name === deptName);
    if (!department) {
        console.log(`Department "${deptName}" not found.`);
        return [];
    }
    return department.employees;
}

// Example Usage
addDepartment("Marketing");
addEmployee("Marketing", { id: 4, name: "Diana", role: "Marketing Specialist" });

console.log("Engineering Department Employees:", getEmployees("Engineering"));
console.log("Marketing Department Employees:", getEmployees("Marketing"));



//Expected Output
/*
Department "Marketing" added.
Employee "Diana" added to "Marketing" department.
Engineering Department Employees: [
  { id: 1, name: 'Alice', role: 'Engineer' },
  { id: 2, name: 'Bob', role: 'Senior Engineer' }
]
Marketing Department Employees: [
  { id: 4, name: 'Diana', role: 'Marketing Specialist' }
]
*/