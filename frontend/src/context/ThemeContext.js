import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or default to 'dark' (developer preference)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    // We can remove the loading state if we initialize synchronously from localStorage
    // promoting a faster first paint without flash of wrong theme.

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Optional: Add class to body if strictly needed by some external libs, 
        // but data-attribute on root is usually sufficient and cleaner.
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
