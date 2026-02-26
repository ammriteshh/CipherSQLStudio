import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AssignmentDescription = ({ assignment }) => {
    if (!assignment) return null;

    /**
     * Extract column names and types from CREATE TABLE SQL
     */
    const getColumnsFromSQL = (table) => {
        try {
            const match = table.createTableSQL.match(/\(([\s\S]*)\)/);
            if (!match) throw new Error('Invalid SQL');

            return match[1]
                .split(',')
                .map(line => {
                    const parts = line.trim().split(/\s+/);
                    return parts.length >= 2 ? { name: parts[0], type: parts[1] } : null;
                })
                .filter(c => c && !['KEY', 'CONSTRAINT', 'PRIMARY', 'FOREIGN'].some(k => c.name.toUpperCase().includes(k)));
        } catch (e) {
            // Fallback to sample data keys if SQL parsing fails
            const sample = table.sampleData?.[0] || {};
            return Object.keys(sample).map(key => ({ name: key, type: typeof sample[key] }));
        }
    };

    return (
        <div className="problem-view fade-in">
            <div className="problem-header">
                <h2 className="title">{assignment.title}</h2>
                <span className={`difficulty-badge ${assignment.difficulty?.toLowerCase()}`}>
                    {assignment.difficulty}
                </span>
            </div>

            <div className="problem-description glass-card">
                <section className="task-section">
                    <h3>Task</h3>
                    <div className="markdown-content">
                        <ReactMarkdown
                            children={assignment.question}
                            remarkPlugins={[remarkGfm]}
                            components={{
                                table: ({ node, ...props }) => <div className="table-wrapper"><table {...props} /></div>,
                            }}
                        />
                    </div>
                </section>

                <section className="schema-section">
                    <h3>Database Schema</h3>
                    {assignment.tableDefinitions?.map((table, idx) => (
                        <div key={idx} className="schema-table-container">
                            <h4 className="schema-table-title">
                                Table: <span className="entity-name">{table.name}</span>
                            </h4>
                            <div className="table-responsive">
                                <table className="schema-table">
                                    <thead>
                                        <tr>
                                            <th>Column</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getColumnsFromSQL(table).map((col, i) => (
                                            <tr key={i}>
                                                <td className="col-name">{col.name}</td>
                                                <td className="col-type">{col.type}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="schema-table-description">{table.description}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default AssignmentDescription;

