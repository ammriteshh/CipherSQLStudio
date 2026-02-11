const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../models/Assignment');
const connectMongoDB = require('../db/mongodb');

dotenv.config();

const sampleAssignments = [
  {
    title: 'Select All Cities',
    description: 'Retrieve all columns from the city table.',
    difficulty: 'Beginner',
    question: `
**Problem**

Query all columns for all American cities in the **city** table with populations larger than 100,000. The countrycode for America is USA.

**Input Format**

The **city** table is described as follows:

| Field | Type |
| :--- | :--- |
| id | NUMBER |
| name | VARCHAR(17) |
| countrycode | VARCHAR(3) |
| district | VARCHAR(20) |
| population | NUMBER |

**Sample Input**

| id | name | countrycode | district | population |
| :--- | :--- | :--- | :--- | :--- |
| 1 | New York | USA | New York | 8398748 |
| 2 | Los Angeles | USA | California | 3990456 |
| 3 | Chicago | USA | Illinois | 2705994 |
| 4 | Tokyo | JPN | Tokyo | 13929286 |
| 5 | Smallville | USA | Kansas | 45000 |

**Sample Output**

| id | name | countrycode | district | population |
| :--- | :--- | :--- | :--- | :--- |
| 1 | New York | USA | New York | 8398748 |
| 2 | Los Angeles | USA | California | 3990456 |
| 3 | Chicago | USA | Illinois | 2705994 |

`,
    tableDefinitions: [
      {
        name: 'city',
        description: 'City information',
        createTableSQL: `
          CREATE TABLE city (
            id INT PRIMARY KEY,
            name VARCHAR(17),
            countrycode VARCHAR(3),
            district VARCHAR(20),
            population INT
          )
        `,
        sampleData: [
          { id: 1, name: 'New York', countrycode: 'USA', district: 'New York', population: 8398748 },
          { id: 2, name: 'Los Angeles', countrycode: 'USA', district: 'California', population: 3990456 },
          { id: 3, name: 'Chicago', countrycode: 'USA', district: 'Illinois', population: 2705994 },
          { id: 4, name: 'Tokyo', countrycode: 'JPN', district: 'Tokyo', population: 13929286 },
          { id: 5, name: 'Smallville', countrycode: 'USA', district: 'Kansas', population: 45000 }
        ]
      }
    ]
  },
  {
    title: 'Find Sick Patients',
    description: 'Filter patients based on diagnosis.',
    difficulty: 'Beginner',
    question: `
**Problem**
Write a SQL query to retrieve the **patient_id**, **patient_name**, and **conditions** of patients who have Type I Diabetes. Type I Diabetes always starts with DIAB1 prefix.

**Input Format**

The **patients** table is described as follows:

| Column Name | Type |
| :--- | :--- |
| patient_id | int |
| patient_name | varchar |
| conditions | varchar |

**Sample Input**

| patient_id | patient_name | conditions |
| :--- | :--- | :--- |
| 1 | Daniel | YFEV COUGH |
| 2 | Alice | |
| 3 | Bob | DIAB100 MYOP |
| 4 | George | ACNE DIAB100 |
| 5 | Alain | DIAB201 |

**Sample Output**

| patient_id | patient_name | conditions |
| :--- | :--- | :--- |
| 3 | Bob | DIAB100 MYOP |
| 4 | George | ACNE DIAB100 | 

`,
    tableDefinitions: [
      {
        name: 'patients',
        description: 'Patient health records',
        createTableSQL: `
          CREATE TABLE patients (
            patient_id INT PRIMARY KEY,
            patient_name VARCHAR(30),
            conditions VARCHAR(100)
          )
        `,
        sampleData: [
          { patient_id: 1, patient_name: 'Daniel', conditions: 'YFEV COUGH' },
          { patient_id: 2, patient_name: 'Alice', conditions: '' },
          { patient_id: 3, patient_name: 'Bob', conditions: 'DIAB100 MYOP' },
          { patient_id: 4, patient_name: 'George', conditions: 'ACNE DIAB100' },
          { patient_id: 5, patient_name: 'Alain', conditions: 'DIAB201' }
        ]
      }
    ]
  },
  {
    title: 'Average Movie Ratings',
    description: 'Calculate average rating for movies.',
    difficulty: 'Intermediate',
    question: `
**Problem**
Write a SQL query to find the average rating of each movie. Round the average rating to 2 decimal places.

**Input Format**

The **cinema** table:

| Column Name | Type |
| :--- | :--- |
| id | int |
| movie_name | varchar |
| rating | decimal |

**Sample Input**

| id | movie_name | rating |
| :--- | :--- | :--- |
| 1 | Avengers | 4.5 |
| 2 | Avengers | 4.8 |
| 3 | Joker | 4.9 |
| 4 | Joker | 4.2 |
| 5 | Avatar | 3.5 |

**Sample Output**

| movie_name | avg_rating |
| :--- | :--- |
| Avengers | 4.65 |
| Joker | 4.55 |
| Avatar | 3.50 |

`,
    tableDefinitions: [
      {
        name: 'cinema',
        description: 'Movie ratings data',
        createTableSQL: `
          CREATE TABLE cinema (
            id INT PRIMARY KEY,
            movie_name VARCHAR(50),
            rating DECIMAL(3, 1)
          )
        `,
        sampleData: [
          { id: 1, movie_name: 'Avengers', rating: 4.5 },
          { id: 2, movie_name: 'Avengers', rating: 4.8 },
          { id: 3, movie_name: 'Joker', rating: 4.9 },
          { id: 4, movie_name: 'Joker', rating: 4.2 },
          { id: 5, movie_name: 'Avatar', rating: 3.5 }
        ]
      }
    ]
  },
  {
    title: 'Orders Per Customer',
    description: 'Count orders for each customer.',
    difficulty: 'Intermediate',
    question: `
**Problem**
Write a SQL query to find the number of orders placed by each customer. Return the result table sorted by **number_of_orders** in descending order.

**Input Format**

The **orders** table:

| Column Name | Type |
| :--- | :--- |
| order_number | int |
| customer_number | int |

**Sample Input**

| order_number | customer_number |
| :--- | :--- |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 3 |

**Sample Output**

| customer_number | number_of_orders |
| :--- | :--- |
| 3 | 2 |
| 1 | 1 |
| 2 | 1 |

`,
    tableDefinitions: [
      {
        name: 'orders',
        description: 'Order records',
        createTableSQL: `
          CREATE TABLE orders (
            order_number INT PRIMARY KEY,
            customer_number INT
          )
        `,
        sampleData: [
          { order_number: 1, customer_number: 1 },
          { order_number: 2, customer_number: 2 },
          { order_number: 3, customer_number: 3 },
          { order_number: 4, customer_number: 3 }
        ]
      }
    ]
  },
  {
    title: 'High Spending Customers',
    description: 'Filter grouped data using HAVING.',
    difficulty: 'Intermediate',
    question: `
**Problem**
Write a SQL query to find the **customer_id** and total amount spent for customers who have spent more than 3000 in total.

**Input Format**

The **purchases** table:

| Column Name | Type |
| :--- | :--- |
| id | int |
| customer_id | int |
| amount | int |

**Sample Input**

| id | customer_id | amount |
| :--- | :--- | :--- |
| 1 | 1 | 1000 |
| 2 | 1 | 2500 |
| 3 | 2 | 1500 |
| 4 | 2 | 1000 |
| 5 | 3 | 4000 |

**Sample Output**

| customer_id | total_spent |
| :--- | :--- |
| 1 | 3500 |
| 3 | 4000 |

`,
    tableDefinitions: [
      {
        name: 'purchases',
        description: 'Customer purchase history',
        createTableSQL: `
          CREATE TABLE purchases (
            id INT PRIMARY KEY,
            customer_id INT,
            amount INT
          )
        `,
        sampleData: [
          { id: 1, customer_id: 1, amount: 1000 },
          { id: 2, customer_id: 1, amount: 2500 },
          { id: 3, customer_id: 2, amount: 1500 },
          { id: 4, customer_id: 2, amount: 1000 },
          { id: 5, customer_id: 3, amount: 4000 }
        ]
      }
    ]
  },
  {
    title: 'Employee Departments',
    description: 'INNER JOIN example.',
    difficulty: 'Intermediate',
    question: `
**Problem**
Write a SQL query to report the name and department of each employee.

**Input Format**

**employee** table:
| id | name | department_id |
| :--- | :--- | :--- |
| 1 | Alice | 1 |
| 2 | Bob | 2 |
| 3 | Charlie | 1 |

**department** table:
| id | dept_name |
| :--- | :--- |
| 1 | HR |
| 2 | Engineering |

**Sample Output**

| name | dept_name |
| :--- | :--- |
| Alice | HR |
| Bob | Engineering |
| Charlie | HR |

`,
    tableDefinitions: [
      {
        name: 'employee',
        description: 'Employees',
        createTableSQL: `
          CREATE TABLE employee (
            id INT PRIMARY KEY,
            name VARCHAR(50),
            department_id INT
          )
        `,
        sampleData: [
          { id: 1, name: 'Alice', department_id: 1 },
          { id: 2, name: 'Bob', department_id: 2 },
          { id: 3, name: 'Charlie', department_id: 1 }
        ]
      },
      {
        name: 'department',
        description: 'Departments',
        createTableSQL: `
          CREATE TABLE department (
            id INT PRIMARY KEY,
            dept_name VARCHAR(50)
          )
        `,
        sampleData: [
          { id: 1, dept_name: 'HR' },
          { id: 2, dept_name: 'Engineering' }
        ]
      }
    ]
  },
  {
    title: 'Above Average Salaries',
    description: 'Using subqueries.',
    difficulty: 'Advanced',
    question: `
**Problem**
Write a SQL query to find the names of employees who have a salary greater than the average salary of all employees.

**Input Format**

**salaries** table:
| id | name | salary |
| :--- | :--- | :--- |
| 1 | Joe | 70000 |
| 2 | Jim | 90000 |
| 3 | Henry | 80000 |
| 4 | Sam | 60000 |
| 5 | Max | 90000 |

**Sample Output**

| name | salary |
| :--- | :--- |
| Jim | 90000 |
| Henry | 80000 |
| Max | 90000 |

`,
    tableDefinitions: [
      {
        name: 'salaries',
        description: 'Employee Salary Records',
        createTableSQL: `
          CREATE TABLE salaries (
            id INT PRIMARY KEY,
            name VARCHAR(50),
            salary INT
          )
        `,
        sampleData: [
          { id: 1, name: 'Joe', salary: 70000 },
          { id: 2, name: 'Jim', salary: 90000 },
          { id: 3, name: 'Henry', salary: 80000 },
          { id: 4, name: 'Sam', salary: 60000 },
          { id: 5, name: 'Max', salary: 90000 }
        ]
      }
    ]
  },
  {
    title: 'Delete Duplicate Emails',
    description: 'Advanced duplicate handling.',
    difficulty: 'Advanced',
    question: `
**Problem**
Write a SQL query to delete all duplicate emails in the **person** table, keeping only the one with the smallest **id**.

**Input Format**

**person** table:
| id | email |
| :--- | :--- |
| 1 | john@example.com |
| 2 | bob@example.com |
| 3 | john@example.com |

**Sample Output**

| id | email |
| :--- | :--- |
| 1 | john@example.com |
| 2 | bob@example.com |

**Explanation**
Id 3 is a duplicate of Id 1, so it is removed.

`,
    tableDefinitions: [
      {
        name: 'person',
        description: 'Email records',
        createTableSQL: `
          CREATE TABLE person (
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
