# How to Create Your .env File

Since `.env` files are typically in `.gitignore`, follow these steps to create your `.env` file:

## Quick Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Copy the template file:**
   ```bash
   # Windows (PowerShell)
   Copy-Item env.template .env
   
   # Windows (Command Prompt)
   copy env.template .env
   
   # Mac/Linux
   cp env.template .env
   ```

3. **Open `.env` in a text editor** and fill in your actual values.

4. **See [API_KEYS_SETUP.md](../API_KEYS_SETUP.md) for detailed instructions** on how to obtain each API key and credential.

## What to Fill In

Your `.env` file needs these values:

- **MONGODB_URI**: MongoDB Atlas connection string
- **POSTGRES_HOST**: `localhost` (usually)
- **POSTGRES_PORT**: `5432` (usually)
- **POSTGRES_USER**: Your PostgreSQL username (usually `postgres`)
- **POSTGRES_PASSWORD**: Your PostgreSQL password
- **POSTGRES_DATABASE**: `cipher_sql_studio`
- **OPENAI_API_KEY** OR **GOOGLE_AI_API_KEY**: Your LLM API key (choose one)
- **JWT_SECRET**: A random 32+ character string

For detailed step-by-step instructions on obtaining each value, see **[API_KEYS_SETUP.md](../API_KEYS_SETUP.md)**.

