// setup.js
const { sequelize, Employee, FullTimeEmployee, PartTimeEmployee, Department } = require('./models');

async function setupDatabase() {
    try {
        await sequelize.sync({ force: true }); // Recreate tables

        // Create Departments
        const engineering = await Department.create({ name: 'Engineering' });
        const hr = await Department.create({ name: 'Human Resources' });

        // Create Employees
        await FullTimeEmployee.create({
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice.smith@company.com',
            role: 'Engineer',
            type: 'FullTime',
            salary: 90000,
            departmentId: engineering.id
        });

        await PartTimeEmployee.create({
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@company.com',
            role: 'HR Specialist',
            type: 'PartTime',
            hourlyRate: 40,
            departmentId: hr.id
        });

        console.log('Database setup complete.');
        await sequelize.close();
    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

setupDatabase();
