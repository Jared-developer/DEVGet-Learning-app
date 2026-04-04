import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CourseResources = ({ courseId }) => {
  const [resources, setResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resources');

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;

      // Fetch resources
      const resourcesRes = await fetch(`/api/instructors/resources/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (resourcesRes.ok) {
        const resourcesData = await resourcesRes.json();
        setResources(resourcesData);
      }

      // Fetch sessions
      const sessionsRes = await fetch(`/api/instructors/sessions/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    const icons = {
      recording: '🎥',
      presentation: '📊',
      document: '📄',
      link: '🔗',
      other: '📎'
    };
    return icons[type] || '📎';
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#007bff',
      ongoing: '#28a745',
      completed: '#6c757d',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) {
    return <div className="loading">Loading resources...</div>;
  }

  return (
    <div className="course-resources">
      <div className="tabs">
        <button
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          📚 Resources ({resources.length})
        </button>
        <button
          className={activeTab === 'sessions' ? 'active' : ''}
          onClick={() => setActiveTab('sessions')}
        >
          🎓 Class Sessions ({sessions.length})
        </button>
      </div>

      {activeTab === 'resources' && (
        <div className="tab-content">
          {resources.length === 0 ? (
            <p className="empty-message">No resources available yet.</p>
          ) : (
            <div className="resources-grid">
              {resources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-icon">
                    {getResourceIcon(resource.resource_type)}
                  </div>
                  <div className="resource-content">
                    <h4>{resource.title}</h4>
                    {resource.description && (
                      <p className="description">{resource.description}</p>
                    )}
                    <div className="resource-meta">
                      <span className="type-badge">{resource.resource_type}</span>
                      {resource.lesson_id && (
                        <span className="lesson-badge">Lesson: {resource.lesson_id}</span>
                      )}
                    </div>
                    <a
                      href={resource.resource_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-button"
                    >
                      View Resource →
                    </a>
                    <div className="resource-footer">
                      <small>
                        Added {new Date(resource.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="tab-content">
          {sessions.length === 0 ? (
            <p className="empty-message">No class sessions scheduled yet.</p>
          ) : (
            <div className="sessions-list">
              {sessions.map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <h4>{session.title}</h4>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(session.status) }}
                    >
                      {session.status}
                    </span>
                  </div>
                  {session.description && (
                    <p className="description">{session.description}</p>
                  )}
                  <div className="session-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{new Date(session.session_date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">🕐</span>
                      <span>{new Date(session.session_date).toLocaleTimeString()}</span>
                    </div>
                    {session.duration_minutes && (
                      <div className="detail-item">
                        <span className="icon">⏱️</span>
                        <span>{session.duration_minutes} minutes</span>
                      </div>
                    )}
                  </div>
                  <div className="session-actions">
                    {session.meeting_link && session.status !== 'completed' && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="join-button"
                      >
                        Join Meeting
                      </a>
                    )}
                    {session.recording_url && (
                      <a
                        href={session.recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="recording-button"
                      >
                        View Recording
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .course-resources {
          margin: 20px 0;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .tabs::-webkit-scrollbar {
          display: none;
        }

        .tabs button {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 16px;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .tabs button.active {
          color: #007bff;
          border-bottom-color: #007bff;
          font-weight: 600;
        }

        .tabs button:hover {
          color: #007bff;
        }

        .tab-content {
          padding: 20px 0;
        }

        .loading,
        .empty-message {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          font-size: 14px;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .resource-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          display: flex;
          gap: 15px;
        }

        .resource-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .resource-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .resource-content {
          flex: 1;
          min-width: 0;
        }

        .resource-content h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 18px;
          word-wrap: break-word;
        }

        .description {
          color: #666;
          font-size: 14px;
          margin: 10px 0;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .resource-meta {
          display: flex;
          gap: 8px;
          margin: 10px 0;
          flex-wrap: wrap;
        }

        .type-badge,
        .lesson-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .type-badge {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .lesson-badge {
          background-color: #f3e5f5;
          color: #7b1fa2;
        }

        .view-button {
          display: inline-block;
          margin: 10px 0;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 14px;
          transition: background-color 0.3s;
          word-wrap: break-word;
        }

        .view-button:hover {
          background-color: #0056b3;
        }

        .resource-footer {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .resource-footer small {
          color: #999;
          font-size: 12px;
        }

        .sessions-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .session-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
          gap: 12px;
        }

        .session-header h4 {
          margin: 0;
          color: #333;
          font-size: 20px;
          flex: 1;
          word-wrap: break-word;
          min-width: 0;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .session-details {
          display: flex;
          gap: 20px;
          margin: 15px 0;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 14px;
        }

        .detail-item .icon {
          font-size: 18px;
        }

        .session-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }

        .join-button,
        .recording-button {
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
          text-align: center;
        }

        .join-button {
          background-color: #28a745;
          color: white;
        }

        .join-button:hover {
          background-color: #218838;
        }

        .recording-button {
          background-color: #6c757d;
          color: white;
        }

        .recording-button:hover {
          background-color: #5a6268;
        }

        @media (max-width: 768px) {
          .course-resources {
            margin: 15px 0;
          }

          .tabs {
            gap: 6px;
            margin-bottom: 15px;
            padding-bottom: 2px;
          }

          .tabs button {
            font-size: 13px;
            padding: 10px 14px;
            min-width: auto;
          }

          .tab-content {
            padding: 15px 0;
          }

          .resources-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .resource-card {
            padding: 16px;
            flex-direction: column;
            gap: 12px;
          }

          .resource-icon {
            font-size: 28px;
            align-self: flex-start;
          }

          .resource-content h4 {
            font-size: 16px;
            margin-bottom: 8px;
          }

          .description {
            font-size: 13px;
            margin: 8px 0;
          }

          .resource-meta {
            gap: 6px;
            margin: 8px 0;
          }

          .type-badge,
          .lesson-badge {
            font-size: 11px;
            padding: 3px 8px;
          }

          .view-button {
            display: block;
            text-align: center;
            margin: 8px 0;
            padding: 10px 16px;
            font-size: 13px;
          }

          .resource-footer {
            margin-top: 8px;
            padding-top: 8px;
          }

          .resource-footer small {
            font-size: 11px;
          }

          .sessions-list {
            gap: 15px;
          }

          .session-card {
            padding: 16px;
          }

          .session-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .session-header h4 {
            font-size: 17px;
          }

          .status-badge {
            font-size: 11px;
            padding: 5px 10px;
          }

          .session-details {
            flex-direction: column;
            gap: 8px;
            margin: 12px 0;
          }

          .detail-item {
            font-size: 13px;
          }

          .detail-item .icon {
            font-size: 16px;
          }

          .session-actions {
            flex-direction: column;
            gap: 8px;
          }

          .join-button,
          .recording-button {
            width: 100%;
            padding: 12px 20px;
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .tabs button {
            font-size: 12px;
            padding: 8px 12px;
          }

          .resource-card {
            padding: 14px;
          }

          .resource-content h4 {
            font-size: 15px;
          }

          .description {
            font-size: 12px;
          }

          .session-card {
            padding: 14px;
          }

          .session-header h4 {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseResources;
