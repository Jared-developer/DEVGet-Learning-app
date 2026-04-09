import { useState, useEffect } from 'react'
import { FileText, Upload, Edit, Trash2, Plus, X, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const AdmissionsManager = () => {
    const { user } = useAuth()
    const [admissions, setAdmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAdmission, setEditingAdmission] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        file: null,
        imageFile: null
    })

    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        fetchAdmissions()
    }, [])

    const fetchAdmissions = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('admissions')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAdmissions(data || [])
        } catch (err) {
            console.error('Error fetching admissions:', err)
            showMessage('error', 'Failed to load admissions')
        } finally {
            setLoading(false)
        }
    }

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, file })
        }
    }

    const uploadFile = async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
            .from('admissions')
            .upload(filePath, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('admissions')
            .getPublicUrl(filePath)

        return { publicUrl, fileName: file.name, fileSize: file.size, fileType: file.type }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUploading(true)

        try {
            let fileData = null
            let imageUrl = editingAdmission?.image_url || null

            // Upload file if new file is selected
            if (formData.file) {
                fileData = await uploadFile(formData.file)
            }

            // Upload image if new image is selected
            if (formData.imageFile) {
                const fileExt = formData.imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `images/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('admissions')
                    .upload(filePath, formData.imageFile)

                if (uploadError) throw uploadError

                const { data } = supabase.storage
                    .from('admissions')
                    .getPublicUrl(filePath)

                imageUrl = data.publicUrl
            }

            const admissionData = {
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline || null,
                image_url: imageUrl,
                ...(fileData && {
                    file_url: fileData.publicUrl,
                    file_name: fileData.fileName,
                    file_size: fileData.fileSize,
                    file_type: fileData.fileType
                })
            }

            if (editingAdmission) {
                // Update existing admission
                const { error } = await supabase
                    .from('admissions')
                    .update(admissionData)
                    .eq('id', editingAdmission.id)

                if (error) throw error
                showMessage('success', 'Admission updated successfully')
            } else {
                // Create new admission
                if (!fileData) {
                    throw new Error('Please select a file to upload')
                }

                admissionData.created_by = user.id

                const { error } = await supabase
                    .from('admissions')
                    .insert([admissionData])

                if (error) throw error
                showMessage('success', 'Admission created successfully')
            }

            fetchAdmissions()
            closeModal()
        } catch (err) {
            console.error('Error saving admission:', err)
            showMessage('error', err.message || 'Failed to save admission')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this admission?')) return

        try {
            const { error } = await supabase
                .from('admissions')
                .delete()
                .eq('id', id)

            if (error) throw error
            showMessage('success', 'Admission deleted successfully')
            fetchAdmissions()
        } catch (err) {
            console.error('Error deleting admission:', err)
            showMessage('error', 'Failed to delete admission')
        }
    }

    const toggleActive = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('admissions')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            showMessage('success', `Admission ${!currentStatus ? 'activated' : 'deactivated'}`)
            fetchAdmissions()
        } catch (err) {
            console.error('Error toggling admission:', err)
            showMessage('error', 'Failed to update admission status')
        }
    }

    const openModal = (admission = null) => {
        if (admission) {
            setEditingAdmission(admission)
            setFormData({
                title: admission.title,
                description: admission.description || '',
                deadline: admission.deadline ? admission.deadline.split('T')[0] : '',
                file: null
            })
        } else {
            setEditingAdmission(null)
            setFormData({ title: '', description: '', deadline: '', file: null })
        }
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingAdmission(null)
        setFormData({ title: '', description: '', deadline: '', file: null, imageFile: null })
        setImagePreview(null)
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Admissions Manager</h2>
                    <p className="text-gray-600">Manage admission applications</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all"
                >
                    <Plus className="h-5 w-5" />
                    New Admission
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            {/* Admissions List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
                </div>
            ) : admissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No admissions yet. Create your first one!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {admissions.map((admission) => (
                        <div key={admission.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{admission.title}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${admission.is_active ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {admission.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    {admission.description && (
                                        <p className="text-sm text-gray-600 mb-2">{admission.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        {admission.deadline && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(admission.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                        <span>{admission.file_name}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(admission.id, admission.is_active)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                        title={admission.is_active ? 'Deactivate' : 'Activate'}
                                    >
                                        <CheckCircle className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => openModal(admission)}
                                        className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-all"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(admission.id)}
                                        className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingAdmission ? 'Edit Admission' : 'New Admission'}
                            </h3>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    placeholder="e.g., 2024 Scholarship Application"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                    placeholder="Brief description of the admission..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deadline
                                </label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cover Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            setFormData({ ...formData, imageFile: file })
                                            setImagePreview(URL.createObjectURL(file))
                                        }
                                    }}
                                    accept="image/*"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Recommended: 1200x600px, JPG/PNG (Max 5MB)
                                </p>
                                {(imagePreview || editingAdmission?.image_url) && (
                                    <img
                                        src={imagePreview || editingAdmission?.image_url}
                                        alt="Preview"
                                        className="mt-2 w-full h-32 object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Application File {!editingAdmission && '*'}
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    required={!editingAdmission}
                                    accept=".pdf,.doc,.docx"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Accepted formats: PDF, DOC, DOCX
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 transition-all"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5" />
                                            {editingAdmission ? 'Update' : 'Create'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdmissionsManager
