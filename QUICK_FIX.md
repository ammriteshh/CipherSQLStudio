# Quick Fix: Failed to Load Assignments

## 🔍 Problem Identified

1. ✅ Database has 6 assignments
2. ❌ Backend server is NOT running
3. ⚠️  Frontend is on port 3001 (not 3000)

## 🔧 Solution Steps

### Step 1: Check Backend PowerShell Window

Look for the PowerShell window that should have opened for the backend. It should show:
```
MongoDB connected successfully
PostgreSQL connected successfully
Server running on port 5000
```

**If you see ERRORS instead:**
- MongoDB connection error → Check your `.env` MONGODB_URI
- PostgreSQL connection error → Check PostgreSQL is running and password is correct
- Port already in use → Change PORT in `.env` to 5001

### Step 2: If Backend Window Doesn't Exist or Shows Errors

**Manually start backend:**

1. Open a NEW PowerShell window
2. Run:
   ```powershell
   cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
   npm start
   ```

3. Wait for:
   ```
   Server running on port 5000
   ```

### Step 3: Update CORS (Already Done)

I've updated your `.env` to allow `localhost:3001`. The CORS setting is now:
```
CORS_ORIGIN=http://localhost:3001
```

### Step 4: Restart Backend (If Already Running)

If backend was already running, you need to restart it for CORS changes to take effect:

1. In the backend PowerShell window, press `Ctrl+C` to stop
2. Run `npm start` again

### Step 5: Refresh Browser

1. Go to http://localhost:3001
2. Press `F5` or `Ctrl+R` to refresh
3. Assignments should now load!

## ✅ Verification

After backend is running, test it:

```powershell
# Test backend health
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Test assignments endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/assignments"
```

Both should return data without errors.

## 🚨 Common Issues

### Issue: "Cannot find module"
**Fix:** Run `npm install` in backend directory

### Issue: "MongoDB connection error"
**Fix:** Check `.env` file has correct MONGODB_URI

### Issue: "PostgreSQL connection error"
**Fix:** 
- Make sure PostgreSQL service is running
- Check password in `.env` is correct
- Verify database `cipher_sql_studio` exists

### Issue: "Port 5000 already in use"
**Fix:** Change PORT in `.env` to 5001, then update frontend to use port 5001

## 📋 Quick Checklist

- [ ] Backend PowerShell window exists and shows "Server running on port 5000"
- [ ] No errors in backend window
- [ ] CORS_ORIGIN in `.env` is set to `http://localhost:3001`
- [ ] Browser is at http://localhost:3001
- [ ] Refreshed the browser page

---

**Once backend is running, assignments will load automatically!** 🚀

