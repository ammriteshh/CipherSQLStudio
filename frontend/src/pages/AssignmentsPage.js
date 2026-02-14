import React, { useState, useEffect } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import api from '../services/api'; // Import API service
import './AssignmentsPage.scss';

const AssignmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await api.get('/assignments');
                setAssignments(response.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch assignments:', err);
                if (err.code === 'ECONNABORTED') {
                    setError('Request timed out. Please check your internet connection or try again later.');
                } else {
                    setError(err.customMessage || err.message || 'Failed to load assignments. Please check your connection.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const filteredAssignments = assignments.filter(assignment => {
        const title = assignment.title || '';
        const tags = assignment.tags || []; // Backend might not send tags yet

        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDifficulty = filterDifficulty === 'All' || assignment.difficulty === filterDifficulty;

        return matchesSearch && matchesDifficulty;
    });

    return (
        <div className="assignments-page">
            <div className="assignments-page__header">
                <h1 className="page-title">Level up your database game!</h1>
                <p className="page-subtitle">Master queries, solve challenges, turn data into decisions.</p>
            </div>

            <div className="assignments-page__controls">
                <div className="search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        className="premium-input"
                        placeholder="Search assignments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-tabs">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                            key={level}
                            className={`filter-tab ${filterDifficulty === level ? 'active' : ''}`}
                            onClick={() => setFilterDifficulty(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <div className="assignments-grid">
                {loading ? (
                    <div className="loading-state">Loading assignments...</div>
                ) : error ? (
                    <div className="error-state" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
                        <button
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                            style={{ padding: '8px 24px' }}
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment, index) => (
                        <div
                            key={assignment._id}
                            className="grid-item animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <AssignmentCard assignment={{
                                ...assignment,
                                // Default values if missing from backend
                                completionCurrent: 0,
                                completionTotal: 10,
                                locked: false, // Explicitly unlock everything
                                tags: assignment.tags || ['SQL'],
                                estimatedTime: assignment.estimatedTime || '10 min'
                            }} />
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No assignments found matching your criteria.</p>
                        <button
                            className="btn-reset"
                            onClick={() => { setSearchTerm(''); setFilterDifficulty('All'); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentsPage;
