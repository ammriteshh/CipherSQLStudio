import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AssignmentsPage from './pages/AssignmentsPage';
import AssignmentAttempt from './components/AssignmentAttempt';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  /* ---------- LOAD THEME ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
    setLoading(false);
  }, []);

  /* ---------- APPLY THEME + SMOOTH TRANSITION ---------- */
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme); // Use data-attribute for CSS vars if needed
    // But our global style uses .dark-theme or just variables. 
    // Let's keep the existing logic but ensure it works with our new variables.
    // Our variables are in :root, so theme switching might need class on body.
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token);
    setUser({ ...userData, token });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  if (loading) return <div className="app__loading">Loading...</div>;

  return (
    <Router>
      <div className="app">
        <Layout
          user={user}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        >
          <Routes>
            <Route path="/" element={<AssignmentsPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/assignments/:id" element={<AssignmentAttempt user={user} />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;

