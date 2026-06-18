import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Error types for better UX
const ERROR_TYPES = {
    NETWORK: 'NETWORK_ERROR',
    AUTH: 'AUTH_ERROR',
    VALIDATION: 'VALIDATION_ERROR',
    RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
    NOT_FOUND: 'NOT_FOUND',
    SERVER: 'SERVER_ERROR'
};

// Retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000
};

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
    const [error, setError] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('connected');
    const [retryCount, setRetryCount] = useState(0);
    const [healthCheck, setHealthCheck] = useState(true);
    const messagesEndRef = useRef(null);
    const pollIntervalRef = useRef(null);
    const lastSuccessfulFetch = useRef(Date.now());
    const healthCheckRef = useRef(null);

    // Enhanced authentication with retry logic
    const getAuthToken = async (retries = RETRY_CONFIG.maxRetries) => {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Error getting session:', error);
                    if (attempt === retries) {
                        setError({ type: ERROR_TYPES.AUTH, message: 'Authentication failed. Please sign in again.' });
                        return null;
                    }
                    continue;
                }
                if (!session?.access_token) {
                    console.warn('No access token available');
                    if (attempt === retries) {
                        setError({ type: ERROR_TYPES.AUTH, message: 'Authentication required. Please sign in.' });
                        return null;
                    }
                    continue;
                }
                return session.access_token;
            } catch (error) {
                console.error('Exception getting auth token:', error);
                if (attempt === retries) {
                    setError({ type: ERROR_TYPES.AUTH, message: 'Authentication system unavailable. Please try again later.' });
                    return null;
                }
                // Exponential backoff
                await new Promise(resolve => 
                    setTimeout(resolve, Math.min(RETRY_CONFIG.baseDelay * Math.pow(2, attempt), RETRY_CONFIG.maxDelay))
                );
            }
        }
        return null;
    };

    // Enhanced API call with retry logic, request cancellation and better error handling
    const makeApiCall = async (url, options = {}, retries = RETRY_CONFIG.maxRetries) => {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('Authentication failed');
        }

        // Create an AbortController for request cancellation
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // Increased to 30 seconds

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        ...options.headers
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    setConnectionStatus('connected');
                    setError(null);
                    return await response.json();
                }

                // Handle specific HTTP status codes
                if (response.status === 429) {
                    throw new Error(ERROR_TYPES.RATE_LIMIT);
                } else if (response.status === 401 || response.status === 403) {
                    throw new Error(ERROR_TYPES.AUTH);
                } else if (response.status === 404) {
                    throw new Error(ERROR_TYPES.NOT_FOUND);
                } else if (response.status >= 500) {
                    throw new Error(ERROR_TYPES.SERVER);
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Unknown error occurred');
                }
            } catch (error) {
                clearTimeout(timeoutId);
                
                // Handle AbortError specifically
                if (error.name === 'AbortError') {
                    console.error('Request was aborted (timeout or cancelled)');
                    
                    // If this is the last attempt, don't throw immediately - try with longer timeout
                    if (attempt === retries) {
                        console.warn('All attempts failed due to timeout. API may be slow or unavailable.');
                        setConnectionStatus('error');
                        throw new Error(ERROR_TYPES.NETWORK);
                    }
                }
                
                console.error(`API call attempt ${attempt + 1} failed:`, error);
                
                if (attempt === retries) {
                    setConnectionStatus('error');
                    throw error;
                } else {
                    setConnectionStatus('retrying');
                    // Exponential backoff with jitter
                    const delay = Math.min(RETRY_CONFIG.baseDelay * Math.pow(2, attempt), RETRY_CONFIG.maxDelay);
                    const jitter = Math.random() * 1000; // Add up to 1 second of jitter
                    await new Promise(resolve => setTimeout(resolve, delay + jitter));
                }
            }
        }
    };

    // Health check to detect backend availability
    const performHealthCheck = useCallback(async () => {
        try {
            // Simple connectivity test - try to reach the API base URL
            const response = await fetch(`${API_BASE_URL}/health`, { 
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                signal: AbortSignal.timeout(5000) // 5 second timeout for health check
            }).catch(() => null);
            
            if (response && response.ok) {
                setHealthCheck(true);
                return true;
            }
            
            // If health endpoint doesn't exist, try a basic GET to the API root
            const fallbackResponse = await fetch(API_BASE_URL, {
                method: 'GET',
                mode: 'cors', 
                cache: 'no-cache',
                signal: AbortSignal.timeout(5000)
            }).catch(() => null);
            
            const isHealthy = fallbackResponse && (fallbackResponse.ok || fallbackResponse.status === 404);
            setHealthCheck(isHealthy);
            
            if (!isHealthy) {
                console.warn('Health check failed - API may be unreachable');
            }
            
            return isHealthy;
        } catch (error) {
            console.warn('Health check error:', error);
            setHealthCheck(false);
            return false;
        }
    }, []);

    const handleApiError = useCallback((error, context) => {
        console.error(`${context} error:`, error);
        
        let errorMessage = 'An unexpected error occurred. Please try again.';
        let errorType = ERROR_TYPES.SERVER;

        if (error.message === ERROR_TYPES.RATE_LIMIT) {
            errorMessage = 'You\'re performing actions too quickly. Please wait a moment and try again.';
            errorType = ERROR_TYPES.RATE_LIMIT;
        } else if (error.message === ERROR_TYPES.AUTH) {
            errorMessage = 'Authentication failed. Please refresh the page and try again.';
            errorType = ERROR_TYPES.AUTH;
        } else if (error.message === ERROR_TYPES.NOT_FOUND) {
            errorMessage = 'The requested data was not found.';
            errorType = ERROR_TYPES.NOT_FOUND;
        } else if (error.name === 'TypeError' || error.message.includes('fetch')) {
            errorMessage = 'Network connection error. Please check your internet connection.';
            errorType = ERROR_TYPES.NETWORK;
        }

        setError({ type: errorType, message: errorMessage, context });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        let mounted = true;

        const initializeChat = async () => {
            try {
                // First check if the backend is reachable
                const healthOk = await performHealthCheck();
                
                if (!healthOk) {
                    console.warn('Backend is not reachable, entering offline mode');
                    setConnectionStatus('error');
                    setError({
                        type: ERROR_TYPES.NETWORK,
                        message: 'Community chat is temporarily unavailable. The server may be starting up or under maintenance.',
                        showInChat: true
                    });
                    setLoading(false);
                    return;
                }

                // If health check passes, proceed with normal initialization
                await Promise.all([
                    fetchMessages(),
                    fetchMemberCount(),
                    fetchInstructors()
                ]);
            } catch (error) {
                if (mounted) {
                    handleApiError(error, 'initialization');
                    setLoading(false);
                }
            }
        };

        initializeChat();
        
        // Start periodic health checks (less frequent)
        healthCheckRef.current = setInterval(() => {
            if (connectionStatus === 'error') {
                performHealthCheck().then(isHealthy => {
                    if (isHealthy && mounted) {
                        console.log('Backend is back online, attempting to reconnect...');
                        setConnectionStatus('connected');
                        setError(null);
                        fetchMessages(false);
                    }
                });
            }
        }, 60000); // Every minute when in error state
        
        // Set up polling with adaptive interval
        const startPolling = () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
            
            // Much longer intervals when there are connection issues
            let pollInterval;
            if (connectionStatus === 'error') {
                pollInterval = 60000; // 1 minute when in error state
            } else if (connectionStatus === 'retrying') {
                pollInterval = 30000; // 30 seconds when retrying
            } else {
                pollInterval = 20000; // 20 seconds when connected (increased from 15s)
            }
            
            pollIntervalRef.current = setInterval(() => {
                if (mounted && !loading && document.visibilityState === 'visible' && connectionStatus === 'connected') {
                    fetchMessages(false); // Only poll when connected and page is visible
                }
            }, pollInterval);
        };

        startPolling();

        // Handle page visibility changes to reduce unnecessary requests
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                }
            } else {
                startPolling();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            mounted = false;
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
            if (healthCheckRef.current) {
                clearInterval(healthCheckRef.current);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [courseId, connectionStatus]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        
        try {
            console.log('Fetching messages for course:', courseId);
            const data = await makeApiCall(
                `${API_BASE_URL}/api/community/${courseId}/messages?limit=100`
            );
            
            console.log('Messages fetched:', data.data.messages.length);
            setMessages(data.data.messages.reverse());
            lastSuccessfulFetch.current = Date.now();
            setRetryCount(0);
        } catch (error) {
            handleApiError(error, 'fetch messages');
            
            // Graceful degradation: if we have cached messages and it's been less than 10 minutes, keep showing them
            const timeSinceLastSuccess = Date.now() - lastSuccessfulFetch.current;
            if (messages.length === 0 || timeSinceLastSuccess > 10 * 60 * 1000) {
                // Show error state only if we have no cached data or it's very old
                setError(prev => ({ 
                    ...prev, 
                    showInChat: true,
                    message: 'Unable to load messages. The server may be slow or temporarily unavailable.'
                }));
            } else {
                // We have recent cached data, show a less intrusive warning
                console.warn('Using cached messages due to network issues');
            }
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    const fetchMemberCount = async () => {
        try {
            console.log('Fetching member count for course:', courseId);
            const data = await makeApiCall(`${API_BASE_URL}/api/community/${courseId}/members`);
            
            console.log('Member count response:', data);
            setMemberCount(data.data.memberCount);
        } catch (error) {
            handleApiError(error, 'fetch member count');
            // Don't show error for member count failures, just keep previous value or show fallback
            if (memberCount === 0) {
                setMemberCount('?'); // Show unknown member count
            }
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
            // Don't show error for instructor failures
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        // Validate message length on frontend
        if (newMessage.length > 2000) {
            setError({ 
                type: ERROR_TYPES.VALIDATION, 
                message: 'Message is too long. Maximum 2000 characters allowed.',
                temporary: true 
            });
            setTimeout(() => setError(null), 3000);
            return;
        }

        setSending(true);
        const originalMessage = newMessage;
        
        try {
            console.log('Sending message to course:', courseId);
            const data = await makeApiCall(
                `${API_BASE_URL}/api/community/${courseId}/messages`,
                {
                    method: 'POST',
                    body: JSON.stringify({ message: newMessage })
                }
            );

            console.log('Message sent successfully:', data);
            setNewMessage('');
            
            // Add optimistic update
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                message: originalMessage,
                user_id: user.id,
                user: {
                    email: user.email,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'You'
                },
                created_at: new Date().toISOString(),
                is_edited: false
            };
            setMessages(prev => [...prev, optimisticMessage]);
            
            // Refresh messages to get the real message and remove optimistic update
            setTimeout(() => fetchMessages(false), 500);
            
        } catch (error) {
            // Restore message text on failure
            setNewMessage(originalMessage);
            handleApiError(error, 'send message');
            
            // Show user-friendly error
            if (error.message === ERROR_TYPES.RATE_LIMIT) {
                setError({ 
                    type: ERROR_TYPES.RATE_LIMIT, 
                    message: 'You\'re sending messages too quickly. Please wait a moment.',
                    temporary: true 
                });
            } else {
                setError({ 
                    type: ERROR_TYPES.NETWORK, 
                    message: 'Failed to send message. Please check your connection and try again.',
                    temporary: true 
                });
            }
            
            setTimeout(() => setError(null), 5000);
        } finally {
            setSending(false);
        }
    };

    const handleEditMessage = async (messageId) => {
        if (!editText.trim()) {
            setError({ 
                type: ERROR_TYPES.VALIDATION, 
                message: 'Message cannot be empty.',
                temporary: true 
            });
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (editText.length > 2000) {
            setError({ 
                type: ERROR_TYPES.VALIDATION, 
                message: 'Message is too long. Maximum 2000 characters allowed.',
                temporary: true 
            });
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            await makeApiCall(
                `${API_BASE_URL}/api/community/messages/${messageId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify({ message: editText })
                }
            );

            setEditingId(null);
            setEditText('');
            fetchMessages(false);
        } catch (error) {
            handleApiError(error, 'edit message');
            
            if (error.message === ERROR_TYPES.RATE_LIMIT) {
                setError({ 
                    type: ERROR_TYPES.RATE_LIMIT, 
                    message: 'You\'re editing too frequently. Please wait a moment.',
                    temporary: true 
                });
            } else {
                setError({ 
                    type: ERROR_TYPES.NETWORK, 
                    message: 'Failed to edit message. Please try again.',
                    temporary: true 
                });
            }
            
            setTimeout(() => setError(null), 5000);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await makeApiCall(
                `${API_BASE_URL}/api/community/messages/${messageId}`,
                { method: 'DELETE' }
            );

            // Optimistically remove the message
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
            
        } catch (error) {
            handleApiError(error, 'delete message');
            
            if (error.message === ERROR_TYPES.RATE_LIMIT) {
                setError({ 
                    type: ERROR_TYPES.RATE_LIMIT, 
                    message: 'You\'re deleting too frequently. Please wait a moment.',
                    temporary: true 
                });
            } else {
                setError({ 
                    type: ERROR_TYPES.NETWORK, 
                    message: 'Failed to delete message. Please try again.',
                    temporary: true 
                });
            }
            
            setTimeout(() => setError(null), 5000);
            // Refresh to restore the message if deletion failed
            fetchMessages(false);
        }
    };

    const formatTime = (timestamp) => {
        try {
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
        } catch {
            return 'Unknown time';
        }
    };

    const renderErrorBanner = () => {
        if (!error || !error.showInChat) return null;

        const getErrorColor = () => {
            switch (error.type) {
                case ERROR_TYPES.RATE_LIMIT:
                    return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                case ERROR_TYPES.AUTH:
                    return 'bg-red-50 border-red-200 text-red-800';
                case ERROR_TYPES.NETWORK:
                    return 'bg-orange-50 border-orange-200 text-orange-800';
                default:
                    return 'bg-gray-50 border-gray-200 text-gray-800';
            }
        };

        return (
            <div className={`p-3 border-b ${getErrorColor()}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{error.message}</span>
                        {error.type === ERROR_TYPES.NETWORK && (
                            <button
                                onClick={() => {
                                    setError(null);
                                    fetchMessages();
                                }}
                                className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50 transition-colors"
                            >
                                Retry
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-lg hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    };

    const renderConnectionStatus = () => {
        if (connectionStatus === 'connected') return null;

        const statusConfig = {
            retrying: { text: 'Reconnecting...', color: 'text-yellow-600', bg: 'bg-yellow-50' },
            error: { text: 'Connection lost', color: 'text-red-600', bg: 'bg-red-50' }
        };

        const config = statusConfig[connectionStatus];
        if (!config) return null;

        return (
            <div className={`p-2 ${config.bg} border-b text-center`}>
                <span className={`text-xs ${config.color}`}>
                    {config.text}
                    {connectionStatus === 'retrying' && (
                        <span className="ml-1 animate-spin">⟳</span>
                    )}
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading community chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[500px] sm:h-[600px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent-600 to-accent-700 text-white p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold">Course Community</h2>
                <p className="text-xs sm:text-sm opacity-90">
                    {memberCount} students enrolled
                    {connectionStatus !== 'connected' && (
                        <span className="ml-2 text-yellow-200">
                            • {connectionStatus === 'retrying' ? 'Reconnecting...' : 'Offline'}
                        </span>
                    )}
                </p>
            </div>

            {/* Connection Status */}
            {renderConnectionStatus()}

            {/* Error Banner */}
            {renderErrorBanner()}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-primary-50">
                {messages.length === 0 ? (
                    <div className="text-center text-primary-500 mt-8">
                        <p className="text-sm sm:text-base">
                            {error && error.type === ERROR_TYPES.NETWORK 
                                ? 'Unable to load messages. Check your connection and try again.'
                                : 'No messages yet. Be the first to start the conversation!'
                            }
                        </p>
                        {error && error.type === ERROR_TYPES.NETWORK && (
                            <button
                                onClick={() => {
                                    setError(null);
                                    fetchMessages();
                                }}
                                className="mt-2 px-4 py-2 bg-accent-600 text-white rounded-lg text-sm hover:bg-accent-700 transition-colors"
                            >
                                Retry Loading
                            </button>
                        )}
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-2 sm:p-3 ${
                                    msg.user_id === user.id
                                        ? 'bg-accent-600 text-white'
                                        : 'bg-white border border-primary-200 shadow-sm'
                                } ${msg.id.toString().startsWith('temp-') ? 'opacity-70' : ''}`}
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
                                            maxLength={2000}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditMessage(msg.id)}
                                                disabled={!editText.trim()}
                                                className="text-xs px-2 py-1 bg-success-600 text-white rounded hover:bg-success-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
                                                className={`text-xs ${
                                                    msg.user_id === user.id ? 'text-accent-100' : 'text-primary-500'
                                                }`}
                                            >
                                                {formatTime(msg.created_at)}
                                                {msg.is_edited && ' (edited)'}
                                                {msg.id.toString().startsWith('temp-') && ' (sending...)'}
                                            </p>
                                            {msg.user_id === user.id && !msg.id.toString().startsWith('temp-') && (
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

            {/* Error Message */}
            {error && error.temporary && !error.showInChat && (
                <div className="px-3 sm:px-4 py-2 bg-red-50 border-t border-red-200">
                    <p className="text-sm text-red-600">{error.message}</p>
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-primary-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                            connectionStatus === 'connected' 
                                ? 'Type your message...' 
                                : 'Reconnecting...'
                        }
                        className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                        maxLength={2000}
                        disabled={sending || connectionStatus !== 'connected'}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending || connectionStatus !== 'connected'}
                        className="px-4 py-2 sm:px-6 sm:py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:bg-primary-300 disabled:cursor-not-allowed transition-colors text-sm flex-shrink-0"
                    >
                        <span className="hidden sm:inline">
                            {sending ? 'Sending...' : 'Send'}
                        </span>
                        <span className="sm:hidden">
                            {sending ? '...' : '→'}
                        </span>
                    </button>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{newMessage.length}/2000 characters</span>
                    {connectionStatus !== 'connected' && (
                        <span className="text-red-500">
                            Connection issue - messages may not send
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CourseCommunity;
