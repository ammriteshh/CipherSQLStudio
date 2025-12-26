# Complete Guide: CipherSQLStudio - From Setup to Demo

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Flow](#architecture--flow)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [How It Works (Visual Flow)](#how-it-works-visual-flow)
5. [Demonstrating to Interviewer](#demonstrating-to-interviewer)
6. [Common Interview Tasks](#common-interview-tasks)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**CipherSQLStudio** is a browser-based SQL learning platform where:
- Students browse SQL assignments
- They write SQL queries in a code editor (Monaco Editor)
- Queries run in a sandboxed PostgreSQL database
- AI provides hints without giving away solutions
- Progress is tracked in MongoDB

**Key Technologies:**
- Frontend: React.js + Monaco Editor + SCSS
- Backend: Node.js + Express.js
- Databases: MongoDB (assignments/users) + PostgreSQL (query execution)
- AI: Google Gemini API (for hints)

---

## 🏗️ Architecture & Flow

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Frontend (Port 3000)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐   │   │
│  │  │ Assignment   │  │   Monaco     │  │ Results  │   │   │
│  │  │   List       │  │   Editor     │  │  Panel   │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Express Backend Server (Port 5000)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐          │
│  │   Routes     │  │ Controllers  │  │   Auth   │          │
│  │  /assignments│  │ Query Exec   │  │  JWT     │          │
│  │  /auth       │  │ Hint Gen     │  │          │          │
│  └──────────────┘  └──────────────┘  └──────────┘          │
└─────────────────────────────────────────────────────────────┘
         │                              │              │
         │                              │              │
         ▼                              ▼              ▼
┌─────────────────┐        ┌──────────────────┐   ┌─────────┐
│   MongoDB       │        │   PostgreSQL     │   │ Gemini  │
│   Atlas         │        │   (Sandbox)      │   │   API   │
│                 │        │                  │   │         │
│ - Assignments   │        │ - Isolated       │   │ - Hints │
│ - Users         │        │   Schemas        │   │         │
│ - Progress      │        │ - Sample Data    │   │         │
└─────────────────┘        └──────────────────┘   └─────────┘
```

### Data Flow: Assignment Loading

```
1. User opens browser → http://localhost:3000
   │
   ▼
2. React App loads → AssignmentList component
   │
   ▼
3. useEffect triggers → fetchAssignments()
   │
   ▼
4. Axios GET request → http://localhost:5000/api/assignments
   │
   ▼
5. Express route → /api/assignments → assignmentController.getAllAssignments()
   │
   ▼
6. MongoDB query → Assignment.find() → Returns all assignments
   │
   ▼
7. Response → JSON array of assignments
   │
   ▼
8. React state update → setAssignments(response.data)
   │
   ▼
9. UI renders → Assignment cards displayed
```

### Data Flow: Query Execution

```
1. User types SQL query in Monaco Editor
   │
   ▼
2. Clicks "Execute Query" button
   │
   ▼
3. Axios POST → /api/assignments/:id/execute
   │
   Body: { query: "SELECT * FROM employees", userId: "guest", sessionId: "..." }
   │
   ▼
4. Express route → queryController.executeQuery()
   │
   ▼
5. Query Validation → queryValidator.validateQuery()
   ├─ Checks for DROP, ALTER, DELETE, etc. (blocked)
   ├─ Ensures only SELECT/WITH queries
   └─ Sanitizes input
   │
   ▼
6. Schema Setup → setupAssignmentSchema()
   ├─ Creates isolated schema: workspace_guest_assignmentId
   ├─ Creates tables from assignment definition
   └─ Inserts sample data
   │
   ▼
7. Query Execution → executeQueryInSchema()
   ├─ SET search_path = workspace_guest_assignmentId
   └─ Executes: SELECT * FROM employees
   │
   ▼
8. PostgreSQL returns result → { rows: [...], rowCount: 3 }
   │
   ▼
9. Response sent to frontend → { success: true, data: [...], rowCount: 3 }
   │
   ▼
10. React updates state → setQueryResult(response.data)
    │
    ▼
11. Results Panel renders → HTML table with data
```

### Data Flow: Hint Generation

```
1. User clicks "Get Hint" button
   │
   ▼
2. Axios POST → /api/assignments/:id/hint
   │
   Body: { userQuery: "SELECT * FROM..." }
   │
   ▼
3. Express route → hintController.generateHint()
   │
   ▼
4. Fetch assignment from MongoDB → Get question + table schemas
   │
   ▼
5. Build prompt for LLM:
   ├─ Assignment question
   ├─ Table schemas
   ├─ User's current query (optional)
   └─ Instructions: "Provide hint, not solution"
   │
   ▼
6. Call Gemini API → GoogleGenerativeAI.generateContent()
   │
   ▼
7. Gemini returns hint → "Try using WHERE clause to filter..."
   │
   ▼
8. Response to frontend → { success: true, hint: "..." }
   │
   ▼
9. React displays hint → Hint panel shows guidance
```

---

## 🚀 Step-by-Step Setup (From Scratch)

### Prerequisites Check

1. **Node.js installed?**
   ```powershell
   node --version
   # Should show v16 or higher
   ```

2. **PostgreSQL installed?**
   ```powershell
   psql --version
   # Should show version number
   ```

3. **Git installed?** (Optional, for version control)

### Step 1: Verify Project Structure

Your project should have this structure:
```
CipherSQLStudio/
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env              ← MUST EXIST
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

### Step 2: Configure Backend (.env file)

**Location:** `backend/.env`

**Check if it exists:**
```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
Test-Path .env
# Should return: True
```

**Verify all values are filled:**
```powershell
Get-Content .env | Select-String -Pattern "your_|username:password|change_this"
# Should return nothing (no placeholders)
```

**Your .env should have:**
- ✅ MONGODB_URI=mongodb+srv://... (your actual connection string)
- ✅ POSTGRES_PASSWORD=amritesh (your actual password)
- ✅ GOOGLE_AI_API_KEY=AIzaSyD526... (your actual key)
- ✅ JWT_SECRET=d70dde38... (your actual secret)

### Step 3: Install Backend Dependencies

```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
npm install
```

**Expected output:**
```
added 150 packages in 30s
```

### Step 4: Install Frontend Dependencies

```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\frontend"
npm install
```

**Expected output:**
```
added 200 packages in 45s
```

### Step 5: Setup PostgreSQL Database

```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database (inside psql)
CREATE DATABASE cipher_sql_studio;

# Verify it was created
\l

# Exit psql
\q
```

### Step 6: Start Backend Server

**Terminal 1 - Backend:**
```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
npm start
```

**Expected output:**
```
MongoDB connected successfully
PostgreSQL connected successfully
Server running on port 5000
Environment: development
```

**⚠️ Keep this terminal open!**

### Step 7: Seed Database (First Time Only)

**Terminal 2 - Seed:**
```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\backend"
npm run seed
```

**Expected output:**
```
MongoDB connected successfully
Clearing existing assignments...
Seeding assignments...
Successfully seeded 3 assignments!
```

### Step 8: Start Frontend

**Terminal 3 - Frontend:**
```powershell
cd "D:\Amritesh Singh\Projects\CipherSQLStudio\frontend"
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view ciphersqlstudio in the browser.
Local: http://localhost:3000
```

Browser should automatically open to http://localhost:3000

### Step 9: Verify Everything Works

1. **Browser shows assignment list** → ✅
2. **Click an assignment** → Opens attempt page
3. **See question, sample data, SQL editor** → ✅
4. **Type: `SELECT * FROM employees;`** → ✅
5. **Click "Execute Query"** → Results appear → ✅
6. **Click "Get Hint"** → Hint appears → ✅

---

## 🎬 How It Works (Visual Flow)

### Screen 1: Assignment List Page

```
┌─────────────────────────────────────────────────────────┐
│  CipherSQLStudio                    [Login] [Signup]    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  SQL Assignments                                        │
│  Select an assignment to start practicing SQL queries   │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Basic SELECT │  │ Filtering    │  │ JOIN         │ │
│  │   Query      │  │ with WHERE   │  │ Operations   │ │
│  │              │  │              │  │              │ │
│  │ [Beginner]   │  │ [Beginner]   │  │[Intermediate]│ │
│  │              │  │              │  │              │ │
│  │ Learn to     │  │ Filter rows  │  │ Combine data │ │
│  │ retrieve     │  │ based on     │  │ from         │ │
│  │ data from    │  │ conditions   │  │ multiple     │ │
│  │ single table │  │              │  │ tables       │ │
│  │              │  │              │  │              │ │
│  │ [Start]      │  │ [Start]      │  │ [Start]      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Screen 2: Assignment Attempt Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back    Basic SELECT Query              [Beginner]           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ Question             │  │ Sample Data           │            │
│  ├──────────────────────┤  ├──────────────────────┤            │
│  │ Write a SQL query    │  │ employees            │            │
│  │ to select all        │  │ ┌───┬────────┬──────┐│            │
│  │ columns and all      │  │ │id │name    │salary││            │
│  │ rows from the        │  │ ├───┼────────┼──────┤│            │
│  │ "employees" table.   │  │ │ 1 │John    │75000 ││            │
│  │                      │  │ │ 2 │Jane    │65000 ││            │
│  │                      │  │ └───┴────────┴──────┘│            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │ SQL Editor           │  │ Results               │            │
│  ├──────────────────────┤  ├──────────────────────┤            │
│  │ SELECT *             │  │ Query executed        │            │
│  │ FROM employees;      │  │ successfully.         │            │
│  │                      │  │ Rows returned: 3      │            │
│  │                      │  │                       │            │
│  │                      │  │ ┌───┬────────┬──────┐│            │
│  │                      │  │ │id │name    │salary││            │
│  │ [Execute Query]      │  │ ├───┼────────┼──────┤│            │
│  │ [Get Hint]           │  │ │ 1 │John    │75000 ││            │
│  └──────────────────────┘  │ │ 2 │Jane    │65000 ││            │
│                            │ └───┴────────┴──────┘│            │
│                            └──────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎤 Demonstrating to Interviewer

### Demo Script (5-10 minutes)

#### Part 1: Introduction (1 min)
1. **Show the project:**
   "This is CipherSQLStudio - a SQL learning platform I built. It allows students to practice SQL queries in a safe, sandboxed environment."

2. **Explain architecture:**
   - "Frontend: React.js with Monaco Editor for SQL editing"
   - "Backend: Node.js/Express REST API"
   - "MongoDB stores assignments and user data"
   - "PostgreSQL serves as the sandbox for query execution"
   - "Google Gemini API provides AI-powered hints"

#### Part 2: Show Assignment List (1 min)
1. Open browser to http://localhost:3000
2. Point out:
   - "Three assignments of varying difficulty"
   - "Each shows title, difficulty, and description"
   - "Responsive design - works on mobile too"

#### Part 3: Execute a Query (2-3 min)
1. Click on "Basic SELECT Query"
2. Show the 4-panel layout:
   - Question panel (explains what to do)
   - Sample data panel (shows available tables)
   - SQL Editor (Monaco Editor - like VS Code)
   - Results panel (shows query output)

3. Type a query:
   ```sql
   SELECT * FROM employees;
   ```

4. Click "Execute Query"
5. Show results appearing in the table
6. **Explain the security:**
   - "Query runs in an isolated PostgreSQL schema"
   - "Each user/assignment gets separate schema"
   - "Only SELECT queries allowed - DROP, ALTER blocked"

#### Part 4: Show Hint Feature (2 min)
1. Clear the editor or type a partial query
2. Click "Get Hint"
3. Show AI-generated hint appearing
4. **Explain:**
   - "Uses Google Gemini API"
   - "Provides guidance without giving solution"
   - "Context-aware based on assignment and current query"

#### Part 5: Show Security Features (1-2 min)
1. Try to execute a malicious query:
   ```sql
   DROP TABLE employees;
   ```
2. Show error message: "Query contains forbidden keyword: DROP"
3. **Explain:**
   - "Query validation prevents dangerous operations"
   - "SQL injection prevention"
   - "Schema isolation prevents data access"

#### Part 6: Code Walkthrough (2-3 min)
1. Show backend structure:
   ```powershell
   cd backend
   code .  # or open in editor
   ```
2. Point out key files:
   - `queryValidator.js` - Security validation
   - `postgresql.js` - Schema isolation logic
   - `hintController.js` - LLM integration
3. Show frontend structure:
   - `AssignmentAttempt.js` - Main component
   - SCSS files - Mobile-first responsive design

### Key Points to Emphasize

✅ **Security:**
- Query validation and sanitization
- Schema isolation in PostgreSQL
- SQL injection prevention

✅ **Architecture:**
- RESTful API design
- Separation of concerns (MVC pattern)
- Database design (MongoDB for flexibility, PostgreSQL for SQL)

✅ **User Experience:**
- Monaco Editor (professional code editor)
- Responsive design
- Error handling and user feedback

✅ **Scalability:**
- Modular code structure
- Environment variables for configuration
- Database connection pooling

---

## 📋 Common Interview Tasks

### Task 1: "Add a New Assignment"

**What they're testing:** Can you add data to the database?

**Steps:**
1. Open MongoDB Atlas or use MongoDB Compass
2. Connect to your cluster
3. Find the `assignments` collection
4. Add a new document:

```json
{
  "title": "Aggregate Functions",
  "description": "Learn to use COUNT, SUM, AVG",
  "difficulty": "Intermediate",
  "question": "Write a query to find the average salary of all employees.",
  "tableDefinitions": [
    {
      "name": "employees",
      "description": "Employee data",
      "createTableSQL": "CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(50), salary DECIMAL(10,2))",
      "sampleData": [
        {"id": 1, "name": "John", "salary": 75000},
        {"id": 2, "name": "Jane", "salary": 65000}
      ]
    }
  ]
}
```

**Alternative (using seed script):**
1. Edit `backend/scripts/seedAssignments.js`
2. Add new assignment to `sampleAssignments` array
3. Run: `npm run seed`

---

### Task 2: "Show Me the Security Features"

**What they're testing:** Do you understand the security implementation?

**Steps:**
1. **Show query validation:**
   - Open `backend/controllers/queryValidator.js`
   - Point out forbidden keywords list
   - Explain how validation works

2. **Show schema isolation:**
   - Open `backend/db/postgresql.js`
   - Explain `SET search_path` isolation
   - Show how schema names are constructed

3. **Test in browser:**
   - Try: `DROP TABLE employees;` → Should fail
   - Try: `SELECT * FROM pg_catalog.pg_tables;` → Should fail
   - Try: `SELECT * FROM employees;` → Should work

---

### Task 3: "Add a New Feature: Save Query History"

**What they're testing:** Can you add functionality?

**Steps:**
1. **Backend - Create model:**
   ```javascript
   // backend/models/QueryHistory.js
   const queryHistorySchema = new mongoose.Schema({
     userId: { type: String, required: true },
     assignmentId: { type: String, required: true },
     query: { type: String, required: true },
     executedAt: { type: Date, default: Date.now }
   });
   ```

2. **Backend - Add route:**
   ```javascript
   // backend/routes/history.js
   router.get('/:userId/:assignmentId', getQueryHistory);
   router.post('/', saveQuery);
   ```

3. **Backend - Add controller:**
   ```javascript
   // Save query after execution
   // Retrieve history for display
   ```

4. **Frontend - Add component:**
   ```javascript
   // Show history dropdown in AssignmentAttempt
   // Load saved queries
   ```

---

### Task 4: "Fix a Bug: Queries with Comments Fail"

**What they're testing:** Can you debug and fix issues?

**Problem:** User tries:
```sql
SELECT * FROM employees; -- This is a comment
```
And it fails.

**Investigation:**
1. Check `queryValidator.js` - sanitizeQuery() removes comments
2. Check if sanitization breaks the query
3. Test in PostgreSQL directly

**Fix:**
- Ensure sanitization preserves query structure
- Or adjust validation to allow comments

---

### Task 5: "Demonstrate the Full Stack Flow"

**What they're testing:** Do you understand end-to-end flow?

**Steps:**
1. **Open browser DevTools → Network tab**
2. **Click an assignment:**
   - Show GET request to `/api/assignments/:id`
   - Show response with assignment data
3. **Execute a query:**
   - Show POST request to `/api/assignments/:id/execute`
   - Show request body with SQL query
   - Show response with query results
4. **Get a hint:**
   - Show POST request to `/api/assignments/:id/hint`
   - Show response with AI-generated hint

---

### Task 6: "Explain Database Design Decisions"

**What they're testing:** Can you justify technical choices?

**Answers:**

**Why MongoDB for assignments?**
- Flexible schema for nested table definitions
- Easy to add new fields without migrations
- Good for document-based data (assignments are documents)

**Why PostgreSQL for queries?**
- Native SQL support
- Industry standard for SQL learning
- Supports all SQL features students need to learn
- Schema isolation for security

**Why separate databases?**
- Different use cases (document vs relational)
- Can scale independently
- MongoDB for flexibility, PostgreSQL for SQL execution

---

## 🔧 Troubleshooting

### Problem: "Failed to load assignments"

**Solutions:**
1. ✅ Backend not running → Start: `cd backend && npm start`
2. ✅ Database not seeded → Run: `npm run seed`
3. ✅ MongoDB connection error → Check `.env` MONGODB_URI
4. ✅ CORS error → Check backend CORS_ORIGIN in `.env`

### Problem: "Query execution failed"

**Solutions:**
1. ✅ PostgreSQL not running → Start PostgreSQL service
2. ✅ Wrong password → Check POSTGRES_PASSWORD in `.env`
3. ✅ Database doesn't exist → Create: `CREATE DATABASE cipher_sql_studio;`

### Problem: "Hint generation failed"

**Solutions:**
1. ✅ API key invalid → Check GOOGLE_AI_API_KEY in `.env`
2. ✅ API quota exceeded → Check Gemini API usage
3. ✅ Network error → Check internet connection

### Problem: "Monaco Editor not loading"

**Solutions:**
1. ✅ Clear browser cache → Ctrl+Shift+Delete
2. ✅ Reinstall dependencies → `cd frontend && npm install`
3. ✅ Check browser console for errors

---

## ✅ Pre-Demo Checklist

Before demonstrating, ensure:

- [ ] Backend server running (`npm start` in backend/)
- [ ] Frontend server running (`npm start` in frontend/)
- [ ] Database seeded (`npm run seed`)
- [ ] All `.env` values configured
- [ ] PostgreSQL running
- [ ] Internet connection (for Gemini API)
- [ ] Browser at http://localhost:3000
- [ ] At least one assignment visible
- [ ] Can execute a simple query successfully
- [ ] Can get a hint successfully

---

## 🎯 Quick Demo Script (2 minutes)

**Opening:**
"I built CipherSQLStudio - a SQL learning platform. Let me show you how it works."

**Show:**
1. Assignment list (5 sec)
2. Click assignment (5 sec)
3. Type query: `SELECT * FROM employees;` (10 sec)
4. Execute query → Show results (10 sec)
5. Click "Get Hint" → Show hint (10 sec)
6. Try malicious query: `DROP TABLE employees;` → Show error (10 sec)

**Closing:**
"This demonstrates full-stack development with React, Node.js, MongoDB, PostgreSQL, and AI integration, with focus on security through query validation and schema isolation."

---

You're now ready to demonstrate CipherSQLStudio confidently! 🚀

