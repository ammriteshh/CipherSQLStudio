import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Layout.scss';

const Layout = ({ children, user, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className={`layout bg-main text-main min-h-screen`}>
            <header className="navbar glass-panel sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
                <div className="navbar__container container mx-auto flex items-center justify-between h-16">
                    {/* Brand */}
                    <Link to="/" className="navbar__logo font-bold text-xl tracking-tight text-primary hover:opacity-80 transition-opacity">
                        CipherSQL
                    </Link>

                    {/* Navigation Actions */}
                    <div className="navbar__actions flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="btn-icon theme-toggle p-2 rounded-full hover:bg-hover transition-colors"
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <span role="img" aria-label="Sun">☀️</span>
                            ) : (
                                <span role="img" aria-label="Moon">🌙</span>
                            )}
                        </button>

                        {user && (
                            <div className="user-menu flex items-center gap-4">
                                <span className="user-name font-medium text-sm">{user.username}</span>
                                <button
                                    onClick={onLogout}
                                    className="btn-link text-sm text-muted hover:text-danger conversion-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="layout__content container mx-auto py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
