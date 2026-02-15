import React, { useState, useEffect, useMemo } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import api from '../services/api';
import './AssignmentsPage.scss';

const AssignmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAssignments = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/assignments');
                setAssignments(data);
                setError(null);
            } catch (err) {
                console.error('Assignments fetch error:', err);
                const message = err.code === 'ECONNABORTED'
                    ? 'Request timed out. Check connection.'
                    : (err.customMessage || 'Failed to load assignments.');
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadAssignments();
    }, []);

    const filteredAssignments = useMemo(() => {
        return assignments.filter(assignment => {
            const title = (assignment.title || '').toLowerCase();
            const tags = (assignment.tags || []).map(t => t.toLowerCase());
            const term = searchTerm.toLowerCase();

            const matchesSearch = title.includes(term) || tags.some(tag => tag.includes(term));
            const matchesDifficulty = difficultyFilter === 'All' || assignment.difficulty === difficultyFilter;

            return matchesSearch && matchesDifficulty;
        });
    }, [assignments, searchTerm, difficultyFilter]);

    if (error) {
        return (
            <div className="assignments-page error-container">
                <div className="error-state text-center p-10">
                    <p className="text-danger mb-4">{error}</p>
                    <button className="btn-primary px-6 py-2" onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="assignments-page">
            <header className="assignments-page__header">
                <h1 className="page-title">Level up your database game!</h1>
                <p className="page-subtitle">Master queries, solve challenges, turn data into decisions.</p>
            </header>

            <section className="assignments-page__controls">
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
                        aria-label="Search assignments"
                    />
                </div>

                <div className="filter-tabs">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                            key={level}
                            className={`filter-tab ${difficultyFilter === level ? 'active' : ''}`}
                            onClick={() => setDifficultyFilter(level)}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </section>

            <section className="assignments-grid">
                {loading ? (
                    <div className="loading-state col-span-full text-center text-muted">Loading assignments...</div>
                ) : filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment, index) => (
                        <div
                            key={assignment._id}
                            className="grid-item animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <AssignmentCard assignment={{
                                ...assignment,
                                completionCurrent: assignment.completionCurrent ?? 0,
                                completionTotal: assignment.completionTotal ?? 10,
                                locked: false,
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
                            onClick={() => { setSearchTerm(''); setDifficultyFilter('All'); }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AssignmentsPage;
