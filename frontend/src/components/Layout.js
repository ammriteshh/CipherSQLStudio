import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Layout.scss';

const Layout = ({ children, user, onLogout }) => {
    // eslint-disable-next-line no-unused-vars
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`layout ${theme}`}>
            <header className="navbar glass-panel">
                <div className="navbar__container">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="logo-text">CipherSQL</span>
                    </Link>

                    {/* Actions */}
                    <div className="navbar__actions">
                        <button onClick={toggleTheme} className="btn-icon theme-toggle" title="Toggle Theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        {user && (
                            <div className="user-menu">
                                <span className="user-name">{user.username}</span>
                                <button onClick={onLogout} className="btn-link">Logout</button>
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
