import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import Login from './components/Login';
import Signup from './components/Signup';

/* ---------- SVG ICONS ---------- */
const SunIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [animate, setAnimate] = useState(false);

  /* ---------- LOAD THEME ---------- */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
    setLoading(false);
  }, []);

  /* ---------- APPLY THEME + SMOOTH TRANSITION ---------- */
  useEffect(() => {
    document.documentElement.style.transition =
      'background-color 0.35s ease, color 0.35s ease';

    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => {
    setAnimate(true);
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    setTimeout(() => setAnimate(false), 450);
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
        <header className="app__header">
          <div className="app__header-content">
            <h1 className="app__logo">CipherSQLStudio</h1>

            <nav className="app__nav">
              {/* THEME TOGGLE WITH SPRING / BOUNCE */}
              <button
                aria-label="Toggle theme"
                onClick={handleToggleTheme}
                onFocus={(e) => e.target.blur()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: animate
                    ? 'rotate(200deg) scale(1.15)'
                    : 'rotate(0deg) scale(1)',
                  transition: animate
                    ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'transform 0.25s ease'
                }}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>

              {user ? (
                <>
                  <span className="app__user">Welcome, {user.username || 'User'}</span>
                  <button className="app__btn app__btn--secondary" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="app__link">Login</Link>
                  <Link to="/signup" className="app__link">Signup</Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="app__main">
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignments/:id" element={<AssignmentAttempt user={user} />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
