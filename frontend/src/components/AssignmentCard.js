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

    // Difficulty Badge Logic
    const getDifficultyColor = (level) => {
        switch (level.toLowerCase()) {
            case 'beginner': return 'var(--diff-beginner)';
            case 'intermediate': return 'var(--diff-intermediate)';
            case 'advanced': return 'var(--diff-advanced)';
            default: return 'var(--primary)';
        }
    };

    const getDifficultyIcon = (level) => {
        switch (level.toLowerCase()) {
            case 'beginner': return '🌱';
            case 'intermediate': return '⚡';
            case 'advanced': return '🔥';
            default: return '📚';
        }
    };

    return (
        <Link to={locked ? '#' : `/assignments/${_id}`} className={`assignment-card ${locked ? 'assignment-card--locked' : ''}`}>
            <div className="assignment-card__glass" />

            <div className="assignment-card__content">
                <div className="assignment-card__header">
                    <span
                        className="assignment-card__badge"
                        style={{
                            backgroundColor: `${getDifficultyColor(difficulty)}20`,
                            color: getDifficultyColor(difficulty),
                            borderColor: `${getDifficultyColor(difficulty)}40`
                        }}
                    >
                        {getDifficultyIcon(difficulty)} {difficulty}
                    </span>
                    {locked && <span className="assignment-card__locked-icon">🔒</span>}
                </div>

                <h3 className="assignment-card__title">{title}</h3>

                <div className="assignment-card__meta">
                    <span className="assignment-card__time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {estimatedTime || '15 min'}
                    </span>
                </div>

                <div className="assignment-card__tags">
                    {tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="assignment-card__tag">#{tag}</span>
                    ))}
                </div>

                <div className="assignment-card__footer">
                    <div className="assignment-card__progress">
                        <div className="progress-info">
                            <span>Progress</span>
                            <span>{progressPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${progressPercentage}%`,
                                    backgroundColor: getDifficultyColor(difficulty)
                                }}
                            />
                        </div>
                    </div>

                    <div className={`assignment-card__action ${locked ? 'locked' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AssignmentCard;
