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
                <div key={index} className="schema-table-container">
                    <h4 className="schema-table-title">Table: <span className="entity-name">{table.name}</span></h4>
                    <div className="table-responsive">
                        <table className="schema-table">
                            <thead>
                                <tr>
                                    <th>Column Name</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {columns.map((col, i) => (
                                    <tr key={i}>
                                        <td className="col-name">{col.name}</td>
                                        <td className="col-type">{col.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="schema-table-description">
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
