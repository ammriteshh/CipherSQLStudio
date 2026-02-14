import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AssignmentDescription = ({ assignment }) => {
    if (!assignment) return null;

    const renderSchemaTables = (tableDefinitions) => {
        if (!tableDefinitions) return null;

        return tableDefinitions.map((table, index) => {
            const extractColumnsFromSQL = (sql) => {
                try {
                    const content = sql.match(/\(([\s\S]*)\)/)[1];
                    return content.split(',').map(line => {
                        const parts = line.trim().split(/\s+/);
                        if (parts.length >= 2) {
                            return { name: parts[0], type: parts[1] };
                        }
                        return null;
                    }).filter(c => c && !c.name.match(/KEY|CONSTRAINT/i));
                } catch (e) {
                    return Object.keys(table.sampleData[0] || {}).map(k => ({ name: k, type: 'varchar' }));
                }
            };

            const columns = extractColumnsFromSQL(table.createTableSQL);

            return (
                <div key={index} className="schema-table-container" style={{ marginBottom: '25px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#e2e8f0' }}>Table: {table.name}</h4>
                    <div className="table-wrapper" style={{ overflowX: 'auto', border: '1px solid #334155', borderRadius: '6px' }}>
                        <table className="schema-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}>
                                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: '600' }}>Column Name</th>
                                    <th style={{ padding: '12px 16px', color: '#94a3b8', fontWeight: '600' }}>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, i) => (
                                    <tr key={i} style={{ borderBottom: i === columns.length - 1 ? 'none' : '1px solid #1e293b', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '10px 16px', color: '#e2e8f0', fontFamily: 'monospace' }}>{col.name}</td>
                                        <td style={{ padding: '10px 16px', color: '#94a3b8', fontFamily: 'monospace' }}>{col.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ marginTop: '8px', fontSize: '0.9em', color: '#64748b', fontStyle: 'italic' }}>
                        {table.description}
                    </p>
                </div>
            );
        });
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
                <h3>Task</h3>
                <div className="markdown-content">
                    <ReactMarkdown
                        children={assignment.question}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            table: ({ node, ...props }) => <div className="table-wrapper"><table {...props} /></div>,
                            thead: ({ node, ...props }) => <thead {...props} />,
                            tbody: ({ node, ...props }) => <tbody {...props} />,
                            tr: ({ node, ...props }) => <tr {...props} />,
                            th: ({ node, ...props }) => <th {...props} />,
                            td: ({ node, ...props }) => <td {...props} />,
                        }}
                    />
                </div>

                <div className="schema-section">
                    <h3>Database Schema</h3>
                    {renderSchemaTables(assignment.tableDefinitions)}
                </div>
            </div>
        </div>
    );
};

export default AssignmentDescription;
