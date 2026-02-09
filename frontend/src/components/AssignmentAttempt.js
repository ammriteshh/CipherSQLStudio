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
  const [activeLeftTab, setActiveLeftTab] = useState('problem'); // 'problem' | 'database'
  const [activeRightTab, setActiveRightTab] = useState('editor'); // 'editor' | 'results'
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // Percentage

  // Hints State
  const [hintsUnlocked, setHintsUnlocked] = useState(0);
  const [hintsContent, setHintsContent] = useState({ 1: null, 2: null, 3: null });
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

  const unlockHint = async (level) => {
    if (hintsUnlocked >= level || loadingHint) return;

    // Cost Logic
    const cost = level === 1 ? 0 : (level === 2 ? 1 : 2);
    if (!window.confirm(level === 1 ? 'Reveal Level 1 hint?' : `Unlock Level ${level} hint for ${cost} stars?`)) {
      return;
    }

    setLoadingHint(true);
    try {
      const response = await api.post(`/assignments/${id}/hint`, {
        userQuery: sqlQuery,
        hintLevel: level,
        userId: user?.id || user?._id
      });

      if (response.data.success) {
        setHintsContent(prev => ({ ...prev, [level]: response.data.hint }));
        setHintsUnlocked(Math.max(hintsUnlocked, level));
      } else {
        alert(response.data.error || 'Failed to unlock hint');
      }
    } catch (err) {
      console.error('Hint error:', err);
      // Fallback for demo
      setHintsContent(prev => ({ ...prev, [level]: `This is a simulated hint for level ${level} because the backend might be unreachable.` }));
      setHintsUnlocked(Math.max(hintsUnlocked, level));
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

  return (
    <div className="assignment-workspace">
      {/* LEFT PANEL */}
      <div className="workspace-panel left-panel" style={{ width: `${leftPanelWidth}%` }}>
        <div className="panel-tabs">
          <button
            className={`tab-btn ${activeLeftTab === 'problem' ? 'active' : ''}`}
            onClick={() => setActiveLeftTab('problem')}
          >
            Problem
          </button>
          <button
            className={`tab-btn ${activeLeftTab === 'database' ? 'active' : ''}`}
            onClick={() => setActiveLeftTab('database')}
          >
            Database Schema
          </button>
        </div>

        <div className="panel-content custom-scrollbar">
          {activeLeftTab === 'problem' ? (
            <div className="problem-view fade-in">
              <div className="problem-header">
                <h2 className="title">{assignment?.title}</h2>
                <span className={`difficulty-badge ${assignment?.difficulty?.toLowerCase()}`}>
                  {assignment?.difficulty}
                </span>
              </div>

              <div className="problem-description glass-card">
                <h3>Task</h3>
                <p>{assignment?.question}</p>
              </div>

              <div className="hints-section">
                <h3>Hints & Help</h3>
                <div className="hint-cards">
                  {[1, 2, 3].map((level) => (
                    <div key={level} className={`hint-card ${hintsUnlocked >= level ? 'unlocked' : 'locked'}`}>
                      <div className="hint-header" onClick={() => unlockHint(level)}>
                        <span>Hint {level}</span>
                        {level === 1 ? (
                          <span className="cost-badge free">Free</span>
                        ) : (
                          <span className="cost-badge">{level === 2 ? '1 Star' : '2 Stars'}</span>
                        )}
                        {hintsUnlocked < level && <span className="lock-icon">🔒</span>}
                      </div>
                      {hintsUnlocked >= level && hintsContent[level] && (
                        <div className="hint-body">
                          {hintsContent[level]}
                        </div>
                      )}
                      {hintsUnlocked >= level && !hintsContent[level] && (
                        <div className="hint-body loading">Loading hint...</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="database-view fade-in">
              {assignment?.tableDefinitions?.map((table, idx) => (
                <div key={idx} className="table-definition glass-card">
                  <div className="table-header">
                    <span className="table-icon">📄</span>
                    <h4>{table.name}</h4>
                  </div>
                  <div className="table-schema">
                    {Object.keys(table.sampleData?.[0] || {}).map(col => (
                      <span key={col} className="column-pill">{col}</span>
                    ))}
                  </div>
                  <div className="table-preview">
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(table.sampleData?.[0] || {}).map(col => <th key={col}>{col}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {table.sampleData?.slice(0, 3).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {Object.values(row).map((val, cIdx) => <td key={cIdx}>{val}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <button className="run-btn" onClick={handleExecuteQuery} disabled={executing}>
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
    </div>
  );
};

export default AssignmentAttempt;
