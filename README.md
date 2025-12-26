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
- **LLM Integration**: OpenAI/Google GenAI for hint generation

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

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the backend directory:
   ```bash
   cd backend
   copy .env.example .env  # Windows
   # OR
   cp .env.example .env    # Mac/Linux
   ```
   
   **📖 For detailed instructions on obtaining and configuring all API keys, see [API_KEYS_SETUP.md](API_KEYS_SETUP.md)**
   
   The `.env` file needs:
   - MongoDB Atlas connection string
   - PostgreSQL credentials  
   - OpenAI or Google AI API key
   - JWT secret

4. Set up PostgreSQL schema:
   - The application will create isolated schemas per user/session automatically
   - Ensure PostgreSQL is running and accessible

5. Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will open at `http://localhost:3000`

## Environment Variables

### Backend (.env)

- `PORT`: Express server port (default: 5000)
- `MONGODB_URI`: MongoDB Atlas connection string
- `POSTGRES_HOST`: PostgreSQL host
- `POSTGRES_PORT`: PostgreSQL port (default: 5432)
- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DATABASE`: PostgreSQL database name
- `OPENAI_API_KEY`: OpenAI API key for hints (optional if using Google AI)
- `GOOGLE_AI_API_KEY`: Google AI API key for hints (optional if using OpenAI)
- `JWT_SECRET`: Secret key for JWT token signing

## API Endpoints

- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get assignment details
- `POST /api/assignments/:id/execute` - Execute SQL query
- `POST /api/assignments/:id/hint` - Get AI-generated hint
- `POST /api/auth/register` - Register new user (optional)
- `POST /api/auth/login` - Login user (optional)
- `GET /api/progress/:userId` - Get user progress (optional)

## Security Features

- Query validation to prevent DDL/DML commands on system tables
- SQL injection prevention
- Schema isolation using PostgreSQL's `SET search_path`
- Input sanitization

## Responsive Breakpoints

- Mobile: 320px and above
- Tablet: 641px and above
- Desktop: 1024px and above
- Large Desktop: 1281px and above

## Development

- Backend uses Express.js with CORS enabled
- Frontend uses Create React App
- SCSS compilation handled by React scripts
- Hot reload enabled in development mode

## License

MIT

