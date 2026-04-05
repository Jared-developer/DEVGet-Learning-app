import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const InstructorManager = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [instructors, setInstructors] = useState({});
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchCourses();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchInstructors(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('id, title')
                .order('title');

            if (error) throw error;
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/instructors/users`, {
                headers: {
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                }
            });

            if (response.status === 403) {
                setMessage({
                    type: 'error',
                    text: 'You need admin access to manage instructors. Please contact an administrator.'
                });
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchInstructors = async (courseId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/instructors/course/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setInstructors(prev => ({ ...prev, [courseId]: data }));
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

    const assignInstructor = async () => {
        if (!selectedCourse || !selectedUser) {
            setMessage({ type: 'error', text: 'Please select both course and user' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/instructors/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                },
                body: JSON.stringify({
                    user_id: selectedUser,
                    course_id: selectedCourse
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Instructor assigned successfully!' });
                setSelectedUser('');
                fetchInstructors(selectedCourse);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to assign instructor' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to assign instructor' });
        } finally {
            setLoading(false);
        }
    };

    const removeInstructor = async (courseId, userId) => {
        if (!confirm('Are you sure you want to remove this instructor?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/instructors/${courseId}/instructor/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                }
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Instructor removed successfully!' });
                fetchInstructors(courseId);
            } else {
                const data = await response.json();
                setMessage({ type: 'error', text: data.error || 'Failed to remove instructor' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to remove instructor' });
        }
    };

    return (
        <div className="instructor-manager">
            <h2>Instructor Management</h2>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="assign-section">
                <h3>Assign Instructor to Course</h3>

                <div className="form-group">
                    <label>Select Course:</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="form-control"
                    >
                        <option value="">-- Select Course --</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Select User:</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="form-control"
                    >
                        <option value="">-- Select User --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.email} ({user.fullName})
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={assignInstructor}
                    disabled={loading || !selectedCourse || !selectedUser}
                    className="btn btn-primary"
                >
                    {loading ? 'Assigning...' : 'Assign Instructor'}
                </button>
            </div>

            {selectedCourse && instructors[selectedCourse] && (
                <div className="instructors-list">
                    <h3>Current Instructors</h3>
                    {instructors[selectedCourse].length === 0 ? (
                        <p>No instructors assigned to this course yet.</p>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Name</th>
                                    <th>Assigned Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {instructors[selectedCourse].map(instructor => (
                                    <tr key={instructor.id}>
                                        <td>{instructor.user?.email}</td>
                                        <td>{instructor.user?.raw_user_meta_data?.fullName || 'N/A'}</td>
                                        <td>{new Date(instructor.assigned_at).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => removeInstructor(selectedCourse, instructor.user_id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            <style>{`
        .instructor-manager {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          margin-bottom: 30px;
          color: #333;
        }

        h3 {
          margin: 20px 0 15px;
          color: #555;
        }

        .message {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .message.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .assign-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-control {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .btn-primary {
          background-color: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .btn-primary:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .btn-danger {
          background-color: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background-color: #c82333;
        }

        .btn-sm {
          padding: 5px 10px;
          font-size: 12px;
        }

        .instructors-list {
          margin-top: 30px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .table th,
        .table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .table tbody tr:hover {
          background-color: #f8f9fa;
        }

        @media (max-width: 768px) {
          .instructor-manager {
            padding: 10px;
          }

          .table {
            font-size: 12px;
          }

          .table th,
          .table td {
            padding: 8px;
          }
        }
      `}</style>
        </div>
    );
};

export default InstructorManager;
