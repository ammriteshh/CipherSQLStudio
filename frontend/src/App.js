import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AssignmentsPage from './pages/AssignmentsPage';
import AssignmentAttempt from './components/AssignmentAttempt';
import Login from './components/Login';
import Signup from './components/Signup';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Layout user={user} onLogout={logout}>
            <Routes>
              <Route path="/" element={<AssignmentsPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/assignments/:id" element={<AssignmentAttempt user={user} />} />

              <Route
                path="/login"
                element={user ? <Navigate to="/" /> : <Login onLogin={login} />}
              />
              <Route
                path="/signup"
                element={user ? <Navigate to="/" /> : <Signup onLogin={login} />}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;


