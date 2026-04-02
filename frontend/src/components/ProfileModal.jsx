import { useState, useEffect } from 'react'
import { X, Save, User, Mail, Phone, Target, Award, Camera, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ProfileModal = ({ isOpen, onClose, user, onSave }) => {
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        learningGoals: '',
        experienceLevel: 'beginner',
        bio: '',
        avatarUrl: ''
    })
    const [loading, setLoading] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)

    useEffect(() => {
        if (user && isOpen) {
            const avatarUrl = user?.user_metadata?.avatar_url || ''
            setProfileData({
                firstName: user?.user_metadata?.first_name || '',
                lastName: user?.user_metadata?.last_name || '',
                email: user?.email || '',
                phone: user?.user_metadata?.phone || '',
                learningGoals: user?.user_metadata?.learning_goals || '',
                experienceLevel: user?.user_metadata?.experience_level || 'beginner',
                bio: user?.user_metadata?.bio || '',
                avatarUrl: avatarUrl
            })
            setAvatarPreview(avatarUrl)
            // Reset states when modal opens
            setError('')
            setSuccess(false)
        }
    }, [user, isOpen])

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB')
            return
        }

        setUploadingAvatar(true)
        setError('')

        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profile-pictures')
                .getPublicUrl(filePath)

            // Update profile data
            setProfileData({ ...profileData, avatarUrl: publicUrl })
            setAvatarPreview(publicUrl)

            // Delete old avatar if exists
            if (profileData.avatarUrl && profileData.avatarUrl.includes('profile-pictures')) {
                const oldPath = profileData.avatarUrl.split('/profile-pictures/')[1]
                if (oldPath) {
                    await supabase.storage
                        .from('profile-pictures')
                        .remove([oldPath])
                }
            }
        } catch (err) {
            console.error('Error uploading avatar:', err)
            setError('Failed to upload image. Please try again.')
        } finally {
            setUploadingAvatar(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            await onSave(profileData)
            setSuccess(true)
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err) {
            setError(err.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <User className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">My Profile</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            Profile updated successfully!
                        </div>
                    )}

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4 pb-6 border-b">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{user?.email?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-accent-600 hover:bg-accent-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                                <Camera className="h-5 w-5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                    disabled={uploadingAvatar}
                                />
                            </label>
                        </div>
                        {uploadingAvatar && (
                            <p className="text-sm text-primary-600">Uploading...</p>
                        )}
                        <p className="text-xs text-gray-500 text-center">
                            Click the camera icon to upload a profile picture<br />
                            (Max 2MB, JPG, PNG, or GIF)
                        </p>
                    </div>

                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="h-5 w-5 mr-2 text-primary-600" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={profileData.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    {/* Learning Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-primary-600" />
                            Learning Information
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience Level
                            </label>
                            <select
                                value={profileData.experienceLevel}
                                onChange={(e) => setProfileData({ ...profileData, experienceLevel: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Target className="h-4 w-4 mr-2" />
                                Learning Goals
                            </label>
                            <textarea
                                value={profileData.learningGoals}
                                onChange={(e) => setProfileData({ ...profileData, learningGoals: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="What do you want to achieve?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileModal
