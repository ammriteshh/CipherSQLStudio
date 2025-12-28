import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AssignmentList.scss';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);

      // First attempt with current api.defaults.baseURL
      let response = await api.get('/assignments');
      setAssignments(response.data);
      setError(null);
    } catch (err) {
      console.warn('Initial assignments fetch failed:', err && err.message ? err.message : err);

      // Try to detect a working base and retry once
      try {
        await import('../services/api').then(m => m.detectApiBase && m.detectApiBase());
        const response2 = await api.get('/assignments');
        setAssignments(response2.data);
        setError(null);
      } catch (err2) {
        const statusText = err2.response ? ` (${err2.response.status} ${err2.response.statusText})` : ` (${err2.message || 'Network Error'})`;
        setError('Failed to load assignments. Please try again later.' + statusText + '\nIf the problem persists, check backend CORS_ORIGIN and REACT_APP_API_URL on the server.');
        console.error('Error fetching assignments after retry:', err2);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentClick = (assignmentId) => {
    navigate(`/assignments/${assignmentId}`);
  };

  const getDifficultyClass = (difficulty) => {
    const difficultyLower = difficulty.toLowerCase();
    return `assignment-card__difficulty assignment-card__difficulty--${difficultyLower}`;
  };

  if (loading) {
    return (
      <div className="assignment-list">
        <div className="assignment-list__container">
          <div className="assignment-list__loading">Loading assignments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-list">
        <div className="assignment-list__container">
          <div className="assignment-list__error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="assignment-list">
      <div className="assignment-list__container">
        <h2 className="assignment-list__title">SQL Assignments</h2>
        <p className="assignment-list__subtitle">
          Select an assignment to start practicing SQL queries
        </p>
        
        <div className="assignment-list__grid">
          {assignments.length === 0 ? (
            <div className="assignment-list__empty">
              No assignments available at the moment.
            </div>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="assignment-card"
                onClick={() => handleAssignmentClick(assignment.id)}
              >
                <div className="assignment-card__header">
                  <h3 className="assignment-card__title">{assignment.title}</h3>
                  <span className={getDifficultyClass(assignment.difficulty)}>
                    {assignment.difficulty}
                  </span>
                </div>
                <p className="assignment-card__description">{assignment.description}</p>
                <div className="assignment-card__footer">
                  <button className="assignment-card__btn">Start Assignment</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentList;

