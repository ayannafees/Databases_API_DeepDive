-- schema.sql

CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    department_name STRING NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    first_name STRING NOT NULL,
    last_name STRING NOT NULL,
    email STRING NOT NULL UNIQUE,
    department_id INT REFERENCES departments(department_id),
    salary DECIMAL
);
