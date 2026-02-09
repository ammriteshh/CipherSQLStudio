import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AssignmentCard from './AssignmentCard';
import './AssignmentList.scss';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      let response = await api.get('/assignments');
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      console.warn('Initial assignments fetch failed, using fallback data if available:', err);
      // Fallback data for demonstration/development if API fails
      setAssignments([
        { _id: '1', title: 'Basic SQL Select', difficulty: 'Beginner', estimatedTime: '15 min', tags: ['SELECT', 'Basics'], completionCurrent: 0, completionTotal: 10 },
        { _id: '2', title: 'Filtering Data', difficulty: 'Beginner', estimatedTime: '20 min', tags: ['WHERE', 'Filtering'], completionCurrent: 0, completionTotal: 10 },
        { _id: '3', title: 'Joins and Unions', difficulty: 'Intermediate', estimatedTime: '45 min', tags: ['JOIN', 'UNION'], completionCurrent: 0, completionTotal: 10 },
        { _id: '4', title: 'Aggregations', difficulty: 'Intermediate', estimatedTime: '30 min', tags: ['GROUP BY', 'SUM'], completionCurrent: 0, completionTotal: 10 },
        { _id: '5', title: 'Subqueries', difficulty: 'Advanced', estimatedTime: '60 min', tags: ['Subqueries', 'Nested'], completionCurrent: 0, completionTotal: 10 },
      ]);
      setError(null); // Clear error to show fallback data
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = (assignment.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (assignment.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDifficulty = filterDifficulty === 'All' || assignment.difficulty === filterDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="assignments-page__loading">
        <div className="spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

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

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="assignments-grid">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((assignment, index) => (
            <div
              key={assignment._id || assignment.id}
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

export default AssignmentList;

