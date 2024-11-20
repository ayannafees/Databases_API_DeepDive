// models.js
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'company.db',
    logging: false
});

// Base Employee Model
class Employee extends Model {}
Employee.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Discriminator for inheritance
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Employee',
    tableName: 'Employees',
    timestamps: false,
    // Enable Single Table Inheritance
    defaultScope: {
        where: {
            type: 'Employee'
        }
    }
});

// Full-Time Employee Model
class FullTimeEmployee extends Employee {}
FullTimeEmployee.init({
    salary: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'FullTimeEmployee',
    tableName: 'Employees',
    timestamps: false,
    // Override default scope
    defaultScope: {
        where: {
            type: 'FullTime'
        }
    }
});

// Part-Time Employee Model
class PartTimeEmployee extends Employee {}
PartTimeEmployee.init({
    hourlyRate: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'PartTimeEmployee',
    tableName: 'Employees',
    timestamps: false,
    // Override default scope
    defaultScope: {
        where: {
            type: 'PartTime'
        }
    }
});

// Department Model
class Department extends Model {}
Department.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Department',
    tableName: 'Departments',
    timestamps: false
});

// Define Relationships
Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = {
    sequelize,
    Employee,
    FullTimeEmployee,
    PartTimeEmployee,
    Department
};