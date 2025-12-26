# How to Start Backend Server

## 🚀 Quick Steps

### Step 1: Open PowerShell/Terminal

Open a new PowerShell window or Command Prompt.

### Step 2: Navigate to Backend Directory

```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
```

### Step 3: Start the Server

```powershell
npm start
```

### Step 4: Wait for Success Messages

You should see:
```
MongoDB connected successfully
PostgreSQL connected successfully
Server running on port 5000
Environment: development
```

## ✅ Success Indicators

When backend is running correctly, you'll see:
- ✅ "MongoDB connected successfully"
- ✅ "PostgreSQL connected successfully"
- ✅ "Server running on port 5000"
- ✅ No error messages

## ⚠️ Keep the Window Open!

**IMPORTANT:** Keep the PowerShell window open while using the application. Closing it will stop the backend server.

To stop the server later:
- Press `Ctrl+C` in the PowerShell window

## 🔄 Alternative: Development Mode (Auto-Reload)

If you want the server to automatically restart when you make code changes:

```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
npm run dev
```

This uses `nodemon` to watch for file changes and restart automatically.

## 🚨 Troubleshooting

### Error: "Cannot find module"

**Fix:**
```powershell
cd backend
npm install
```

### Error: "MongoDB connection error"

**Check:**
- `.env` file has correct `MONGODB_URI`
- MongoDB Atlas cluster is running
- Your IP is whitelisted in MongoDB Atlas

### Error: "PostgreSQL connection error"

**Check:**
- PostgreSQL service is running
- `.env` file has correct `POSTGRES_PASSWORD`
- Database `cipher_sql_studio` exists (we already created it)

### Error: "Port 5000 already in use"

**Fix:**
1. Find what's using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process, OR
3. Change port in `.env`:
   ```
   PORT=5001
   ```

## 📋 Complete Command Sequence

Copy and paste these commands one by one:

```powershell
# Navigate to backend
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"

# Start server
npm start
```

That's it! The server should start and you'll see the success messages.

---

## 🎯 After Backend Starts

1. ✅ Backend is running on port 5000
2. ✅ Open/refresh browser at http://localhost:3001
3. ✅ Assignments should now load!

