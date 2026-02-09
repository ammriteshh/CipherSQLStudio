import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../services/api';
import './AssignmentAttempt.scss';

const AssignmentAttempt = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Data State
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Execution State
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  // UI State
  const [activeRightTab, setActiveRightTab] = useState('editor'); // 'editor' | 'results'
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // Percentage
  const [showHintModal, setShowHintModal] = useState(false);

  // Hints State
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/assignments/${id}`);
      setAssignment(response.data);
      setSqlQuery(response.data.initialQuery || '');
      setError(null);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      // Fallback for demo if backend is offline
      setAssignment({
        _id: '1',
        title: 'Basic SELECT Statements',
        difficulty: 'Beginner',
        question: 'Retrieve all columns from the "employees" table.',
        tableDefinitions: [
          {
            name: 'employees',
            description: 'Contains employee details',
            sampleData: [
              { id: 1, name: 'Alice', role: 'Engineer' },
              { id: 2, name: 'Bob', role: 'Designer' }
            ]
          }
        ]
      });
      setSqlQuery('SELECT * FROM employees;');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) return;

    setExecuting(true);
    setQueryResult(null);
    const startTime = performance.now();
    setActiveRightTab('results');

    try {
      const response = await api.post(`/assignments/${id}/execute`, {
        query: sqlQuery,
        userId: user?.id || user?._id || 'guest',
        sessionId: `session_${Date.now()}`
      });

      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

      if (response.data.success) {
        setQueryResult({
          success: true,
          rowCount: response.data.rowCount,
          columns: response.data.columns || (response.data.data.length > 0 ? Object.keys(response.data.data[0]) : []),
          rows: response.data.data
        });
      } else {
        setQueryResult({
          success: false,
          error: response.data.error || 'Query execution failed'
        });
      }

    } catch (err) {
      setQueryResult({
        success: false,
        error: err.response?.data?.error || err.message || 'Query execution failed'
      });
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    if (hint) {
      setShowHintModal(true);
      return;
    }

    if (loadingHint) return;

    // REMOVED: Confirmation dialog for cost
    /*
    if (!window.confirm('Get a hint for 1 star?')) {
      return;
    }
    */

    setLoadingHint(true);
    try {
      const response = await api.post(`/assignments/${id}/hint`, {
        userQuery: sqlQuery,
        userId: user?.id || user?._id
      });

      if (response.data.success) {
        setHint(response.data.hint);
        setShowHintModal(true);
      } else {
        alert(response.data.error || 'Failed to get hint');
      }
    } catch (err) {
      console.error('Hint error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to connect to hint service. Please try again later.';
      alert(errorMessage);
    } finally {
      setLoadingHint(false);
    }
  };

  // Resize Logic
  const startResizing = (mouseDownEvent) => {
    const startX = mouseDownEvent.clientX;
    const startWidth = leftPanelWidth;

    const onMouseMove = (mouseMoveEvent) => {
      const newWidth = startWidth + ((mouseMoveEvent.clientX - startX) / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftPanelWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  if (loading) return <div className="loading-screen">Loading Workspace...</div>;

  const renderAssignmentDescription = (assignment) => {
    return (
      <div className="formatted-description">
        {assignment.tableDefinitions && assignment.tableDefinitions.map((table, index) => {

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
        })}

        <div className="question-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#cbd5e1', fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace' }}>
          {assignment.question}
        </div>
      </div>
    );
  };

  return (
    <div className="assignment-workspace">
      {/* LEFT PANEL */}
      <div className="workspace-panel left-panel" style={{ width: `${leftPanelWidth}%` }}>
        <div className="problem-view fade-in">
          <div className="problem-header">
            <h2 className="title">{assignment?.title}</h2>
            <span className={`difficulty-badge ${assignment?.difficulty?.toLowerCase()}`}>
              {assignment?.difficulty}
            </span>
          </div>

          <div className="problem-description glass-card">
            <h3>Task</h3>
            {assignment && renderAssignmentDescription(assignment)}
          </div>
        </div>
      </div>

      {/* RESIZER */}
      <div className="workspace-resizer" onMouseDown={startResizing}>
        <div className="resizer-handle" />
      </div>

      {/* RIGHT PANEL */}
      <div className="workspace-panel right-panel" style={{ width: `${100 - leftPanelWidth}%` }}>
        <div className="panel-tabs">
          <button
            className={`tab-btn ${activeRightTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveRightTab('editor')}
          >
            SQL Editor
          </button>
          <button
            className={`tab-btn ${activeRightTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveRightTab('results')}
          >
            Query Results
            {queryResult && <span className={`status-dot ${queryResult.success ? 'success' : 'error'}`} />}
          </button>

          <div className="panel-actions">
            <button
              className="btn btn-secondary hint-btn"
              onClick={handleGetHint}
              title="Need help? Get a hint"
            >
              <span className="icon">💡</span> {loadingHint ? 'Loading...' : 'Get Hint'}
            </button>
            <div className="divider-vertical"></div>
            <button className="btn btn-primary run-btn" onClick={handleExecuteQuery} disabled={executing}>
              {executing ? 'Running...' : '▶ Run Query'}
            </button>
          </div>
        </div>

        <div className="panel-content">
          <div className={`editor-container ${activeRightTab === 'editor' ? 'visible' : 'hidden'}`}>
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={sqlQuery}
              onChange={(value) => setSqlQuery(value)}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
              onMount={(editor) => { editorRef.current = editor; }}
            />
          </div>

          <div className={`results-container ${activeRightTab === 'results' ? 'visible' : 'hidden'}`}>
            {executing ? (
              <div className="empty-state">
                <div className="spinner" />
                <p>Executing Query...</p>
              </div>
            ) : queryResult ? (
              <div className="query-results animate-slide-up">
                <div className="results-meta">
                  <span className={`status ${queryResult.success ? 'success' : 'error'}`}>
                    {queryResult.success ? 'Success' : 'Error'}
                  </span>
                  {executionTime && <span className="time">⏱ {executionTime}ms</span>}
                  {queryResult.rowCount !== undefined && <span className="rows">{queryResult.rowCount} rows</span>}
                </div>

                {queryResult.success ? (
                  <div className="results-table-wrapper custom-scrollbar">
                    <table className="results-table">
                      <thead>
                        <tr>
                          {queryResult.columns?.map(col => <th key={col}>{col}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.rows?.map((row, idx) => (
                          <tr key={idx}>
                            {queryResult.columns?.map(col => <td key={col}>{row[col]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="error-display">
                    <pre>{queryResult.error}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">⌨️</div>
                <p>Run a query to see results here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HINT MODAL */}
      {showHintModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h3>Hint</h3>
              <button className="close-btn" onClick={() => setShowHintModal(false)}>×</button>
            </div>
            <div className="modal-body custom-scrollbar">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{hint}</pre>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setShowHintModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default AssignmentAttempt;
