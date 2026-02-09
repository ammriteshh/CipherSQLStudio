import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AssignmentList from './components/AssignmentList';
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
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
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
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignments" element={<AssignmentList />} />
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

