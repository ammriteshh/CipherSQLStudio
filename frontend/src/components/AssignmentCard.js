import React from 'react';
import { Link } from 'react-router-dom';
import './AssignmentCard.scss';

const AssignmentCard = ({ assignment }) => {
    const {
        _id,
        title,
        difficulty,
        estimatedTime = '10 min',
        tags = ['SQL'],
        progress = 0,
        locked = false
    } = assignment;

    const difficultyIcon = useMemo(() => {
        switch (difficulty?.toLowerCase()) {
            case 'beginner': return '🌱';
            case 'intermediate': return '⚡';
            case 'advanced': return '🔥';
            default: return '📚';
        }
    }, [difficulty]);

    return (
        <Link to={locked ? '#' : `/assignments/${_id}`} className={`assignment-card ${locked ? 'is-locked' : ''}`}>
            <div className="card-header">
                <span className={`badge badge--${difficulty?.toLowerCase()}`}>
                    {difficultyIcon} {difficulty}
                </span>
                {locked && <span className="lock-icon">🔒</span>}
            </div>

            <h3 className="card-title">{title}</h3>

            <div className="card-meta">
                <span className="meta-item time">⏱ {estimatedTime}</span>
                <span className="meta-item progress">{progress}% Complete</span>
            </div>

            <div className="card-tags">
                {tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                ))}
            </div>

            <div className="card-progress">
                <div className="progress-bar">
                    <div
                        className={`fill fill--${difficulty?.toLowerCase()}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </Link>
    );
};

// Optimization: skip re-render if assignment hasn't changed
export default React.memo(AssignmentCard);

