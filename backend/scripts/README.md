# Seed Scripts

## seedAssignments.js

This script seeds the MongoDB database with sample SQL assignments.

### Usage

```bash
cd backend
node scripts/seedAssignments.js
```

Make sure your `.env` file is configured with the correct `MONGODB_URI` before running the script.

The script will:
1. Connect to MongoDB
2. Clear existing assignments
3. Insert sample assignments with table definitions and sample data

### Sample Assignments Included

1. **Basic SELECT Query** (Beginner)
   - Learn to retrieve data from a single table

2. **Filtering with WHERE Clause** (Beginner)
   - Filter rows based on conditions

3. **JOIN Operations** (Intermediate)
   - Combine data from multiple tables

You can modify `sampleAssignments` array in the script to add more assignments.

