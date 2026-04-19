import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CourseCommunity = ({ courseId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [memberCount, setMemberCount] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [instructorIds, setInstructorIds] = useState(new Set());
    const messagesEndRef = useRef(null);

    const getAuthToken = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error getting session:', error);
                return null;
            }
            if (!session?.access_token) {
                console.warn('No access token available');
                return null;
            }
            return session.access_token;
        } catch (error) {
            console.error('Exception getting auth token:', error);
            return null;
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchMessages();
        fetchMemberCount();
        fetchInstructors();
        const interval = setInterval(fetchMessages, 10000); // Poll every 10 seconds
        return () => clearInterval(interval);
    }, [courseId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                console.error('No auth token available');
                setLoading(false);
                return;
            }

            console.log('Fetching messages for course:', courseId);
            const response = await fetch(
                `${API_BASE_URL}/api/community/${courseId}/messages?limit=100`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Messages fetched:', data.data.messages.length);
                setMessages(data.data.messages.reverse());
            } else {
                const errorData = await response.json();
                console.error('Error fetching messages:', errorData);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMemberCount = async () => {
        try {
            const token = await getAuthToken();
            if (!token) {
                console.error('No auth token available for member count');
                return;
            }

            console.log('Fetching member count for course:', courseId);
            const response = await fetch(
                `${API_BASE_URL}/api/community/${courseId}/members`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Member count response:', data);
                setMemberCount(data.data.memberCount);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
            }
        } catch (error) {
            console.error('Error fetching member count:', error);
        }
    };

    const fetchInstructors = async () => {
        try {
            const { data, error } = await supabase
                .from('course_instructors')
                .select('user_id')
                .eq('course_id', courseId)
                .eq('is_active', true);

            if (!error && data) {
                setInstructorIds(new Set(data.map(i => i.user_id)));
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const token = await getAuthToken();
            console.log('Sending message to course:', courseId);
            const response = await fetch(
                `${API_BASE_URL}/api/community/${courseId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ message: newMessage })
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Message sent successfully:', data);
                setNewMessage('');
                fetchMessages();
            } else {
                const errorData = await response.json();
                console.error('Error sending message:', errorData);
                alert(`Failed to send message: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please check your connection.');
        } finally {
            setSending(false);
        }
    };

    const handleEditMessage = async (messageId) => {
        if (!editText.trim()) return;

        try {
            const token = await getAuthToken();
            const response = await fetch(
                `${API_BASE_URL}/api/community/messages/${messageId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ message: editText })
                }
            );

            if (response.ok) {
                setEditingId(null);
                setEditText('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = await getAuthToken();
            const response = await fetch(
                `${API_BASE_URL}/api/community/messages/${messageId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                fetchMessages();
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[500px] sm:h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold">Course Community</h2>
                <p className="text-xs sm:text-sm opacity-90">{memberCount} students enrolled</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-primary-50">
                {messages.length === 0 ? (
                    <div className="text-center text-primary-500 mt-8">
                        <p className="text-sm sm:text-base">No messages yet. Be the first to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${msg.user_id === user.id
                                    ? 'bg-accent-600 text-white'
                                    : 'bg-white border border-primary-200 shadow-sm'
                                    }`}
                            >
                                {msg.user_id !== user.id && (
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-xs font-semibold text-primary-700">
                                            {msg.user?.name || 'Student'}
                                        </p>
                                        {instructorIds.has(msg.user_id) && (
                                            <span className="px-2 py-0.5 bg-gradient-to-r from-accent-600 to-accent-700 text-white text-xs font-bold rounded-full">
                                                Instructor
                                            </span>
                                        )}
                                    </div>
                                )}

                                {msg.user_id === user.id && instructorIds.has(msg.user_id) && (
                                    <div className="flex items-center justify-end gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">
                                            Instructor
                                        </span>
                                    </div>
                                )}

                                {editingId === msg.id ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full p-2 border border-primary-300 rounded text-primary-900 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                                            rows="2"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditMessage(msg.id)}
                                                className="text-xs px-2 py-1 bg-success-600 text-white rounded hover:bg-success-700 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditingId(null);
                                                    setEditText('');
                                                }}
                                                className="text-xs px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="break-words text-sm sm:text-base">{msg.message}</p>
                                        <div className="flex items-center justify-between mt-2 gap-2">
                                            <p
                                                className={`text-xs ${msg.user_id === user.id ? 'text-accent-100' : 'text-primary-500'
                                                    }`}
                                            >
                                                {formatTime(msg.created_at)}
                                                {msg.is_edited && ' (edited)'}
                                            </p>
                                            {msg.user_id === user.id && (
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(msg.id);
                                                            setEditText(msg.message);
                                                        }}
                                                        className="text-xs underline hover:text-accent-200 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMessage(msg.id)}
                                                        className="text-xs underline hover:text-accent-200 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-primary-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                        maxLength={2000}
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 sm:px-6 sm:py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors text-sm flex-shrink-0"
                    >
                        <span className="hidden sm:inline">{sending ? 'Sending...' : 'Send'}</span>
                        <span className="sm:hidden">→</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseCommunity;
