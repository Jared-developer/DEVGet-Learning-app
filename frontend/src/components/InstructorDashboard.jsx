import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import Footer from './Footer';
import {
    BookOpen, Video, Bell, Upload, Calendar, Link as LinkIcon,
    Trash2, Plus, FileText, Clock, Users, CheckCircle, AlertCircle
} from 'lucide-react';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('resources');
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [announcements, setAnnouncements] = useState([]);

    const [newResource, setNewResource] = useState({
        title: '', description: '', resource_type: 'recording',
        resource_url: '', lesson_id: ''
    });

    const [newSession, setNewSession] = useState({
        title: '', description: '', session_date: '',
        duration_minutes: 60, meeting_link: '', status: 'scheduled'
    });

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '', content: '', type: 'info'
    });

    useEffect(() => { fetchMyCourses(); }, []);
    useEffect(() => {
        if (selectedCourse) {
            fetchResources();
            fetchSessions();
            fetchAnnouncements();
        }
    }, [selectedCourse]);

    const fetchMyCourses = async () => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch('/api/instructors/my-courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
                if (data.length > 0) setSelectedCourse(data[0].course_id);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchResources = async () => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`/api/instructors/resources/${selectedCourse}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setResources(await response.json());
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const fetchSessions = async () => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`/api/instructors/sessions/${selectedCourse}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) setSessions(await response.json());
        } catch (error) {
            console.error('Error fetching sessions:', error);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .eq('course_id', selectedCourse)
                .order('created_at', { ascending: false });
            if (!error) setAnnouncements(data || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch('/api/instructors/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...newResource, course_id: selectedCourse })
            });
            if (response.ok) {
                alert('Resource added successfully!');
                setNewResource({ title: '', description: '', resource_type: 'recording', resource_url: '', lesson_id: '' });
                fetchResources();
            } else {
                alert((await response.json()).error || 'Failed to add resource');
            }
        } catch (error) {
            alert('Failed to add resource');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSession = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch('/api/instructors/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...newSession, course_id: selectedCourse })
            });
            if (response.ok) {
                alert('Class session created successfully!');
                setNewSession({ title: '', description: '', session_date: '', duration_minutes: 60, meeting_link: '', status: 'scheduled' });
                fetchSessions();
            } else {
                alert((await response.json()).error || 'Failed to create session');
            }
        } catch (error) {
            alert('Failed to create session');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('announcements').insert({
                ...newAnnouncement, course_id: selectedCourse, target_audience: 'course', created_by: user.id
            });
            if (!error) {
                alert('Announcement created successfully!');
                setNewAnnouncement({ title: '', content: '', type: 'info' });
                fetchAnnouncements();
            } else {
                alert('Failed to create announcement');
            }
        } catch (error) {
            alert('Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    const deleteResource = async (id) => {
        if (!confirm('Delete this resource?')) return;
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`/api/instructors/resources/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    const deleteSession = async (id) => {
        if (!confirm('Delete this session?')) return;
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`/api/instructors/sessions/${id}`, {
                method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchSessions();
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    };

    if (courses.length === 0) {
        return (
            <>
                <Navigation />
                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="h-10 w-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Instructor Dashboard</h2>
                            <p className="text-lg text-gray-600 mb-2">You are not assigned to any courses yet.</p>
                            <p className="text-sm text-gray-500">Contact an administrator to get assigned to courses.</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
                        <p className="text-lg text-gray-600">Manage your courses, resources, and sessions</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Course</label>
                        <select
                            value={selectedCourse || ''}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all text-gray-900 font-medium"
                        >
                            {courses.map(c => (
                                <option key={c.course_id} value={c.course_id}>{c.course.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
                                    <div className="text-sm text-gray-600">Resources</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                                    <Video className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{sessions.length}</div>
                                    <div className="text-sm text-gray-600">Sessions</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white">
                                    <Bell className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
                                    <div className="text-sm text-gray-600">Announcements</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
                            {[
                                { id: 'resources', icon: FileText, label: 'Resources' },
                                { id: 'sessions', icon: Video, label: 'Class Sessions' },
                                { id: 'announcements', icon: Bell, label: 'Announcements' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-accent-600 text-accent-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'resources' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Plus className="h-6 w-6 text-accent-600" />
                                    Add New Resource
                                </h3>
                                <form onSubmit={handleAddResource} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title *</label>
                                        <input type="text" placeholder="e.g., Week 1 Lecture Recording" value={newResource.title}
                                            onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea placeholder="Brief description..." value={newResource.description}
                                            onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type *</label>
                                            <select value={newResource.resource_type}
                                                onChange={(e) => setNewResource({ ...newResource, resource_type: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all">
                                                <option value="recording">📹 Recording</option>
                                                <option value="presentation">📊 Presentation</option>
                                                <option value="document">📄 Document</option>
                                                <option value="link">🔗 Link</option>
                                                <option value="other">📦 Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson ID (Optional)</label>
                                            <input type="text" placeholder="e.g., lesson-1" value={newResource.lesson_id}
                                                onChange={(e) => setNewResource({ ...newResource, lesson_id: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Resource URL *</label>
                                        <input type="url" placeholder="https://..." value={newResource.resource_url}
                                            onChange={(e) => setNewResource({ ...newResource, resource_url: e.target.value })} required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl font-medium hover:from-accent-700 hover:to-accent-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        <Upload className="h-5 w-5" />
                                        {loading ? 'Adding...' : 'Add Resource'}
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">Existing Resources</h3>
                                {resources.length === 0 ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">No resources added yet</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {resources.map(resource => (
                                            <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">{resource.title}</h4>
                                                            <span className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                                                                {resource.resource_type}
                                                            </span>
                                                        </div>
                                                        {resource.description && <p className="text-gray-600 mb-3">{resource.description}</p>}
                                                        <a href={resource.resource_url} target="_blank" rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium">
                                                            <LinkIcon className="h-4 w-4" />
                                                            View Resource
                                                        </a>
                                                    </div>
                                                    <button onClick={() => deleteResource(resource.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete resource">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'sessions' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Plus className="h-6 w-6 text-accent-600" />
                                    Schedule New Session
                                </h3>
                                <form onSubmit={handleAddSession} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Title *</label>
                                        <input type="text" placeholder="e.g., Week 1 Live Class" value={newSession.title}
                                            onChange={(e) => setNewSession({ ...newSession, title: e.target.value })} required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea placeholder="Session details..." value={newSession.description}
                                            onChange={(e) => setNewSession({ ...newSession, description: e.target.value })} rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
                                            <input type="datetime-local" value={newSession.session_date}
                                                onChange={(e) => setNewSession({ ...newSession, session_date: e.target.value })} required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                                            <input type="number" placeholder="60" value={newSession.duration_minutes}
                                                onChange={(e) => setNewSession({ ...newSession, duration_minutes: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <select value={newSession.status}
                                                onChange={(e) => setNewSession({ ...newSession, status: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all">
                                                <option value="scheduled">📅 Scheduled</option>
                                                <option value="ongoing">🔴 Ongoing</option>
                                                <option value="completed">✅ Completed</option>
                                                <option value="cancelled">❌ Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
                                        <input type="url" placeholder="https://zoom.us/..." value={newSession.meeting_link}
                                            onChange={(e) => setNewSession({ ...newSession, meeting_link: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl font-medium hover:from-accent-700 hover:to-accent-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        {loading ? 'Creating...' : 'Create Session'}
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">Scheduled Sessions</h3>
                                {sessions.length === 0 ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                                        <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">No sessions scheduled yet</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {sessions.map(session => (
                                            <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">{session.title}</h4>
                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${session.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                                                session.status === 'ongoing' ? 'bg-red-100 text-red-700' :
                                                                    session.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {session.status}
                                                            </span>
                                                        </div>
                                                        {session.description && <p className="text-gray-600 mb-3">{session.description}</p>}
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(session.session_date).toLocaleString()}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {session.duration_minutes} minutes
                                                            </div>
                                                        </div>
                                                        {session.meeting_link && (
                                                            <a href={session.meeting_link} target="_blank" rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-medium">
                                                                <Video className="h-4 w-4" />
                                                                Join Meeting
                                                            </a>
                                                        )}
                                                    </div>
                                                    <button onClick={() => deleteSession(session.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete session">
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'announcements' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Plus className="h-6 w-6 text-accent-600" />
                                    Create Announcement
                                </h3>
                                <form onSubmit={handleAddAnnouncement} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                                        <input type="text" placeholder="e.g., Important Update" value={newAnnouncement.title}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                                        <textarea placeholder="Announcement message..." value={newAnnouncement.content}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} required rows="4"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                        <select value={newAnnouncement.type}
                                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all">
                                            <option value="info">ℹ️ Info</option>
                                            <option value="urgent">🚨 Urgent</option>
                                            <option value="success">✅ Success</option>
                                            <option value="general">📢 General</option>
                                        </select>
                                    </div>
                                    <button type="submit" disabled={loading}
                                        className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-xl font-medium hover:from-accent-700 hover:to-accent-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        {loading ? 'Creating...' : 'Create Announcement'}
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900">Recent Announcements</h3>
                                {announcements.length === 0 ? (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">No announcements yet</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {announcements.map(announcement => (
                                            <div key={announcement.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${announcement.type === 'urgent' ? 'bg-red-100' :
                                                        announcement.type === 'success' ? 'bg-green-100' :
                                                            announcement.type === 'info' ? 'bg-blue-100' :
                                                                'bg-gray-100'
                                                        }`}>
                                                        <Bell className={`h-5 w-5 ${announcement.type === 'urgent' ? 'text-red-600' :
                                                            announcement.type === 'success' ? 'text-green-600' :
                                                                announcement.type === 'info' ? 'text-blue-600' :
                                                                    'text-gray-600'
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-lg font-bold text-gray-900">{announcement.title}</h4>
                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${announcement.type === 'urgent' ? 'bg-red-100 text-red-700' :
                                                                announcement.type === 'success' ? 'bg-green-100 text-green-700' :
                                                                    announcement.type === 'info' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {announcement.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 mb-2">{announcement.content}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(announcement.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default InstructorDashboard;
