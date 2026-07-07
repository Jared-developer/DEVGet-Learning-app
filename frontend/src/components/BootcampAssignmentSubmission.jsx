import { useState } from 'react'
import { Github, Send, CheckCircle, AlertCircle, Users, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const BootcampAssignmentSubmission = ({ 
    weekNumber, 
    courseName, 
    onClose,
    assignmentTitle = `Week ${weekNumber} Final Assignment`
}) => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        studentName: user?.email ? user.email.split('@')[0] : '',
        email: user?.email || '',
        submissionType: 'individual',
        githubUrl: '',
        additionalNotes: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const validateForm = () => {
        const errors = []
        
        if (!formData.studentName.trim()) {
            errors.push('Student name is required')
        }
        
        if (!formData.email.trim()) {
            errors.push('Email is required')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push('Please enter a valid email address')
        }
        
        if (!formData.githubUrl.trim()) {
            errors.push('GitHub URL is required')
        } else {
            const githubPattern = /^https?:\/\/(www\.)?github\.com\/.+/i
            if (!githubPattern.test(formData.githubUrl)) {
                errors.push('Please provide a valid GitHub URL')
            }
        }
        
        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '))
            return
        }
        
        setSubmitting(true)

        try {
            // Submit directly to LMS backend
            const submissionData = {
                userId: user.id,
                studentName: formData.studentName,
                email: formData.email,
                weekNumber: weekNumber,
                assignmentTitle: assignmentTitle,
                courseName: courseName,
                submissionType: formData.submissionType,
                githubUrl: formData.githubUrl,
                additionalNotes: formData.additionalNotes
            }

            const response = await fetch('/api/assignments/bootcamp/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit assignment')
            }

            console.log('Bootcamp assignment submitted successfully:', result.submission)
            setSuccess(true)
            
            // Auto close after 3 seconds
            setTimeout(() => {
                if (onClose) onClose()
            }, 3000)
            
        } catch (err) {
            setError(err.message || 'Failed to submit assignment. Please try again.')
            console.error('Submission error:', err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-white p-4 sm:p-6 rounded-t-xl border-b border-gray-200">
                    <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6">
                        <div className="flex-1 pr-4">
                            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">AI Governance & Digital Safety Bootcamp 1.0</h2>
                            <p className="text-gray-600 text-xs sm:text-sm mt-1">{assignmentTitle} Submission</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1 sm:p-2 transition-colors text-xl sm:text-2xl leading-none flex-shrink-0"
                        >
                            ×
                        </button>
                    </div>
                    
                    {/* Partner Logos */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-4 sm:py-6 border-t border-gray-200">
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2 sm:mb-3">
                                <img 
                                    src="/images/Partiner-logos/Space_Shift_logo.png" 
                                    alt="Spaceshift Logo" 
                                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center hidden">
                                    <span className="text-gray-600 font-bold text-sm sm:text-lg">SS</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">Organized by</div>
                            <div className="text-gray-900 font-bold text-xs sm:text-sm">Spaceshift</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2 sm:mb-3">
                                <img 
                                    src="/images/logos/updatedLogo.jpg" 
                                    alt="Devget Learning Logo" 
                                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center hidden">
                                    <span className="text-white font-bold text-sm sm:text-lg">DG</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">In partnership with</div>
                            <div className="text-gray-900 font-bold text-xs sm:text-sm">Devget Learning</div>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center mb-2 sm:mb-3">
                                <img 
                                    src="/images/Partiner-logos/AI_&_STEM_Logo.jpeg" 
                                    alt="AI & STEM Hub Logo" 
                                    className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'flex'
                                    }}
                                />
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center hidden">
                                    <span className="text-gray-600 font-bold text-sm sm:text-lg">AI</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">& Partner</div>
                            <div className="text-gray-900 font-bold text-xs sm:text-sm">AI & STEM Hub</div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Student Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student Name *
                        </label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                    </div>

                    {/* Week Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Week Number
                        </label>
                        <input
                            type="text"
                            name="weekNumber"
                            value={`Week ${weekNumber}`}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Assignment Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            name="assignmentTitle"
                            value={assignmentTitle}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Submission Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Submission Type *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, submissionType: 'individual' }))}
                                className={`flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 border rounded-lg transition-all ${
                                    formData.submissionType === 'individual'
                                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <User className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="font-medium text-sm sm:text-base">Individual</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, submissionType: 'group' }))}
                                className={`flex items-center justify-center space-x-2 sm:space-x-3 p-3 sm:p-4 border rounded-lg transition-all ${
                                    formData.submissionType === 'group'
                                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="font-medium text-sm sm:text-base">Group</span>
                            </button>
                        </div>
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            GitHub Repository URL *
                        </label>
                        <div className="relative">
                            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                placeholder="https://github.com/username/repository"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Make sure your repository is public so instructors can review it
                        </p>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            placeholder="Any additional information about your submission..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                            <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium">Assignment submitted successfully!</p>
                                <p>Your submission has been recorded in the LMS and is ready for review.</p>
                                <p className="text-xs mt-1 text-green-600">This dialog will close automatically in 3 seconds.</p>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t">
                        <button
                            type="submit"
                            disabled={submitting || success}
                            className="flex-1 flex items-center justify-center space-x-2 bg-accent-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
                        >
                            <Send className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                            <span className="truncate">
                                {submitting ? 'Submitting...' : success ? 'Submitted!' : 'Submit Assignment'}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BootcampAssignmentSubmission