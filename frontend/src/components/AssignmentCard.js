import React from 'react';
import { Link } from 'react-router-dom';
import './AssignmentCard.scss';

const AssignmentCard = ({ assignment }) => {
    const {
        _id,
        title,
        difficulty,
        estimatedTime,
        tags = [],
        completionCurrent = 0,
        completionTotal = 10,
        locked = false
    } = assignment;

    const progressPercentage = Math.round((completionCurrent / completionTotal) * 100);

    // Difficulty Icon Helper
    const getDifficultyIcon = (level) => {
        const icons = {
            beginner: '🌱',
            intermediate: '⚡',
            advanced: '🔥'
        };
        return icons[level?.toLowerCase()] || '📚';
    };

    return (
        <Link
            to={locked ? '#' : `/assignments/${_id}`}
            className={`assignment-card ${locked ? 'assignment-card--locked' : ''}`}
        >
            <div className="assignment-card__content">
                <div className="assignment-card__header">
                    <span className={`assignment-card__badge assignment-card__badge--${difficulty.toLowerCase()}`}>
                        {getDifficultyIcon(difficulty)} {difficulty}
                    </span>
                    {locked && <span className="assignment-card__locked-icon">🔒</span>}
                </div>

                <h3 className="assignment-card__title">{title}</h3>

                <div className="assignment-card__meta">
                    <span className="assignment-card__time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {estimatedTime || '15 min'}
                    </span>
                    <span className="assignment-card__sep">•</span>
                    <span className="assignment-card__progress-text">
                        {progressPercentage}% Complete
                    </span>
                </div>

                <div className="assignment-card__tags">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="assignment-card__tag">#{tag}</span>
                    ))}
                </div>

                <div className="assignment-card__footer">
                    <div className="assignment-card__progress-bar">
                        <div
                            className={`progress-fill progress-fill--${difficulty.toLowerCase()}`}
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AssignmentCard;
