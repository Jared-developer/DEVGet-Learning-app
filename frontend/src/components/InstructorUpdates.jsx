import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Bell, FileText, Video, Calendar, Clock, LinkIcon,
    ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle, RefreshCw
} from 'lucide-react';

const InstructorUpdates = ({ courseDbId }) => {
    const [resources, setResources] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeSection, setActiveSection] = useState('announcements');
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        if (courseDbId) {
            console.log('InstructorUpdates: Fetching for course ID:', courseDbId);
            fetchUpdates();
        }
    }, [courseDbId]);

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchResources(),
                fetchSessions(),
                fetchAnnouncements()
            ]);
        } catch (error) {
            console.error('Error fetching updates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchUpdates();
        } finally {
            setRefreshing(false);
        }
    };

    const fetchResources = async () => {
        try {
            const { data, error } = await supabase
                .from('course_resources')
                .select('*')
                .eq('course_id', courseDbId)
                .eq('is_public', true)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching resources:', error);
            } else {
                console.log('Resources fetched:', data?.length || 0);
                setResources(data || []);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchSessions = async () => {
        try {
            const { data, error } = await supabase
                .from('class_sessions')
                .select('*')
                .eq('course_id', courseDbId)
                .order('session_date', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching sessions:', error);
            } else {
                console.log('Sessions fetched:', data?.length || 0);
                setSessions(data || []);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('course_id', courseDbId)
                .eq('target_audience', 'course')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) {
                console.error('Error fetching announcements:', error);
            } else {
                console.log('Announcements fetched:', data?.length || 0);
                setAnnouncements(data || []);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const getAnnouncementIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertCircle className="h-5 w-5" />;
            case 'success': return <CheckCircle className="h-5 w-5" />;
            case 'info': return <Info className="h-5 w-5" />;
            default: return <Bell className="h-5 w-5" />;
        }
    };

    const getAnnouncementColor = (type) => {
        switch (type) {
            case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
            case 'success': return 'bg-green-100 text-green-700 border-green-200';
            case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getSessionStatus = (session) => {
        const now = new Date();
        const sessionDate = new Date(session.session_date);
        const sessionEnd = new Date(sessionDate.getTime() + session.duration_minutes * 60000);

        if (session.status === 'cancelled') return { label: 'Cancelled', color: 'bg-gray-100 text-gray-700' };
        if (session.status === 'completed') return { label: 'Completed', color: 'bg-green-100 text-green-700' };
        if (now >= sessionDate && now <= sessionEnd) return { label: 'Live Now', color: 'bg-red-100 text-red-700 animate-pulse' };
        if (now < sessionDate) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
        return { label: 'Ended', color: 'bg-gray-100 text-gray-700' };
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading updates...</p>
            </div>
        );
    }

    const totalUpdates = announcements.length + resources.length + sessions.length;

    if (totalUpdates === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates Yet</h3>
                <p className="text-gray-600">Your instructor hasn't posted any updates for this course.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Instructor Updates</h2>
                        <p className="text-sm sm:text-base text-gray-600">Stay updated with announcements, resources, and live sessions</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        title="Refresh updates"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveSection('announcements')}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap border-b-2 text-sm sm:text-base ${activeSection === 'announcements'
                            ? 'border-accent-600 text-accent-600 bg-accent-50'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden xs:inline">Announcements</span>
                        <span className="xs:hidden">News</span>
                        {announcements.length > 0 && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-accent-600 text-white text-xs font-semibold rounded-full">
                                {announcements.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveSection('resources')}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap border-b-2 text-sm sm:text-base ${activeSection === 'resources'
                            ? 'border-accent-600 text-accent-600 bg-accent-50'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Resources</span>
                        {resources.length > 0 && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                                {resources.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveSection('sessions')}
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap border-b-2 text-sm sm:text-base ${activeSection === 'sessions'
                            ? 'border-accent-600 text-accent-600 bg-accent-50'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Video className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden xs:inline">Live Sessions</span>
                        <span className="xs:hidden">Live</span>
                        {sessions.length > 0 && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-purple-600 text-white text-xs font-semibold rounded-full">
                                {sessions.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Announcements Section */}
                {activeSection === 'announcements' && (
                    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                        {announcements.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-sm sm:text-base text-gray-600">No announcements yet</p>
                            </div>
                        ) : (
                            announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all ${getAnnouncementColor(announcement.type)}`}
                                >
                                    <div className="flex items-start gap-2 sm:gap-4">
                                        <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                                            {getAnnouncementIcon(announcement.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                                <h3 className="text-base sm:text-lg font-bold break-words">{announcement.title}</h3>
                                                <span className="text-xs font-semibold px-2 py-1 bg-white/50 rounded-full whitespace-nowrap self-start">
                                                    {announcement.type}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm mb-2 whitespace-pre-wrap break-words">{announcement.content}</p>
                                            <p className="text-xs opacity-75">
                                                {new Date(announcement.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Resources Section */}
                {activeSection === 'resources' && (
                    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                        {resources.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-sm sm:text-base text-gray-600">No resources available yet</p>
                            </div>
                        ) : (
                            resources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-all bg-white"
                                >
                                    <div className="space-y-3">
                                        <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words flex-1">{resource.title}</h3>
                                            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full self-start xs:self-center whitespace-nowrap">
                                                {resource.resource_type}
                                            </span>
                                        </div>
                                        {resource.description && (
                                            <p className="text-gray-600 text-xs sm:text-sm break-words">{resource.description}</p>
                                        )}
                                        {resource.lesson_id && (
                                            <p className="text-xs text-gray-500">
                                                📚 Related to: {resource.lesson_id}
                                            </p>
                                        )}
                                        <a
                                            href={resource.resource_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-xs sm:text-sm"
                                        >
                                            <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                            Access Resource
                                        </a>
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">
                                                Added {new Date(resource.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Sessions Section */}
                {activeSection === 'sessions' && (
                    <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                        {sessions.length === 0 ? (
                            <div className="text-center py-8">
                                <Video className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-sm sm:text-base text-gray-600">No live sessions scheduled yet</p>
                            </div>
                        ) : (
                            sessions.map((session) => {
                                const status = getSessionStatus(session);
                                const isExpanded = expandedItems[session.id];

                                return (
                                    <div
                                        key={session.id}
                                        className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-md transition-all bg-white"
                                    >
                                        <div className="p-3 sm:p-4">
                                            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4 mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 mb-2">
                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 break-words">{session.title}</h3>
                                                        <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full self-start xs:self-center whitespace-nowrap ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            <span className="truncate">{new Date(session.session_date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            {new Date(session.session_date).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                                            {session.duration_minutes} min
                                                        </div>
                                                    </div>
                                                </div>
                                                {session.description && (
                                                    <button
                                                        onClick={() => toggleExpand(session.id)}
                                                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-all self-start xs:self-center"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {isExpanded && session.description && (
                                                <div className="mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-gray-700 break-words">{session.description}</p>
                                                </div>
                                            )}

                                            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                                                {session.meeting_link && status.label !== 'Cancelled' && (
                                                    <a
                                                        href={session.meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${status.label === 'Live Now'
                                                            ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                                                            : 'bg-accent-600 text-white hover:bg-accent-700'
                                                            }`}
                                                    >
                                                        <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        {status.label === 'Live Now' ? 'Join Now' : 'Join Meeting'}
                                                    </a>
                                                )}

                                                {session.recording_url && (
                                                    <a
                                                        href={session.recording_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center gap-2 text-accent-600 hover:text-accent-700 font-medium text-xs sm:text-sm"
                                                    >
                                                        <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        Watch Recording
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorUpdates;
