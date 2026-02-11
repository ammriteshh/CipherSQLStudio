const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../models/Assignment');
const connectMongoDB = require('../db/mongodb');

dotenv.config();

const sampleAssignments = [
  {
    title: 'Combine Two Tables',
    description: 'Join data from Person and Address tables',
    difficulty: 'Beginner',
    question: `Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.

Return the result table in any order.

+----------+----------+-----------+
| personId | lastName | firstName |
+----------+----------+-----------+
| 1        | Wang     | Allen     |
| 2        | Alice    | Bob       |
+----------+----------+-----------+

Address table:
+-----------+----------+---------------+------------+
| addressId | personId | city          | state      |
+-----------+----------+---------------+------------+
| 1         | 2        | New York City | New York   |
| 2         | 3        | Leetcode      | California |
+-----------+----------+---------------+------------+

Output: 
+-----------+----------+---------------+----------+
| firstName | lastName | city          | state    |
+-----------+----------+---------------+----------+
| Allen     | Wang     | Null          | Null     |
| Bob       | Alice    | New York City | New York |
+-----------+----------+---------------+----------+
Explanation: 
There is no address in the address table for the personId = 1 so we return null in their city and state.
addressId = 1 contains information about the address of personId = 2.`,
    tableDefinitions: [
      {
        name: 'Person',
        description: 'Person information',
        createTableSQL: `
          CREATE TABLE Person (
            personId INT PRIMARY KEY,
            lastName VARCHAR(255),
            firstName VARCHAR(255)
          )
        `,
        sampleData: [
          { personId: 1, lastName: 'Wang', firstName: 'Allen' },
          { personId: 2, lastName: 'Alice', firstName: 'Bob' }
        ]
      },
      {
        name: 'Address',
        description: 'Address information',
        createTableSQL: `
          CREATE TABLE Address (
            addressId INT PRIMARY KEY,
            personId INT,
            city VARCHAR(255),
            state VARCHAR(255)
          )
        `,
        sampleData: [
          { addressId: 1, personId: 2, city: 'New York City', state: 'New York' },
          { addressId: 2, personId: 3, city: 'Leetcode', state: 'California' }
        ]
      }
    ]
  },
  {
    title: 'Find Engineering Employees',
    description: 'Filter rows based on department',
    difficulty: 'Beginner',
    question: `Write a SQL query to find the names of all employees who work in the "Engineering" department.

Return the result table in any order.

The result format is in the following example.

Example 1:

Input: 
Employees table:
+----+-----------+----------+-------------+
| id | firstName | lastName | department  |
+----+-----------+----------+-------------+
| 1  | Ravi      | Kant     | Engineering |
| 2  | Desham    | Seth     | Marketing   |
| 3  | Tushar    | Joshi    | Engineering |
+----+-----------+----------+-------------+

Output: 
+-----------+----------+
| firstName | lastName |
+-----------+----------+
| Ravi      | Kant     |
| Tushar    | Joshi    |
+-----------+----------+
Explanation: 
Ravi and Tushar are in the Engineering department. Desham is in Marketing.`,
    tableDefinitions: [
      {
        name: 'Employees',
        description: 'Employee information',
        createTableSQL: `
          CREATE TABLE Employees (
            id INT PRIMARY KEY,
            firstName VARCHAR(50),
            lastName VARCHAR(50),
            department VARCHAR(50)
          )
        `,
        sampleData: [
          { id: 1, firstName: 'Ravi', lastName: 'Kant', department: 'Engineering' },
          { id: 2, firstName: 'Desham', lastName: 'Seth', department: 'Marketing' },
          { id: 3, firstName: 'Tushar', lastName: 'Joshi', department: 'Engineering' }
        ]
      }
    ]
  },
  {
    title: 'Customer Orders',
    description: 'Combine data from Customers and Orders',
    difficulty: 'Intermediate',
    question: `Write a SQL query to retrieve all orders with their corresponding customer names. 
Return table with order_id, order_date, customer_name, and total_amount.

The result format is in the following example.

Example 1:

Input: 
Customers table:
+-------------+----------------+
| customer_id | customer_name  |
+-------------+----------------+
| 1           | Abhinav Sharma |
| 2           | Bobby Khan     |
| 3           | Mukesh Sharma  |
+-------------+----------------+

Orders table:
+----------+-------------+------------+--------------+
| order_id | customer_id | order_date | total_amount |
+----------+-------------+------------+--------------+
| 101      | 1           | 2024-01-15 | 150.00       |
| 102      | 2           | 2024-01-16 | 275.50       |
| 103      | 1           | 2024-01-17 | 89.99        |
+----------+-------------+------------+--------------+

Output: 
+----------+------------+----------------+--------------+
| order_id | order_date | customer_name  | total_amount |
+----------+------------+----------------+--------------+
| 101      | 2024-01-15 | Abhinav Sharma | 150.00       |
| 102      | 2024-01-16 | Bobby Khan     | 275.50       |
| 103      | 2024-01-17 | Abhinav Sharma | 89.99        |
+----------+------------+----------------+--------------+
Explanation: 
Orders 101 and 103 belong to Abhinav Sharma. Order 102 belongs to Bobby Khan.`,
    tableDefinitions: [
      {
        name: 'Customers',
        description: 'Customer information',
        createTableSQL: `
          CREATE TABLE Customers (
            customer_id INT PRIMARY KEY,
            customer_name VARCHAR(100)
          )
        `,
        sampleData: [
          { customer_id: 1, customer_name: 'Abhinav Sharma' },
          { customer_id: 2, customer_name: 'Bobby Khan' },
          { customer_id: 3, customer_name: 'Mukesh Sharma' }
        ]
      },
      {
        name: 'Orders',
        description: 'Order details',
        createTableSQL: `
          CREATE TABLE Orders (
            order_id INT PRIMARY KEY,
            customer_id INT,
            order_date DATE,
            total_amount DECIMAL(10, 2)
          )
        `,
        sampleData: [
          { order_id: 101, customer_id: 1, order_date: '2024-01-15', total_amount: 150.00 },
          { order_id: 102, customer_id: 2, order_date: '2024-01-16', total_amount: 275.50 },
          { order_id: 103, customer_id: 1, order_date: '2024-01-17', total_amount: 89.99 }
        ]
      }
    ]
  },
  {
    title: 'Highest Paid Employees',
    description: 'Sort employees by salary',
    difficulty: 'Beginner',
    question: `Write a SQL query to retrieve all employees sorted by salary in descending order. 

Return the result table in any order.

The result format is in the following example.

Example 1:

Input: 
Employees table:
+----+-----------+--------+
| id | firstName | salary |
+----+-----------+--------+
| 1  | Sresth    | 75000  |
| 2  | Vinayak   | 65000  |
| 3  | Harshit   | 80000  |
+----+-----------+--------+

Output: 
+-----------+--------+
| firstName | salary |
+-----------+--------+
| Harshit   | 80000  |
| Sresth    | 75000  |
| Vinayak   | 65000  |
+-----------+--------+
Explanation: 
Harshit has the highest salary, followed by Sresth, then Vinayak.`,
    tableDefinitions: [
      {
        name: 'Employees',
        description: 'Employee salaries',
        createTableSQL: `
          CREATE TABLE Employees (
            id INT PRIMARY KEY,
            firstName VARCHAR(50),
            salary INT
          )
        `,
        sampleData: [
          { id: 1, firstName: 'Sresth', salary: 75000 },
          { id: 2, firstName: 'Vinayak', salary: 65000 },
          { id: 3, firstName: 'Harshit', salary: 80000 }
        ]
      }
    ]
  },
  {
    title: 'Department Salary Stats',
    description: 'Calculate average salary per department',
    difficulty: 'Intermediate',
    question: `Write a SQL query to find the total number of employees, average salary, and total salary for each department.

Return the result table in any order.

The result format is in the following example.

Example 1:

Input: 
Employees table:
+----+-----------+-------------+--------+
| id | firstName | department  | salary |
+----+-----------+-------------+--------+
| 1  | Shabnam   | Engineering | 75000  |
| 2  | Palak     | Marketing   | 65000  |
| 3  | Jyoti     | Engineering | 80000  |
| 4  | Prateek   | Marketing   | 70000  |
+----+-----------+-------------+--------+

Output: 
+-------------+-------+-----------+--------------+
| department  | count | avg_salary| total_salary |
+-------------+-------+-----------+--------------+
| Engineering | 2     | 77500     | 155000       |
| Marketing   | 2     | 67500     | 135000       |
+-------------+-------+-----------+--------------+
Explanation: 
Engineering has 2 employees (75k + 80k = 155k total, 77.5k avg).
Marketing has 2 employees (65k + 70k = 135k total, 67.5k avg).`,
    tableDefinitions: [
      {
        name: 'Employees',
        description: 'Departmental data',
        createTableSQL: `
          CREATE TABLE Employees (
            id INT PRIMARY KEY,
            firstName VARCHAR(50),
            department VARCHAR(50),
            salary INT
          )
        `,
        sampleData: [
          { id: 1, firstName: 'Shabnam', department: 'Engineering', salary: 75000 },
          { id: 2, firstName: 'Palak', department: 'Marketing', salary: 65000 },
          { id: 3, firstName: 'Jyoti', department: 'Engineering', salary: 80000 },
          { id: 4, firstName: 'Prateek', department: 'Marketing', salary: 70000 }
        ]
      }
    ]
  },
  {
    title: 'High Earners',
    description: 'Find employees earning above average',
    difficulty: 'Advanced',
    question: `Write a SQL query to find all employees whose salary is greater than the average salary of all employees.

Return the result table in any order.

The result format is in the following example.

Example 1:

Input: 
Employees table:
+----+----------+--------+
| id | firstName| salary |
+----+----------+--------+
| 1  | Jayraj   | 75000  |
| 2  | Varad    | 65000  |
| 3  | Trishank | 80000  |
| 4  | Aastha   | 70000  |
+----+----------+--------+

Output: 
+-----------+--------+
| firstName | salary |
+-----------+--------+
| Jayraj    | 75000  |
| Trishank  | 80000  |
+-----------+--------+
Explanation: 
The average salary is (75k+65k+80k+70k)/4 = 72,500.
Jayraj (75k) and Trishank (80k) earn more than 72,500.`,
    tableDefinitions: [
      {
        name: 'Employees',
        description: 'Salary analysis',
        createTableSQL: `
          CREATE TABLE Employees (
            id INT PRIMARY KEY,
            firstName VARCHAR(50),
            salary INT
          )
        `,
        sampleData: [
          { id: 1, firstName: 'Jayraj', salary: 75000 },
          { id: 2, firstName: 'Varad', salary: 65000 },
          { id: 3, firstName: 'Trishank', salary: 80000 },
          { id: 4, firstName: 'Aastha', salary: 70000 }
        ]
      }
    ]
  },
  {
    title: 'Duplicate Emails',
    description: 'Find duplicate values',
    difficulty: 'Beginner',
    question: `Write a SQL query to report all the duplicate emails.

Return the result table in any order.

The result format is in the following example.

Example 1:

Input: 
Person table:
+----+---------+
| id | email   |
+----+---------+
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |
+----+---------+

Output: 
+---------+
| email   |
+---------+
| a@b.com |
+---------+
Explanation: a@b.com is repeated two times.`,
    tableDefinitions: [
      {
        name: 'Person',
        description: 'Email records',
        createTableSQL: `
          CREATE TABLE Person (
            id INT PRIMARY KEY,
            email VARCHAR(255)
          )
        `,
        sampleData: [
          { id: 1, email: 'a@b.com' },
          { id: 2, email: 'c@d.com' },
          { id: 3, email: 'a@b.com' }
        ]
      }
    ]
  },
  {
    title: 'Delete Duplicate Emails',
    description: 'Delete duplicate rows',
    difficulty: 'Beginner',
    question: `Write a SQL query to delete all duplicate emails, keeping only one unique email with the smallest id.

Return the result table in any order.

The result format is in the following example.

Example 1:

Input: 
Person table:
+----+------------------+
| id | email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
| 3  | john@example.com |
+----+------------------+

Output: 
+----+------------------+
| id | email            |
+----+------------------+
| 1  | john@example.com |
| 2  | bob@example.com  |
+----+------------------+
Explanation: john@example.com is repeated two times. We keep the row with the smallest Id = 1.`,
    tableDefinitions: [
      {
        name: 'Person',
        description: 'Email records',
        createTableSQL: `
          CREATE TABLE Person (
            id INT PRIMARY KEY,
            email VARCHAR(255)
          )
        `,
        sampleData: [
          { id: 1, email: 'john@example.com' },
          { id: 2, email: 'bob@example.com' },
          { id: 3, email: 'john@example.com' }
        ]
      }
    ]
  }
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

