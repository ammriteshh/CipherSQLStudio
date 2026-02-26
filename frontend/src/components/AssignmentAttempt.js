import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './AssignmentAttempt.scss';

// Components
import AssignmentDescription from './AssignmentDescription';
import QueryEditor from './QueryEditor';
import ResultsTable from './ResultsTable';

const AssignmentAttempt = ({ user }) => {
  const { id } = useParams();

  // State
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  // Memoized session ID for the workspace
  const sessionId = useMemo(() => `session_${Math.random().toString(36).substring(2, 10)}`, []);

  const fetchAssignment = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/assignments/${id}`);
      setAssignment(data);
      setSqlQuery(data.initialQuery || '');
    } catch (err) {
      console.error('Failed to fetch assignment:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) return;

    setExecuting(true);
    setQueryResult(null);
    const startTime = performance.now();

    try {
      const { data } = await api.post(`/assignments/${id}/execute`, {
        query: sqlQuery,
        sessionId
      });

      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

      setQueryResult({
        success: true,
        rowCount: data.rowCount,
        columns: data.columns,
        rows: data.data
      });
    } catch (err) {
      setQueryResult({
        success: false,
        error: err.customMessage || 'Query execution failed'
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

    setLoadingHint(true);
    try {
      const { data } = await api.post(`/assignments/${id}/hint`, {
        userQuery: sqlQuery
      });

      if (data.success) {
        setHint(data.hint);
        setShowHintModal(true);
      }
    } catch (err) {
      alert(err.customMessage || 'Failed to get hint');
    } finally {
      setLoadingHint(false);
    }
  };

  const startResizing = (mouseDownEvent) => {
    const startX = mouseDownEvent.clientX;
    const startWidth = leftPanelWidth;

    const onMouseMove = (mouseMoveEvent) => {
      const delta = ((mouseMoveEvent.clientX - startX) / window.innerWidth) * 100;
      const newWidth = Math.min(Math.max(startWidth + delta, 20), 80);
      setLeftPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  if (loading) return <div className="loading-screen">Preparing Workspace...</div>;
  if (!assignment) return <div className="error-screen">Assignment not found.</div>;

  return (
    <div className="assignment-workspace">
      {/* LEFT PANEL: Task & Schema */}
      <div className="workspace-panel left-panel" style={{ width: `${leftPanelWidth}%` }}>
        <AssignmentDescription assignment={assignment} />
      </div>

      {/* DRAGGABLE RESIZER */}
      <div className="workspace-resizer" onMouseDown={startResizing}>
        <div className="resizer-handle" />
      </div>

      {/* RIGHT PANEL: Editor & Results */}
      <div className="workspace-panel right-panel" style={{ width: `${100 - leftPanelWidth}%` }}>
        <div className="panel-actions-bar">
          <span className="lang-label">SQL Editor</span>
          <div className="action-right">
            <button className="btn btn-secondary hint-btn" onClick={handleGetHint} disabled={loadingHint}>
              💡 {loadingHint ? 'Thinking...' : 'Get Hint'}
            </button>
            <button className="btn btn-primary run-btn" onClick={handleExecuteQuery} disabled={executing}>
              {executing ? 'Running...' : '▶ Run Query'}
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
        <div className="modal-overlay" onClick={() => setShowHintModal(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assistant Hint</h3>
              <button className="close-btn" onClick={() => setShowHintModal(false)}>×</button>
            </div>
            <div className="modal-body custom-scrollbar">
              <p>{hint}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowHintModal(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentAttempt;

