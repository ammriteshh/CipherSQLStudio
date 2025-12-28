import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AssignmentList from './components/AssignmentList';
import AssignmentAttempt from './components/AssignmentAttempt';
import Login from './components/Login';
import Signup from './components/Signup';
import api, { detectApiBase } from './services/api';


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detectedApiBase, setDetectedApiBase] = useState(null);
  const [showApiBanner, setShowApiBanner] = useState(true);

  // Theme: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch (e) {}
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setUser({ token });
    }
    setLoading(false);

    (async () => {
      try {
        const base = await detectApiBase();
        if (base) setDetectedApiBase(base);
        else if (api && api.defaults && api.defaults.baseURL) setDetectedApiBase(api.defaults.baseURL);
      } catch (err) {
        if (api && api.defaults && api.defaults.baseURL) setDetectedApiBase(api.defaults.baseURL);
      }
    })();
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('authToken', token);
    setUser({ ...userData, token });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  if (loading) {
    return <div className="app__loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <header className="app__header">
          <div className="app__header-content">
            <h1 className="app__logo">CipherSQLStudio</h1>

            {/* Temporary API banner */}
            {detectedApiBase && showApiBanner && (
              <div style={{
                background: '#fff8c6',
                border: '1px solid #f2e08f',
                padding: '6px 10px',
                borderRadius: 4,
                margin: '8px 0',
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}>
                <strong style={{marginRight:6}}>Detected API:</strong>
                <span style={{fontFamily:'monospace'}}>{detectedApiBase}</span>
                <button
                  style={{marginLeft:12, padding:'4px 8px', cursor:'pointer'}}
                  onClick={() => setShowApiBanner(false)}
                >Dismiss</button>
              </div>
            )}

            <nav className="app__nav">
              {/* Theme toggle */}
              <button
                className="app__btn app__btn--secondary"
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                style={{padding:8, minWidth:44}}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
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
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/" /> : <Signup onLogin={handleLogin} />} 
            />
          </Routes>
        </main>

        {/* <footer className="app__footer">
          <p>CipherSQLStudio</p>
        </footer> */}
      </div>
    </Router>
  );
}

export default App;

