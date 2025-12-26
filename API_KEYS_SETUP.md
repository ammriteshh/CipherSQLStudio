# API Keys and Database Setup Guide

This guide will walk you through obtaining and configuring all the required API keys and database credentials for CipherSQLStudio.

## Step 1: Create the .env File

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Copy the example file to create your `.env` file:
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env
   
   # On Windows (Command Prompt)
   copy .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

3. Open the `.env` file in a text editor and fill in the values as described below.

---

## Step 2: MongoDB Atlas Setup

### Why MongoDB?
MongoDB Atlas is used to store assignments, user data, and progress tracking.

### How to Get Your MongoDB Connection String:

1. **Sign up for MongoDB Atlas** (Free tier available):
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "M0 Free" (Free tier)
   - Choose a cloud provider and region (closest to you)
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP Address**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - For production, add your specific IP address
   - Click "Confirm"

5. **Get Your Connection String**:
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add your database name before the `?`: `/cipher_sql_studio?`

### Example MongoDB URI:
```
MONGODB_URI=mongodb+srv://myusername:mypassword@cluster0.abc123.mongodb.net/cipher_sql_studio?retryWrites=true&w=majority
```

**Fill this in your `.env` file as `MONGODB_URI`**

---

## Step 3: PostgreSQL Setup

### Why PostgreSQL?
PostgreSQL is used as the sandbox database for executing SQL queries safely.

### Option A: Local PostgreSQL Installation

1. **Install PostgreSQL** (if not already installed):
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql` or download from https://www.postgresql.org/download/macosx/
   - Linux: `sudo apt-get install postgresql` (Ubuntu/Debian)

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE cipher_sql_studio;
   
   # Exit
   \q
   ```

3. **Get Your Credentials**:
   - Default user: `postgres`
   - Password: The password you set during installation
   - Default port: `5432`
   - Default host: `localhost`

### Option B: PostgreSQL on Cloud (Alternative)
You can use services like:
- AWS RDS PostgreSQL
- Heroku Postgres
- ElephantSQL (Free tier available)
- Supabase (Free tier available)

### Fill in .env file:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_actual_postgres_password
POSTGRES_DATABASE=cipher_sql_studio
```

**Update these values in your `.env` file**

---

## Step 4: LLM API Key Setup (Choose One)

You need either OpenAI OR Google AI API key for the hint generation feature.

### Option 1: OpenAI API Key (Recommended)

1. **Sign up for OpenAI**:
   - Go to: https://platform.openai.com/signup
   - Create an account (requires phone verification)

2. **Add Payment Method** (Required, but pay-as-you-go):
   - Go to: https://platform.openai.com/account/billing
   - Add a payment method
   - Note: OpenAI charges per API call, but very affordable for development (~$0.002 per request)

3. **Get API Key**:
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "CipherSQLStudio")
   - Copy the key immediately (you won't see it again!)

4. **Fill in .env**:
   ```env
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Option 2: Google AI API Key (Alternative)

1. **Get Google AI API Key**:
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the API key

2. **Fill in .env**:
   ```env
   GOOGLE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **Note**: If using Google AI, comment out or remove the `OPENAI_API_KEY` line.

### Recommendation:
- Use **OpenAI** if you want better quality hints and don't mind the small cost
- Use **Google AI** if you want a free alternative (limited by quota)

---

## Step 5: JWT Secret

The JWT secret is used to sign authentication tokens. Generate a secure random string.

### Generate JWT Secret:

**Option 1: Using Node.js** (Recommended):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**:
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**:
- Go to: https://randomkeygen.com/
- Use a "CodeIgniter Encryption Keys" (32 character key)

### Fill in .env:
```env
JWT_SECRET=your_generated_random_string_here_minimum_32_characters
```

**⚠️ Important**: Keep this secret secure! Never commit it to version control.

---

## Step 6: Complete .env File Example

Here's what a complete `.env` file should look like (with example values):

```env
# Backend Environment Variables
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/cipher_sql_studio?retryWrites=true&w=majority

# PostgreSQL Connection
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=MySecurePassword123
POSTGRES_DATABASE=cipher_sql_studio

# LLM API Key (OpenAI)
OPENAI_API_KEY=sk-proj-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# JWT Secret
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# CORS Origin (optional)
CORS_ORIGIN=http://localhost:3000
```

---

## Step 7: Verify Your Setup

1. **Check that your `.env` file is in the correct location**:
   ```
   backend/.env  ✅ Correct
   .env          ❌ Wrong (should be in backend folder)
   ```

2. **Verify all required fields are filled**:
   - ✅ MONGODB_URI
   - ✅ POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DATABASE
   - ✅ OPENAI_API_KEY OR GOOGLE_AI_API_KEY (at least one)
   - ✅ JWT_SECRET

3. **Test the connections**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   
   If you see "MongoDB connected successfully" and "PostgreSQL connected successfully", you're good to go!

---

## Troubleshooting

### MongoDB Connection Issues
- **Error: "Invalid connection string"**
  - Check that you've replaced `<username>` and `<password>` in the URI
  - Ensure there are no spaces in the connection string
  - Verify your IP is whitelisted in MongoDB Atlas

- **Error: "Authentication failed"**
  - Double-check your username and password
  - Ensure the user has proper permissions

### PostgreSQL Connection Issues
- **Error: "Connection refused"**
  - Verify PostgreSQL is running: `pg_isready` or check services
  - Check that the port (5432) is correct
  - Ensure PostgreSQL is listening on localhost

- **Error: "Authentication failed"**
  - Verify username and password
  - Check PostgreSQL authentication settings in `pg_hba.conf`

### API Key Issues
- **Error: "API key not found"**
  - Ensure the key is copied correctly (no spaces, no quotes)
  - Check that you're using the correct environment variable name
  - Verify the API key is active in the provider's dashboard

- **Error: "Insufficient quota"** (Google AI)
  - Google AI has usage limits on free tier
  - Consider switching to OpenAI or wait for quota reset

---

## Security Best Practices

1. **Never commit `.env` file to Git**
   - It should already be in `.gitignore`
   - Always use `.env.example` for documentation

2. **Use strong passwords**
   - For database users
   - For JWT secret (minimum 32 characters)

3. **Limit IP whitelisting in production**
   - Don't use `0.0.0.0/0` in production
   - Add only your server's IP address

4. **Rotate API keys regularly**
   - Especially if you suspect they've been compromised

5. **Use environment-specific configs**
   - Development: `.env.development`
   - Production: `.env.production`
   - Test: `.env.test`

---

## Quick Reference Checklist

- [ ] Created `backend/.env` file from `.env.example`
- [ ] MongoDB Atlas account created and cluster set up
- [ ] MongoDB connection string copied to `.env`
- [ ] PostgreSQL installed and database created
- [ ] PostgreSQL credentials added to `.env`
- [ ] OpenAI or Google AI API key obtained
- [ ] LLM API key added to `.env`
- [ ] JWT secret generated and added to `.env`
- [ ] Verified all values are filled (no placeholders)
- [ ] Tested backend server starts without errors

Once all items are checked, you're ready to run the application! 🚀

