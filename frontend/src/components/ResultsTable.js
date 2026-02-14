import React from 'react';

const ResultsTable = ({ result, executing, executionTime }) => {
    return (
        <div className="results-section">
            <div className="results-header">
                <span className="results-title">Output</span>
                {result && (
                    <span className={`status-badge ${result.success ? 'success' : 'error'}`}>
                        {result.success ? 'Accepted' : 'Runtime Error'}
                    </span>
                )}
                {executionTime && <span className="time-badge">{executionTime}ms</span>}
            </div>

            <div className="results-body custom-scrollbar">
                {executing ? (
                    <div className="empty-state">
                        <div className="spinner-small" />
                        <span>Running query...</span>
                    </div>
                ) : result ? (
                    result.success ? (
                        <div className="table-responsive">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        {result.columns?.map(col => <th key={col}>{col}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.rows?.map((row, idx) => (
                                        <tr key={idx}>
                                            {result.columns?.map(col => <td key={col}>{row[col]}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="error-message">
                            {result.error}
                        </div>
                    )
                ) : (
                    <div className="empty-state-text">
                        Run a query to see results.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsTable;
