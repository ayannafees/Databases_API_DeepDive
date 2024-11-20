// app.js
const { sequelize, Employee, FullTimeEmployee, PartTimeEmployee, Department } = require('./models');

async function runOperations() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Fetch all Employees with their Departments
        const employees = await Employee.findAll({
            include: Department
        });

        console.log('\nAll Employees:');
        employees.forEach(emp => {
            if (emp.type === 'FullTime') {
                console.log(`${emp.firstName} ${emp.lastName} - Full-Time - Salary: $${emp.salary} - Department: ${emp.Department.name}`);
            } else if (emp.type === 'PartTime') {
                console.log(`${emp.firstName} ${emp.lastName} - Part-Time - Hourly Rate: $${emp.hourlyRate} - Department: ${emp.Department.name}`);
            } else {
                console.log(`${emp.firstName} ${emp.lastName} - ${emp.role} - Department: ${emp.Department.name}`);
            }
        });

        // Add a new Full-Time Employee
        const engineering = await Department.findOne({ where: { name: 'Engineering' } });
        const newFTEmployee = await FullTimeEmployee.create({
            firstName: 'Charlie',
            lastName: 'Williams',
            email: 'charlie.williams@company.com',
            role: 'Senior Engineer',
            type: 'FullTime',
            salary: 120000,
            departmentId: engineering.id
        });
        console.log(`\nAdded: ${newFTEmployee.firstName} ${newFTEmployee.lastName}`);

        // Add a new Part-Time Employee
        const hr = await Department.findOne({ where: { name: 'Human Resources' } });
        const newPTEmployee = await PartTimeEmployee.create({
            firstName: 'Diana',
            lastName: 'Prince',
            email: 'diana.prince@company.com',
            role: 'Recruiter',
            type: 'PartTime',
            hourlyRate: 50,
            departmentId: hr.id
        });
        console.log(`Added: ${newPTEmployee.firstName} ${newPTEmployee.lastName}`);

        // Update an Employee's Department
        const employeeToUpdate = await Employee.findOne({ where: { email: 'bob.johnson@company.com' } });
        const marketing = await Department.create({ name: 'Marketing' });
        await employeeToUpdate.update({ departmentId: marketing.id });
        console.log(`\nUpdated ${employeeToUpdate.firstName}'s department to Marketing.`);

        // Delete an Employee
        const employeeToDelete = await Employee.findOne({ where: { email: 'alice.smith@company.com' } });
        await employeeToDelete.destroy();
        console.log(`\nDeleted employee: ${employeeToDelete.firstName} ${employeeToDelete.lastName}`);

        // Final List of Employees
        const finalEmployees = await Employee.findAll({
            include: Department
        });

        console.log('\nFinal Employees:');
        finalEmployees.forEach(emp => {
            if (emp.type === 'FullTime') {
                console.log(`${emp.firstName} ${emp.lastName} - Full-Time - Salary: $${emp.salary} - Department: ${emp.Department.name}`);
            } else if (emp.type === 'PartTime') {
                console.log(`${emp.firstName} ${emp.lastName} - Part-Time - Hourly Rate: $${emp.hourlyRate} - Department: ${emp.Department.name}`);
            } else {
                console.log(`${emp.firstName} ${emp.lastName} - ${emp.role} - Department: ${emp.Department.name}`);
            }
        });

        await sequelize.close();
    } catch (error) {
        console.error('Error during operations:', error);
    }
}

runOperations();


/*
Connection has been established successfully.

All Employees:
Alice Smith - Full-Time - Salary: $90000 - Department: Engineering
Bob Johnson - Part-Time - Hourly Rate: $40 - Department: Human Resources

Added: Charlie Williams
Added: Diana Prince

Updated Bob's department to Marketing.

Deleted employee: Alice Smith

Final Employees:
Bob Johnson - Part-Time - Hourly Rate: $40 - Department: Marketing
Charlie Williams - Full-Time - Salary: $120000 - Department: Engineering
Diana Prince - Part-Time - Hourly Rate: $50 - Department: Human Resources
*/