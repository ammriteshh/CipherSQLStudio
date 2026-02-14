import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './AssignmentAttempt.scss';

// Components
import AssignmentDescription from './AssignmentDescription';
import QueryEditor from './QueryEditor';
import ResultsTable from './ResultsTable';

const AssignmentAttempt = ({ user }) => {
  const { id } = useParams();

  // Data State
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Execution State
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  // UI State
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // Percentage
  const [showHintModal, setShowHintModal] = useState(false);

  // Hints State
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/assignments/${id}`);
      setAssignment(response.data);
      setSqlQuery(response.data.initialQuery || '');
    } catch (err) {
      console.error('Error fetching assignment:', err);
      // Demo Fallback
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
      // console.error('Hint error:', err);
      alert(err.response?.data?.error || 'Failed to connect to hint service.');
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
        <AssignmentDescription assignment={assignment} />
      </div>

      {/* RESIZER */}
      <div className="workspace-resizer" onMouseDown={startResizing}>
        <div className="resizer-handle" />
      </div>

      {/* RIGHT PANEL */}
      <div className="workspace-panel right-panel" style={{ width: `${100 - leftPanelWidth}%` }}>
        <div className="panel-actions-bar">
          <div className="action-left">
            <span className="lang-label">SQL (PostgreSQL)</span>
          </div>
          <div className="action-right">
            <button
              className="btn btn-secondary hint-btn"
              onClick={handleGetHint}
              title="Need help? Get a hint"
            >
              <span className="icon">💡</span> {loadingHint ? 'Loading...' : 'Hint'}
            </button>
            <button className="btn btn-primary run-btn" onClick={handleExecuteQuery} disabled={executing}>
              {executing ? 'running...' : '▶ Run Code'}
            </button>
          </div>
        </div>

        <div className="panel-content-split">
          <QueryEditor value={sqlQuery} onChange={setSqlQuery} />

          <ResultsTable
            result={queryResult}
            executing={executing}
            executionTime={executionTime}
          />
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
