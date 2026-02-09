import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children, user, onLogout, theme, onToggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    // Custom Icons
    const HomeIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
    );

    const BookIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
    );

    const HistoryIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    );

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
        { label: 'Home', path: '/', icon: <HomeIcon /> },
        { label: 'Assignments', path: '/assignments', icon: <BookIcon /> },
        { label: 'History', path: '/history', icon: <HistoryIcon /> },
    ];

    return (
        <div className="layout">
            {/* Sidebar - Persistent Mini */}
            <aside
                className={`layout__sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}
                onMouseEnter={() => setIsSidebarCollapsed(false)}
                onMouseLeave={() => setIsSidebarCollapsed(true)}
            >
                <div className="layout__sidebar-logo">
                    <span className="logo-icon">CS</span>
                    <span className="logo-text text-gradient">CipherSQL</span>
                </div>

                <nav className="layout__nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`layout__nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            title={item.label}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {location.pathname === item.path && <div className="nav-indicator" />}
                        </Link>
                    ))}
                </nav>

                <div className="layout__sidebar-footer">
                    <button onClick={onToggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </button>
                </div>
            </aside>

            <div className="layout__content">
                {/* Glass Header */}
                <header className="layout__header glass-panel">
                    <div className="header-breadcrumbs">
                        <span className="text-muted">CipherSQL</span>
                        <span className="separator">/</span>
                        <span className="current">{location.pathname === '/' ? 'Home' : location.pathname.split('/')[1]}</span>
                    </div>

                    <div className="header-actions">
                        {user ? (
                            <div className="user-profile">
                                <div className="user-avatar gradient-bg">
                                    {user.username ? user.username[0].toUpperCase() : 'U'}
                                </div>
                                <span className="user-name">{user.username}</span>
                                <button onClick={onLogout} className="btn-logout">Logout</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-login">Login</Link>
                                <Link to="/signup" className="btn-signup">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="layout__main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
