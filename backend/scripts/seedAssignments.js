const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../models/Assignment');
const connectMongoDB = require('../db/mongodb');

dotenv.config();

const sampleAssignments = [
  {
    title: 'Basic SELECT Query',
    description: 'Learn to retrieve data from a single table',
    difficulty: 'Beginner',
    question: 'Write a SQL query to select all columns and all rows from the "employees" table.',
    tableDefinitions: [
      {
        name: 'employees',
        description: 'Employee information table',
        createTableSQL: `
          CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            department VARCHAR(50),
            salary DECIMAL(10, 2),
            hire_date DATE
          )
        `,
        sampleData: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            department: 'Engineering',
            salary: 75000.00,
            hire_date: '2022-01-15'
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            department: 'Marketing',
            salary: 65000.00,
            hire_date: '2022-03-20'
          },
          {
            id: 3,
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
            department: 'Engineering',
            salary: 80000.00,
            hire_date: '2021-11-10'
          },
        ],
      },
    ],
  },
  {
    title: 'Filtering with WHERE Clause',
    description: 'Filter rows based on conditions',
    difficulty: 'Beginner',
    question: 'Write a SQL query to find all employees in the "Engineering" department.',
    tableDefinitions: [
      {
        name: 'employees',
        description: 'Employee information table',
        createTableSQL: `
          CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            department VARCHAR(50),
            salary DECIMAL(10, 2),
            hire_date DATE
          )
        `,
        sampleData: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            department: 'Engineering',
            salary: 75000.00,
            hire_date: '2022-01-15'
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            department: 'Marketing',
            salary: 65000.00,
            hire_date: '2022-03-20'
          },
          {
            id: 3,
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
            department: 'Engineering',
            salary: 80000.00,
            hire_date: '2021-11-10'
          },
        ],
      },
    ],
  },
  {
    title: 'JOIN Operations',
    description: 'Combine data from multiple tables',
    difficulty: 'Intermediate',
    question: 'Write a SQL query to retrieve all orders with their corresponding customer names. Show order_id, order_date, customer_name, and total_amount.',
    tableDefinitions: [
      {
        name: 'customers',
        description: 'Customer information table',
        createTableSQL: `
          CREATE TABLE customers (
            customer_id SERIAL PRIMARY KEY,
            customer_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20)
          )
        `,
        sampleData: [
          {
            customer_id: 1,
            customer_name: 'Alice Williams',
            email: 'alice@example.com',
            phone: '555-0101'
          },
          {
            customer_id: 2,
            customer_name: 'Bob Miller',
            email: 'bob@example.com',
            phone: '555-0102'
          },
          {
            customer_id: 3,
            customer_name: 'Charlie Brown',
            email: 'charlie@example.com',
            phone: '555-0103'
          },
        ],
      },
      {
        name: 'orders',
        description: 'Order information table',
        createTableSQL: `
          CREATE TABLE orders (
            order_id SERIAL PRIMARY KEY,
            customer_id INTEGER REFERENCES customers(customer_id),
            order_date DATE NOT NULL,
            total_amount DECIMAL(10, 2) NOT NULL
          )
        `,
        sampleData: [
          {
            order_id: 101,
            customer_id: 1,
            order_date: '2024-01-15',
            total_amount: 150.00
          },
          {
            order_id: 102,
            customer_id: 2,
            order_date: '2024-01-16',
            total_amount: 275.50
          },
          {
            order_id: 103,
            customer_id: 1,
            order_date: '2024-01-17',
            total_amount: 89.99
          },
        ],
      },
    ],
  },
  {
    title: 'ORDER BY and Sorting',
    description: 'Sort query results',
    difficulty: 'Beginner',
    question: 'Write a SQL query to retrieve all employees sorted by salary in descending order. Show employee name and salary.',
    tableDefinitions: [
      {
        name: 'employees',
        description: 'Employee information table',
        createTableSQL: `
          CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            department VARCHAR(50),
            salary DECIMAL(10, 2),
            hire_date DATE
          )
        `,
        sampleData: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            department: 'Engineering',
            salary: 75000.00,
            hire_date: '2022-01-15'
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            department: 'Marketing',
            salary: 65000.00,
            hire_date: '2022-03-20'
          },
          {
            id: 3,
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
            department: 'Engineering',
            salary: 80000.00,
            hire_date: '2021-11-10'
          },
        ],
      },
    ],
  },
  {
    title: 'Aggregate Functions',
    description: 'Use COUNT, SUM, AVG functions',
    difficulty: 'Intermediate',
    question: 'Write a SQL query to find the total number of employees, average salary, and total salary for each department.',
    tableDefinitions: [
      {
        name: 'employees',
        description: 'Employee information table',
        createTableSQL: `
          CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            department VARCHAR(50),
            salary DECIMAL(10, 2),
            hire_date DATE
          )
        `,
        sampleData: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            department: 'Engineering',
            salary: 75000.00,
            hire_date: '2022-01-15'
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            department: 'Marketing',
            salary: 65000.00,
            hire_date: '2022-03-20'
          },
          {
            id: 3,
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
            department: 'Engineering',
            salary: 80000.00,
            hire_date: '2021-11-10'
          },
          {
            id: 4,
            first_name: 'Alice',
            last_name: 'Williams',
            email: 'alice.williams@example.com',
            department: 'Marketing',
            salary: 70000.00,
            hire_date: '2022-05-10'
          },
        ],
      },
    ],
  },
  {
    title: 'Subqueries',
    description: 'Use nested SELECT statements',
    difficulty: 'Advanced',
    question: 'Write a SQL query to find all employees whose salary is greater than the average salary of all employees.',
    tableDefinitions: [
      {
        name: 'employees',
        description: 'Employee information table',
        createTableSQL: `
          CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            department VARCHAR(50),
            salary DECIMAL(10, 2),
            hire_date DATE
          )
        `,
        sampleData: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            department: 'Engineering',
            salary: 75000.00,
            hire_date: '2022-01-15'
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
            department: 'Marketing',
            salary: 65000.00,
            hire_date: '2022-03-20'
          },
          {
            id: 3,
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
            department: 'Engineering',
            salary: 80000.00,
            hire_date: '2021-11-10'
          },
          {
            id: 4,
            first_name: 'Alice',
            last_name: 'Williams',
            email: 'alice.williams@example.com',
            department: 'Marketing',
            salary: 70000.00,
            hire_date: '2022-05-10'
          },
        ],
      },
    ],
  },
];

async function seedAssignments() {
  try {
    await connectMongoDB();
    
    console.log('Clearing existing assignments...');
    await Assignment.deleteMany({});
    
    console.log('Seeding assignments...');
    const inserted = await Assignment.insertMany(sampleAssignments);
    
    console.log(`Successfully seeded ${inserted.length} assignments!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding assignments:', error);
    process.exit(1);
  }
}

seedAssignments();

