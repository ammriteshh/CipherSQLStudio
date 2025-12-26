import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './AssignmentAttempt.scss';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AssignmentAttempt = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/assignments/${id}`);
      setAssignment(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load assignment. Please try again later.');
      console.error('Error fetching assignment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    try {
      setExecuting(true);
      setError(null);
      setQueryResult(null);

      const response = await axios.post(
        `${API_BASE_URL}/assignments/${id}/execute`,
        {
          query: sqlQuery,
          userId: user?.id || 'guest',
          sessionId: `session_${Date.now()}`,
        }
      );

      if (response.data.success) {
        setQueryResult({
          rows: response.data.data,
          rowCount: response.data.rowCount,
          command: response.data.command,
        });
      } else {
        setError(response.data.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to execute query. Please try again.');
      console.error('Error executing query:', err);
    } finally {
      setExecuting(false);
    }
  };

  const handleGetHint = async () => {
    try {
      setLoadingHint(true);
      setHint(null);

      const response = await axios.post(
        `${API_BASE_URL}/assignments/${id}/hint`,
        {
          userQuery: sqlQuery || undefined,
        }
      );

      if (response.data.success) {
        setHint(response.data.hint);
      } else {
        setError(response.data.error || 'Failed to get hint');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get hint. Please try again.');
      console.error('Error getting hint:', err);
    } finally {
      setLoadingHint(false);
    }
  };

  const handleEditorChange = (value) => {
    setSqlQuery(value || '');
  };

  const renderTable = (data) => {
    if (!data || data.length === 0) {
      return <p>No rows returned</p>;
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="results-panel__table-container">
        <table className="results-panel__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="results-panel__th">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="results-panel__tr">
                {columns.map((col) => (
                  <td key={col} className="results-panel__td">
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : 'NULL'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__loading">Loading assignment...</div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="assignment-attempt">
        <div className="assignment-attempt__error">{error}</div>
        <button className="assignment-attempt__btn" onClick={() => navigate('/')}>
          Back to Assignments
        </button>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  return (
    <div className="assignment-attempt">
      <div className="assignment-attempt__header">
        <button 
          className="assignment-attempt__back-btn"
          onClick={() => navigate('/')}
        >
          ← Back to Assignments
        </button>
        <h2 className="assignment-attempt__title">{assignment.title}</h2>
        <span className={`assignment-attempt__difficulty assignment-attempt__difficulty--${assignment.difficulty.toLowerCase()}`}>
          {assignment.difficulty}
        </span>
      </div>

      <div className="assignment-attempt__container">
        {/* Question Panel */}
        <section className="assignment-attempt__panel assignment-attempt__panel--question">
          <h3 className="assignment-attempt__panel-title">Question</h3>
          <div className="assignment-attempt__question-content">
            <p>{assignment.question}</p>
          </div>
        </section>

        {/* Sample Data Viewer */}
        <section className="assignment-attempt__panel assignment-attempt__panel--data">
          <h3 className="assignment-attempt__panel-title">Sample Data</h3>
          <div className="assignment-attempt__data-content">
            {assignment.tableDefinitions.map((table, idx) => (
              <div key={idx} className="data-viewer">
                <h4 className="data-viewer__table-name">{table.name}</h4>
                {table.description && (
                  <p className="data-viewer__description">{table.description}</p>
                )}
                {table.sampleData && table.sampleData.length > 0 && (
                  <div className="data-viewer__table-container">
                    {renderTable(table.sampleData)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SQL Editor Panel */}
        <section className="assignment-attempt__panel assignment-attempt__panel--editor">
          <h3 className="assignment-attempt__panel-title">SQL Editor</h3>
          <div className="assignment-attempt__editor-content">
            <Editor
              height="400px"
              defaultLanguage="sql"
              value={sqlQuery}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
            <div className="assignment-attempt__actions">
              <button
                className="assignment-attempt__btn assignment-attempt__btn--primary"
                onClick={handleExecuteQuery}
                disabled={executing}
              >
                {executing ? 'Executing...' : 'Execute Query'}
              </button>
              <button
                className="assignment-attempt__btn assignment-attempt__btn--secondary"
                onClick={handleGetHint}
                disabled={loadingHint}
              >
                {loadingHint ? 'Loading...' : 'Get Hint'}
              </button>
            </div>
          </div>
        </section>

        {/* Results Panel */}
        <section className="assignment-attempt__panel assignment-attempt__panel--results">
          <h3 className="assignment-attempt__panel-title">Results</h3>
          <div className="assignment-attempt__results-content">
            {error && (
              <div className="results-panel__error">
                <strong>Error:</strong> {error}
              </div>
            )}
            {hint && (
              <div className="results-panel__hint">
                <strong>Hint:</strong> {hint}
              </div>
            )}
            {queryResult && (
              <div className="results-panel__success">
                <p className="results-panel__meta">
                  Query executed successfully. Rows returned: {queryResult.rowCount}
                </p>
                {renderTable(queryResult.rows)}
              </div>
            )}
            {!error && !hint && !queryResult && (
              <div className="results-panel__placeholder">
                Execute a query to see results here
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssignmentAttempt;

