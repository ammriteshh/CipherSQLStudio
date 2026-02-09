import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children, user, onLogout }) => {
    // eslint-disable-next-line no-unused-vars
    const location = useLocation();

    return (
        <div className="layout">
            <header className="navbar glass-panel">
                <div className="navbar__container">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="logo-text">CipherSQL</span>
                    </Link>

                    {/* Navigation - Removed as requested
                    <nav className="navbar__nav">
                        ...
                    </nav>
                    */}

                    {/* Actions */}
                    <div className="navbar__actions">
                        {/* Theme Toggle Removed */}

                        {/* Auth Buttons Removed / Kept Logout only if user is logged in? 
                            User said "remove login, signup". 
                            If a user IS logged in, they might need to logout.
                            But strict instruction "remove... login, signup".
                            I will keep User Menu if logged in (so they can logout), but remove Login/Signup buttons.
                        */}

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
