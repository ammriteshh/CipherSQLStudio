import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children, user, onLogout, theme, onToggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Icons
    const SunIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

    const MoonIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
    );

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Assignments', path: '/assignments' },
        { label: 'History', path: '/history' },
    ];

    return (
        <div className="layout">
            <header className="navbar glass-panel">
                <div className="navbar__container">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="logo-text">CipherSQL</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="navbar__nav">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`navbar__link ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="navbar__actions">
                        <button onClick={onToggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>

                        <div className="divider-vertical"></div>

                        {user ? (
                            <div className="user-menu">
                                <span className="user-name">{user.username}</span>
                                <button onClick={onLogout} className="btn-link">Logout</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn btn-outline">Login</Link>
                                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="layout__content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
