# CipherSQLStudio Setup Guide

This guide will help you set up and run CipherSQLStudio on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **MongoDB Atlas Account** (or local MongoDB) - [Sign up](https://www.mongodb.com/cloud/atlas/register)

## Step 1: Database Setup

### PostgreSQL Setup

1. Install PostgreSQL on your system if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE cipher_sql_studio;
   ```
3. Note down your PostgreSQL credentials (host, port, username, password)

### MongoDB Atlas Setup

1. Sign up for a free MongoDB Atlas account
2. Create a new cluster (free tier is sufficient)
3. Create a database user with username and password
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string (MongoDB URI)

## Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env
   
   # On Windows (Command Prompt)
   copy .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```
   
   **📖 For detailed instructions on filling in the .env file, see [API_KEYS_SETUP.md](../API_KEYS_SETUP.md)**

4. Edit `.env` and fill in your configuration. **See [API_KEYS_SETUP.md](../API_KEYS_SETUP.md) for detailed step-by-step instructions** on how to obtain:
   - MongoDB Atlas connection string
   - PostgreSQL credentials
   - OpenAI or Google AI API key
   - JWT secret
   
   The `.env.example` file shows the format, and `API_KEYS_SETUP.md` provides detailed instructions for each service.

5. Seed the database with sample assignments:
   ```bash
   npm run seed
   ```

6. Start the backend server:
   ```bash
   npm start
   # OR for development with auto-reload:
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

## Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file in the frontend directory to customize the API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will open at `http://localhost:3000`

## Step 4: Verify Installation

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the assignment list page
3. Click on an assignment to start practicing SQL queries

## Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: 
  - Verify your MongoDB URI is correct
  - Ensure your IP is whitelisted in MongoDB Atlas
  - Check network connectivity

- **PostgreSQL Connection Error**:
  - Verify PostgreSQL is running
  - Check credentials in `.env` file
  - Ensure the database exists

- **Port Already in Use**:
  - Change the `PORT` in `.env` file
  - Or stop the process using port 5000

### Frontend Issues

- **Cannot connect to API**:
  - Ensure backend is running
  - Check `REACT_APP_API_URL` in frontend `.env`
  - Check CORS settings in backend

- **Monaco Editor not loading**:
  - Clear browser cache
  - Reinstall dependencies: `npm install`

### Database Issues

- **Assignments not showing**:
  - Run the seed script: `npm run seed` (in backend directory)
  - Check MongoDB connection

- **Query execution errors**:
  - Verify PostgreSQL connection
  - Check that tables are being created in the schema
  - Review backend logs for detailed error messages

## Development Tips

1. **Backend Development**: Use `npm run dev` to enable auto-reload with nodemon
2. **Frontend Development**: React's hot reload is enabled by default
3. **Database Seeding**: Re-run `npm run seed` anytime to reset assignments
4. **API Testing**: Use tools like Postman or curl to test API endpoints

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in your `.env` file
2. Use a secure `JWT_SECRET` (generate a strong random string)
3. Configure proper CORS origins
4. Use environment variables for all sensitive data
5. Build the frontend: `cd frontend && npm run build`
6. Serve the build folder using a production server (nginx, etc.)
7. Use a process manager like PM2 for the backend

## Next Steps

- Add more assignments to the seed script
- Customize the LLM prompt for hints
- Configure additional security settings
- Set up monitoring and logging

