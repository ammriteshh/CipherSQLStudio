import React, { useState, useEffect } from 'react';
import AssignmentCard from '../components/AssignmentCard';
import './AssignmentsPage.scss';

// Mock Data (Replace with API call later)
const MOCK_ASSIGNMENTS = [
    {
        _id: '1',
        title: 'Basic SELECT Statements',
        difficulty: 'Beginner',
        estimatedTime: '10 min',
        tags: ['SELECT', 'FROM', 'Basics'],
        completionCurrent: 10,
        completionTotal: 10,
        locked: false
    },
    {
        _id: '2',
        title: 'Filtering with WHERE',
        difficulty: 'Beginner',
        estimatedTime: '15 min',
        tags: ['WHERE', 'Operators', 'Filtering'],
        completionCurrent: 5,
        completionTotal: 10,
        locked: false
    },
    {
        _id: '3',
        title: 'Joints and Relationships',
        difficulty: 'Intermediate',
        estimatedTime: '30 min',
        tags: ['JOIN', 'Foreign Keys', 'Relations'],
        completionCurrent: 0,
        completionTotal: 10,
        locked: false
    },
    {
        _id: '4',
        title: 'Aggregation Functions',
        difficulty: 'Intermediate',
        estimatedTime: '25 min',
        tags: ['GROUP BY', 'HAVING', 'COUNT'],
        completionCurrent: 0,
        completionTotal: 10,
        locked: true
    },
    {
        _id: '5',
        title: 'Advanced Subqueries',
        difficulty: 'Advanced',
        estimatedTime: '45 min',
        tags: ['Subqueries', 'Nested', 'Complex'],
        completionCurrent: 0,
        completionTotal: 10,
        locked: true
    },
    {
        _id: '6',
        title: 'Window Functions',
        difficulty: 'Advanced',
        estimatedTime: '50 min',
        tags: ['OVER', 'PARTITION BY', 'RANK'],
        completionCurrent: 0,
        completionTotal: 10,
        locked: true
    }
];

const AssignmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('All');
    const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);

    const filteredAssignments = assignments.filter(assignment => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesDifficulty = filterDifficulty === 'All' || assignment.difficulty === filterDifficulty;

        return matchesSearch && matchesDifficulty;
    });

    return (
        <div className="assignments-page">
            <div className="assignments-page__header">
                <h1 className="page-title text-gradient">Practice SQL</h1>
                <p className="page-subtitle">Master database queries with interactive challenges.</p>
            </div>

            <div className="assignments-page__controls glass-panel">
                <div className="search-bar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search assignments, tags..."
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
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment, index) => (
                        <div
                            key={assignment._id}
                            className="grid-item animate-slide-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <AssignmentCard assignment={assignment} />
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
