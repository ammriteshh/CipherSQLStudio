# Quick Start Guide

Get CipherSQLStudio up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v16+) installed
- ✅ PostgreSQL installed and running
- ✅ MongoDB Atlas account (free tier works)
- ✅ OpenAI or Google AI API key (for hints feature)

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

## Step 2: Setup Environment Variables

1. **Create `.env` file** in the `backend` directory:
   ```bash
   cd backend
   copy .env.example .env  # Windows
   # OR
   cp .env.example .env    # Mac/Linux
   ```

2. **Fill in your `.env` file** - See [API_KEYS_SETUP.md](API_KEYS_SETUP.md) for detailed instructions.

   **Quick reference:**
   - **MongoDB**: Get from MongoDB Atlas → Database → Connect → Connection string
   - **PostgreSQL**: Use your local PostgreSQL credentials (default: postgres/postgres)
   - **LLM API**: Get from https://platform.openai.com/api-keys (OpenAI) OR https://makersuite.google.com/app/apikey (Google)
   - **JWT Secret**: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Step 3: Setup Databases

### PostgreSQL
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cipher_sql_studio;

# Exit
\q
```

### MongoDB
- Already configured via connection string in `.env`
- No manual database creation needed (created automatically)

## Step 4: Seed Sample Data

```bash
cd backend
npm run seed
```

This will create sample SQL assignments in MongoDB.

## Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# OR for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Step 6: Open in Browser

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

You should see the assignment list page! 🎉

## Troubleshooting

**"Cannot connect to MongoDB"**
→ Check your MongoDB connection string in `.env` and ensure your IP is whitelisted in MongoDB Atlas

**"Cannot connect to PostgreSQL"**
→ Ensure PostgreSQL is running and credentials in `.env` are correct

**"API key error"**
→ Verify your OpenAI/Google AI API key is correct and has credits/quota

**Need more help?**
→ See [API_KEYS_SETUP.md](API_KEYS_SETUP.md) for detailed setup instructions
→ See [SETUP.md](SETUP.md) for comprehensive setup guide

