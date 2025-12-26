# Fix PostgreSQL Connection

## 🔍 Common PostgreSQL Connection Issues

### Issue 1: PostgreSQL Service Not Running

**Check if PostgreSQL is running:**
```powershell
Get-Service -Name postgresql*
```

**If service is stopped, start it:**
```powershell
# Find the exact service name first
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Then start it (replace with actual service name)
Start-Service postgresql-x64-14  # Example name, yours might be different
```

**Or use Services GUI:**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "postgresql" service
4. Right-click → Start

---

### Issue 2: Wrong Password in .env

**Check your .env file:**
```
POSTGRES_PASSWORD=your_actual_password_here
```

**To find/reset PostgreSQL password:**

**Option A: Use psql with trust authentication:**
```powershell
# Connect without password (if local)
psql -U postgres

# Or with Windows authentication
psql -U postgres -h localhost
```

**Option B: Check pg_hba.conf:**
1. Find PostgreSQL data directory (usually `C:\Program Files\PostgreSQL\XX\data`)
2. Edit `pg_hba.conf`
3. Find line with `localhost` and change `md5` to `trust` temporarily
4. Restart PostgreSQL service
5. Connect and change password:
   ```sql
   ALTER USER postgres PASSWORD 'newpassword';
   ```
6. Change `pg_hba.conf` back to `md5`

---

### Issue 3: Database Doesn't Exist

**Create the database:**
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cipher_sql_studio;

# Verify it was created
\l

# Exit
\q
```

---

### Issue 4: Wrong Connection Details

**Check your .env file has:**
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DATABASE=cipher_sql_studio
```

**Common issues:**
- Wrong port (default is 5432)
- Wrong username (default is postgres)
- Database name typo

---

### Issue 5: PostgreSQL Not Installed

**Check if PostgreSQL is installed:**
```powershell
psql --version
```

**If not installed:**
1. Download from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL
3. Remember the password you set during installation
4. Update `.env` with that password

---

## 🔧 Quick Fix Steps

### Step 1: Verify PostgreSQL is Running
```powershell
Get-Service | Where-Object {$_.Name -like "*postgres*"}
```

If stopped, start it.

### Step 2: Test Connection Manually
```powershell
psql -U postgres -h localhost
```

If this fails, PostgreSQL isn't accessible.

### Step 3: Check .env Configuration
Make sure all PostgreSQL settings in `backend/.env` are correct:
- Host: `localhost`
- Port: `5432`
- User: `postgres` (or your username)
- Password: Your actual PostgreSQL password
- Database: `cipher_sql_studio` (must exist)

### Step 4: Create Database (if missing)
```powershell
psql -U postgres
CREATE DATABASE cipher_sql_studio;
\q
```

### Step 5: Test Connection from Node.js
```powershell
cd backend
node -e "require('dotenv').config(); const {Client} = require('pg'); const c = new Client({host:process.env.POSTGRES_HOST,port:process.env.POSTGRES_PORT,user:process.env.POSTGRES_USER,password:process.env.POSTGRES_PASSWORD,database:'postgres'}); c.connect().then(()=>console.log('✅ Connected!')).catch(e=>console.log('❌ Error:',e.message)).finally(()=>c.end());"
```

---

## ✅ Success Indicators

After fixing, you should see in backend terminal:
```
PostgreSQL connected successfully
```

And no errors related to PostgreSQL.

---

## 🚨 Still Having Issues?

**Check backend terminal for specific error messages:**
- "Connection refused" → PostgreSQL not running or wrong port
- "Authentication failed" → Wrong username/password
- "Database does not exist" → Create the database
- "Connection timeout" → Check firewall or PostgreSQL not accessible

**Share the exact error message for more specific help!**

