# CipherSQLStudio Features

## Core Features (90% Focus)

### 1. Assignment Listing Page
- **Display**: Shows all available SQL assignments
- **Information Displayed**:
  - Assignment title
  - Difficulty level (Beginner/Intermediate/Advanced)
  - Brief description
- **Navigation**: Click on assignment to navigate to attempt interface
- **Responsive Design**: Grid layout adapts from 1 column (mobile) to 3 columns (desktop)

### 2. Assignment Attempt Interface
- **Multi-Panel Layout** with responsive design:
  - **Question Panel**: Displays the assignment question
  - **Sample Data Viewer**: Shows PostgreSQL table schemas and sample data
  - **SQL Editor**: Monaco Editor embedded for writing SQL queries
  - **Results Panel**: Displays query results in formatted HTML tables or error messages

- **Actions**:
  - "Execute Query" button: Runs the SQL query in sandboxed PostgreSQL
  - "Get Hint" button: Requests AI-generated hints (without revealing solutions)

- **Responsive Breakpoints**:
  - 320px (Mobile): Single column layout
  - 641px (Tablet): Improved spacing and layout
  - 1024px (Desktop): Two-column grid layout
  - 1281px (Large Desktop): Optimized for larger screens

### 3. Backend Query Execution Engine
- **Security Features**:
  - Query validation to prevent DDL/DML commands (DROP, ALTER, CREATE, DELETE, INSERT, UPDATE, etc.)
  - SQL injection prevention through validation and sanitization
  - System schema access blocking (pg_catalog, information_schema, etc.)
  - Multiple statement prevention

- **Sandboxing**:
  - Uses PostgreSQL's `SET search_path` to isolate queries
  - Each user/assignment gets a dedicated schema: `workspace_{userId}_{assignmentId}`
  - Tables are created on-demand in isolated schemas
  - Complete isolation between users and assignments

- **Query Execution**:
  - Validates query structure (must start with SELECT or WITH)
  - Sanitizes input (removes comments, normalizes whitespace)
  - Executes in isolated schema
  - Returns results or detailed error messages

### 4. LLM Hint Integration
- **AI-Powered Hints**:
  - Integrates with OpenAI API (GPT-3.5-turbo) or Google GenAI (Gemini Pro)
  - Receives assignment question, table schemas, and optionally user's current query
  - Generates helpful hints without revealing complete solutions

- **Prompt Engineering**:
  - Specifically designed to provide guidance, not solutions
  - Hints are limited to 60% of the solution at most
  - Educational and encouraging tone
  - Focuses on SQL concepts and table relationships

## Optional Features (10% Focus)

### 5. Authentication System
- **User Registration**: 
  - Username, email, and password
  - Password hashing with bcrypt
  - Email validation

- **User Login**:
  - JWT token-based authentication
  - Token stored in localStorage
  - 7-day token expiration

### 6. Progress Tracking
- **User Progress Storage**:
  - Tracks last SQL query attempt per assignment
  - Records number of attempts
  - Marks completion status
  - Stores completion timestamp

- **Progress API**:
  - Save/update progress endpoint
  - Retrieve user progress endpoint
  - Integrated with assignment attempt interface

## Technical Features

### Frontend
- **React.js**: Modern React with hooks
- **React Router**: Client-side routing
- **Monaco Editor**: VS Code-like SQL editing experience
- **Axios**: HTTP client for API calls
- **SCSS**: Advanced styling with:
  - Variables for design tokens
  - Mixins for reusable styles
  - BEM naming convention
  - Mobile-first responsive design
  - Custom scrollbars
  - Touch-friendly UI (44px minimum touch targets)

### Backend
- **Express.js**: RESTful API server
- **MongoDB (Mongoose)**: Assignment and user data persistence
- **PostgreSQL (pg)**: Sandboxed query execution
- **JWT**: Secure authentication tokens
- **bcrypt**: Password hashing
- **OpenAI/Google AI**: LLM integration for hints
- **CORS**: Cross-origin resource sharing configured

### Database Architecture
- **MongoDB Atlas**: 
  - Stores assignments, users, and progress
  - Flexible schema for assignments with nested table definitions

- **PostgreSQL**:
  - Sandbox database for query execution
  - Schema-based isolation
  - On-demand table creation
  - Sample data pre-population

### Security
- **Query Validation**: Multiple layers of validation
- **SQL Injection Prevention**: Input sanitization and validation
- **Schema Isolation**: Complete data isolation per user/assignment
- **Authentication**: Optional JWT-based auth
- **Environment Variables**: Sensitive data not hardcoded

### Developer Experience
- **Hot Reload**: Both frontend and backend support hot reload
- **Seed Scripts**: Easy database seeding with sample assignments
- **Comprehensive Documentation**: README, SETUP, and structure docs
- **Error Handling**: Graceful error handling throughout
- **Logging**: Console logging for debugging

## Responsive Design Details

### Mobile (320px+)
- Single column layouts
- Full-width cards and panels
- Touch-friendly buttons (44px minimum)
- Optimized font sizes
- Stacked navigation

### Tablet (641px+)
- Two-column assignment grid
- Improved spacing
- Larger touch targets
- Better readability

### Desktop (1024px+)
- Multi-column layouts
- Two-column grid for assignment attempt
- Side-by-side panels
- Optimal use of screen space

### Large Desktop (1281px+)
- Maximum content width constraints
- Enhanced spacing
- Larger font sizes for readability

## UI/UX Features

- **Loading States**: Clear loading indicators
- **Error Messages**: User-friendly error displays
- **Success Feedback**: Visual confirmation of successful operations
- **Hover Effects**: Interactive feedback on clickable elements
- **Accessibility**: Semantic HTML, proper ARIA labels, keyboard navigation
- **Color Coding**: Difficulty levels have distinct colors
- **Table Formatting**: Well-formatted query results with sticky headers

