# How to Start the Backend Server

## Quick Start

1. Open a terminal/PowerShell window

2. Navigate to the backend directory:
   ```powershell
   cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
   ```

3. Start the server:
   ```powershell
   npm start
   ```

   OR for development with auto-reload:
   ```powershell
   npm run dev
   ```

4. You should see:
   ```
   MongoDB connected successfully
   PostgreSQL connected successfully
   Server running on port 5000
   ```

## If You See Errors

### MongoDB Connection Error
- Check your `.env` file has the correct `MONGODB_URI`
- Verify your IP is whitelisted in MongoDB Atlas
- Check your MongoDB credentials

### PostgreSQL Connection Error
- Make sure PostgreSQL is running
- Check your PostgreSQL password in `.env`
- Verify the database `cipher_sql_studio` exists

### Port Already in Use
- Another process is using port 5000
- Change the `PORT` in `.env` to another number (e.g., 5001)
- Update frontend `.env` if you have one: `REACT_APP_API_URL=http://localhost:5001/api`

## After Backend Starts

1. In a NEW terminal, seed the database (first time only):
   ```powershell
   cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
   npm run seed
   ```

2. Keep the backend running, then refresh your browser
   - The frontend should now be able to load assignments

