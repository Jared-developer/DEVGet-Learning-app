import { useState, useEffect } from 'react'
import { X, Bell, Calendar, AlertCircle, Info, CheckCircle, Plus, Edit2, Trash2, Save } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const AnnouncementsModal = ({ onClose }) => {
    const { user } = useAuth()
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'info',
        is_active: true
    })
    const [submitting, setSubmitting] = useState(false)

    const isAdmin = user?.user_metadata?.role === 'admin'

    useEffect(() => {
        loadAnnouncements()
    }, [])

    const loadAnnouncements = async () => {
        try {
            // Admins can see all announcements, users only see active ones
            let query = supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false })

            if (!isAdmin) {
                query = query.eq('is_active', true)
            }

            const { data, error } = await query

            if (error) throw error
            setAnnouncements(data || [])
        } catch (error) {
            console.error('Error loading announcements:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case 'urgent':
                return <AlertCircle className="h-5 w-5 text-red-500" />
            case 'info':
                return <Info className="h-5 w-5 text-blue-500" />
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            default:
                return <Bell className="h-5 w-5 text-gray-500" />
        }
    }

    const getTypeStyles = (type) => {
        switch (type) {
            case 'urgent':
                return 'bg-red-50 border-red-200'
            case 'info':
                return 'bg-blue-50 border-blue-200'
            case 'success':
                return 'bg-green-50 border-green-200'
            default:
                return 'bg-gray-50 border-gray-200'
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleCreateNew = () => {
        setFormData({
            title: '',
            content: '',
            type: 'info',
            is_active: true
        })
        setEditingId(null)
        setShowCreateForm(true)
    }

    const handleEdit = (announcement) => {
        setFormData({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            is_active: announcement.is_active
        })
        setEditingId(announcement.id)
        setShowCreateForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            if (editingId) {
                // Update existing announcement
                const { error } = await supabase
                    .from('announcements')
                    .update({
                        title: formData.title,
                        content: formData.content,
                        type: formData.type,
                        is_active: formData.is_active,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingId)

                if (error) throw error
                alert('Announcement updated successfully!')
            } else {
                // Create new announcement
                const { error } = await supabase
                    .from('announcements')
                    .insert([{
                        title: formData.title,
                        content: formData.content,
                        type: formData.type,
                        is_active: formData.is_active,
                        created_by: user.id
                    }])

                if (error) throw error
                alert('Announcement created successfully!')
            }

            setShowCreateForm(false)
            setEditingId(null)
            await loadAnnouncements()
        } catch (error) {
            console.error('Error saving announcement:', error)
            alert('Failed to save announcement: ' + error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return

        try {
            const { error } = await supabase
                .from('announcements')
                .delete()
                .eq('id', id)

            if (error) throw error
            alert('Announcement deleted successfully!')
            await loadAnnouncements()
        } catch (error) {
            console.error('Error deleting announcement:', error)
            alert('Failed to delete announcement: ' + error.message)
        }
    }

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('announcements')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            await loadAnnouncements()
        } catch (error) {
            console.error('Error toggling announcement status:', error)
            alert('Failed to update status: ' + error.message)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl flex items-center justify-center">
                            <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                            <p className="text-sm text-gray-600">Stay updated with latest news</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Admin Create Button */}
                    {isAdmin && !showCreateForm && (
                        <button
                            onClick={handleCreateNew}
                            className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 text-white rounded-xl font-medium hover:bg-accent-700 transition-all"
                        >
                            <Plus className="h-5 w-5" />
                            Create New Announcement
                        </button>
                    )}

                    {/* Create/Edit Form */}
                    {showCreateForm && isAdmin && (
                        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editingId ? 'Edit Announcement' : 'Create New Announcement'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Content
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                                    >
                                        <option value="info">Info</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="success">Success</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 text-accent-600 border-gray-300 rounded focus:ring-accent-600"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                        Active (visible to users)
                                    </label>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateForm(false)
                                            setEditingId(null)
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-all"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        <Save className="h-4 w-4" />
                                        {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
                        </div>
                    ) : announcements.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Announcements</h3>
                            <p className="text-gray-600">
                                {isAdmin ? 'Create your first announcement' : 'Check back later for updates'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {announcements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={`p-4 rounded-xl border-2 ${getTypeStyles(announcement.type)} ${!announcement.is_active ? 'opacity-60' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {getTypeIcon(announcement.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-bold text-gray-900">
                                                    {announcement.title}
                                                    {!announcement.is_active && (
                                                        <span className="ml-2 text-xs bg-gray-500 text-white px-2 py-0.5 rounded">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </h3>
                                                {isAdmin && (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleEdit(announcement)}
                                                            className="p-1.5 hover:bg-white/50 rounded transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="h-4 w-4 text-gray-600" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleActive(announcement.id, announcement.is_active)}
                                                            className="p-1.5 hover:bg-white/50 rounded transition-all"
                                                            title={announcement.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            <CheckCircle className={`h-4 w-4 ${announcement.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(announcement.id)}
                                                            className="p-1.5 hover:bg-white/50 rounded transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                                                {announcement.content}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(announcement.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AnnouncementsModal
