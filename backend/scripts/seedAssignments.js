const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Assignment = require('../models/Assignment');
const connectMongoDB = require('../db/mongodb');

dotenv.config();

const sampleAssignments = require('../data/assignments');

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
