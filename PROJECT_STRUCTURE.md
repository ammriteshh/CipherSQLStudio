# CipherSQLStudio Project Structure

This document provides an overview of the project structure and the purpose of each directory and file.

## Root Directory

```
CipherSQLStudio/
├── backend/              # Node.js/Express backend API
├── frontend/             # React.js frontend application
├── .gitignore           # Git ignore rules
├── README.md            # Main project documentation
├── SETUP.md             # Setup instructions
└── PROJECT_STRUCTURE.md # This file
```

## Backend Structure (`backend/`)

```
backend/
├── controllers/         # Business logic controllers
│   ├── assignmentController.js  # Assignment listing logic
│   ├── hintController.js        # LLM hint generation
│   ├── queryController.js       # SQL query execution
│   └── queryValidator.js        # Query validation & sanitization
├── db/                  # Database connection modules
│   ├── mongodb.js       # MongoDB connection setup
│   └── postgresql.js    # PostgreSQL connection & schema management
├── models/              # MongoDB Mongoose models
│   ├── Assignment.js    # Assignment schema
│   ├── User.js          # User schema (authentication)
│   └── UserProgress.js  # User progress tracking schema
├── routes/              # Express route definitions
│   ├── assignments.js   # Assignment API routes
│   ├── auth.js          # Authentication routes (login/register)
│   └── progress.js      # User progress routes
├── scripts/             # Utility scripts
│   ├── seedAssignments.js  # Seed database with sample assignments
│   └── README.md        # Script documentation
├── nodemon.json         # Nodemon configuration
├── package.json         # Backend dependencies & scripts
└── server.js            # Main Express server entry point
```

### Key Backend Files

- **server.js**: Initializes Express app, connects databases, sets up routes
- **db/postgresql.js**: 
  - `connectPostgreSQL()`: Establishes connection pool
  - `executeQueryInSchema()`: Executes queries in isolated schemas
  - `setupAssignmentSchema()`: Creates tables in isolated schemas
- **controllers/queryValidator.js**: Validates and sanitizes SQL queries to prevent malicious code
- **controllers/hintController.js**: Integrates with LLM APIs (OpenAI/Google) for hint generation
- **controllers/queryController.js**: Handles query execution and assignment retrieval

## Frontend Structure (`frontend/`)

```
frontend/
├── public/              # Static assets
│   └── index.html       # HTML template
└── src/                 # React source code
    ├── components/      # React components
    │   ├── AssignmentAttempt.js    # Main assignment attempt interface
    │   ├── AssignmentAttempt.scss  # Styles for attempt interface
    │   ├── AssignmentList.js       # Assignment listing page
    │   ├── AssignmentList.scss     # Styles for listing page
    │   ├── Auth.scss               # Shared auth styles
    │   ├── Login.js                # Login component
    │   └── Signup.js               # Signup component
    ├── styles/          # Global SCSS styles
    │   ├── _variables.scss  # SCSS variables (colors, spacing, etc.)
    │   ├── _mixins.scss     # SCSS mixins (responsive, utilities)
    │   └── main.scss       # Main stylesheet (imports others)
    ├── App.js            # Main React app component (routing)
    └── index.js          # React entry point
```

### Key Frontend Files

- **App.js**: Sets up React Router, manages authentication state
- **components/AssignmentAttempt.js**: 
  - Multi-panel layout for assignment attempt
  - Integrates Monaco Editor for SQL editing
  - Handles query execution and hint requests
- **components/AssignmentList.js**: Displays list of available assignments
- **styles/_variables.scss**: Defines design tokens (colors, typography, spacing)
- **styles/_mixins.scss**: Reusable SCSS mixins for responsive design and utilities

## Key Features by File

### Security

- **backend/controllers/queryValidator.js**: 
  - Prevents DDL/DML commands
  - Blocks system schema access
  - Validates query structure
  - Prevents multiple statements

- **backend/db/postgresql.js**:
  - Schema isolation using `SET search_path`
  - Escaped schema names to prevent SQL injection
  - Per-user/per-session schema isolation

### Database Architecture

- **MongoDB**: Stores assignments, users, and progress data
- **PostgreSQL**: Sandbox database with isolated schemas per user/assignment
  - Schema naming: `workspace_{userId}_{assignmentId}`
  - Tables created on-demand in isolated schemas

### Styling Approach

- **Mobile-First**: Base styles for mobile, media queries for larger screens
- **BEM Naming**: Block__Element--Modifier convention
- **SCSS Features**: Variables, mixins, nesting, partials
- **Responsive Breakpoints**: 320px, 641px, 1024px, 1281px

### API Endpoints

- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get assignment details
- `POST /api/assignments/:id/execute` - Execute SQL query
- `POST /api/assignments/:id/hint` - Get AI-generated hint
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Save user progress

## Data Flow

1. **Assignment Loading**:
   - Frontend → `GET /api/assignments` → MongoDB → Returns list
   - Frontend → `GET /api/assignments/:id` → MongoDB → Returns details

2. **Query Execution**:
   - Frontend → `POST /api/assignments/:id/execute` → Backend
   - Backend validates query → Sets up PostgreSQL schema → Executes query
   - Returns results or error

3. **Hint Generation**:
   - Frontend → `POST /api/assignments/:id/hint` → Backend
   - Backend → LLM API (OpenAI/Google) → Returns hint

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `POSTGRES_*`: PostgreSQL connection details
- `OPENAI_API_KEY` or `GOOGLE_AI_API_KEY`: LLM API key
- `JWT_SECRET`: JWT token signing secret

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Development Workflow

1. **Backend**: Run `npm run dev` (uses nodemon for auto-reload)
2. **Frontend**: Run `npm start` (React hot reload enabled)
3. **Database Seeding**: Run `npm run seed` in backend directory

## Security Considerations

- Query validation prevents malicious SQL
- Schema isolation prevents cross-user data access
- SQL injection prevention through validation and sanitization
- JWT-based authentication (optional)
- CORS configured for specific origins
- Environment variables for sensitive data

