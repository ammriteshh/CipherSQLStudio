# Fix: Assignments Not Loading

## ✅ Database Seeded Successfully!

I've just seeded your database with **6 assignments**:
1. Basic SELECT Query (Beginner)
2. Filtering with WHERE Clause (Beginner)
3. JOIN Operations (Intermediate)
4. ORDER BY and Sorting (Beginner) ⬅️ NEW
5. Aggregate Functions (Intermediate) ⬅️ NEW
6. Subqueries (Advanced) ⬅️ NEW

## ❌ Problem: Backend Server Not Running

The assignments are in the database, but the backend server isn't running, so the frontend can't fetch them.

## 🔧 Solution: Start the Backend Server

### Step 1: Open a New Terminal/PowerShell

### Step 2: Navigate to Backend Directory
```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
```

### Step 3: Start the Server
```powershell
npm start
```

### Step 4: You Should See:
```
MongoDB connected successfully
PostgreSQL connected successfully
Server running on port 5000
Environment: development
```

### Step 5: Keep This Terminal Open!
The backend must keep running for the frontend to work.

### Step 6: Refresh Your Browser
- Go to http://localhost:3000
- Press F5 to refresh
- You should now see 6 assignments!

## 📋 Complete Setup Checklist

Make sure you have **3 terminals/windows** open:

**Terminal 1 - Backend (MUST BE RUNNING):**
```powershell
cd backend
npm start
```
✅ Should show "Server running on port 5000"

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```
✅ Should show "Compiled successfully" and open browser

**Terminal 3 - (Optional) For seeding:**
```powershell
cd backend
npm run seed  # Only needed if you want to re-seed
```

## 🎯 Quick Test

After starting backend, test the API:

1. Open browser and go to: http://localhost:5000/api/assignments
2. You should see JSON with 6 assignments

OR use PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/assignments" | ConvertTo-Json
```

## ✅ Success Indicators

When everything is working:
- ✅ Backend terminal shows "Server running on port 5000"
- ✅ Frontend shows 6 assignment cards
- ✅ Can click an assignment to open it
- ✅ SQL editor loads
- ✅ Can execute queries

## 🚨 If Still Not Working

1. **Check backend is running:**
   - Go to http://localhost:5000/api/health
   - Should see: `{"status":"ok",...}`

2. **Check MongoDB connection:**
   - Look at backend terminal for "MongoDB connected successfully"
   - If error, check `.env` file `MONGODB_URI`

3. **Check frontend:**
   - Open browser DevTools (F12) → Console tab
   - Look for errors
   - Check Network tab for failed requests

4. **Verify assignments in database:**
   ```powershell
   cd backend
   node scripts/seedAssignments.js
   ```
   Should show "Successfully seeded 6 assignments!"

---

**Remember: The backend MUST be running for assignments to load!** 🚀

