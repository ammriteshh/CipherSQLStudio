import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import api from '../services/api';
import healthService from '../services/healthService';
import './AssignmentsPage.scss';

const AssignmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Fetching challenges...');
    const [error, setError] = useState(null);

    const fetchAssignments = useCallback(async () => {
        try {
            setLoading(true);
            setLoadingMessage('Fetching challenges...');
            setError(null);
            console.log('[AssignmentsPage] Starting assignments fetch');
            
            // First ensure backend is awake
            const isReady = await healthService.waitForReady();
            if (!isReady) {
                throw new Error('The server is taking too long to wake up. Please try again in a moment.');
            }

            const { data } = await api.get('/assignments');
            console.log('[AssignmentsPage] Assignments fetch succeeded', {
                count: Array.isArray(data) ? data.length : 0
            });
            setAssignments(data);
        } catch (err) {
            console.error('[AssignmentsPage] Failed to fetch assignments', {
                message: err.customMessage || err.message,
                code: err.code,
                status: err.response?.status
            });
            setError(err.customMessage || err.message || 'Failed to connect to the SQL Studio service.');
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    useEffect(() => {
        if (!loading) {
            return undefined;
        }

        const timeoutId = setTimeout(() => {
            setLoadingMessage('Server is starting, please wait...');
        }, 60000);

        return () => clearTimeout(timeoutId);
    }, [loading]);

    const filteredAssignments = useMemo(() => {
        return assignments.filter(item => {
            const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDifficulty = difficultyFilter === 'All' || item.difficulty === difficultyFilter;
            return matchesSearch && matchesDifficulty;
        });
    }, [assignments, searchTerm, difficultyFilter]);

    if (loading) {
        return <div className="assignments-loading">{loadingMessage}</div>;
    }

    if (error) {
        return (
            <div className="assignments-error">
                <p>{error}</p>
                <button className="btn btn-primary" onClick={fetchAssignments}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="assignments-page">
            <header className="page-header">
                <h1>SQL Challenges</h1>
                <p>Master your database skills with interactive assignments.</p>
            </header>

            <div className="filters-bar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="tabs">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                        <button
                            key={lvl}
                            className={`tab ${difficultyFilter === lvl ? 'is-active' : ''}`}
                            onClick={() => setDifficultyFilter(lvl)}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            <div className="assignments-grid">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((item) => (
                        <AssignmentCard
                            key={item._id}
                            assignment={{
                                ...item,
                                progress: 0, // In production this would come from UserProgress
                                locked: false
                            }}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>No challenges found matching your filters.</p>
                        <button className="btn-link" onClick={() => { setSearchTerm(''); setDifficultyFilter('All'); }}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentsPage;

