# CipherSQLStudio

A browser-based SQL learning platform that provides interactive assignments with a sandboxed PostgreSQL environment and AI-powered hints.

## Features

- **Assignment Management**: Browse and attempt SQL assignments with varying difficulty levels
- **Interactive SQL Editor**: Monaco Editor integration for writing and executing SQL queries
- **Sandboxed Query Execution**: Secure PostgreSQL sandbox with schema isolation
- **AI-Powered Hints**: Get helpful guidance without complete solutions
- **Sample Data Visualization**: View table schemas and sample data for each assignment
- **Mobile-First Design**: Fully responsive UI optimized for all screen sizes
- **Progress Tracking**: Optional user progress tracking and query history

## Technical Stack

- **Frontend**: React.js with Monaco Editor
- **Styling**: Vanilla SCSS (Mobile-First, BEM naming convention)
- **Backend**: Node.js with Express.js
- **Sandbox Database**: PostgreSQL (for live query execution)
- **Persistence Database**: MongoDB Atlas (for assignments and user progress)
- **LLM Integration**: Google Gemini API for hint generation

## Project Structure

```
CipherSQLStudio/
├── frontend/           # React application
│   ├── public/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── styles/     # SCSS files
│   │   └── App.js
│   └── package.json
├── backend/            # Express.js API server
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   ├── db/             # Database connections
│   ├── models/         # MongoDB models
│   └── server.js       # Main entry point
├── .env.example        # Environment variables template
└── README.md
```



## Running Locally

1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The server will start on port 5000 (default).

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm start
    ```
    The application will run on http://localhost:3000.
