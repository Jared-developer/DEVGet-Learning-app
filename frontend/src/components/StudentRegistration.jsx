import { useState } from 'react'
import { UserPlus, Mail, Lock, User, Phone, Calendar, AlertCircle, CheckCircle, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const StudentRegistration = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [registeredStudent, setRegisteredStudent] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        dateOfBirth: '',
        sendEmail: true
    })

    const showMessage = (type, text) => {
        setMessage({ type, text })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    }

    const generatePassword = () => {
        const length = 12
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        let password = ''
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length))
        }
        setFormData({ ...formData, password })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Validate form
            if (!formData.email || !formData.password || !formData.fullName) {
                throw new Error('Please fill in all required fields')
            }

            // Create user account via backend API
            const response = await fetch(`${API_BASE_URL}/api/admin/register-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth,
                    sendEmail: formData.sendEmail
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to register student')
            }

            // Store credentials for display
            setRegisteredStudent({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                needsVerification: formData.sendEmail
            })

            showMessage('success', `Student registered successfully! ${formData.sendEmail ? 'Verification email sent.' : 'Account is ready to use.'}`)

            // Don't reset form immediately - show credentials first

        } catch (err) {
            console.error('Error registering student:', err)
            showMessage('error', err.message || 'Failed to register student')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleNewRegistration = () => {
        setRegisteredStudent(null)
        setFormData({
            email: '',
            password: '',
            fullName: '',
            phone: '',
            dateOfBirth: '',
            sendEmail: true
        })
        setMessage({ type: '', text: '' })
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        showMessage('success', 'Copied to clipboard!')
    }

    // Show success screen with credentials
    if (registeredStudent) {
        return (
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <div className="bg-success-50 border-2 border-success-500 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-success-600 flex-shrink-0" />
                        <h2 className="text-lg sm:text-2xl font-bold text-success-900">Student Registered Successfully!</h2>
                    </div>

                    <div className="bg-white rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <input
                                    type="text"
                                    value={registeredStudent.fullName}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base"
                                />
                                <button
                                    onClick={() => copyToClipboard(registeredStudent.fullName)}
                                    className="w-full sm:w-auto px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <input
                                    type="text"
                                    value={registeredStudent.email}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base break-all"
                                />
                                <button
                                    onClick={() => copyToClipboard(registeredStudent.email)}
                                    className="w-full sm:w-auto px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <input
                                    type="text"
                                    value={registeredStudent.password}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-yellow-50 border-2 border-yellow-400 rounded-lg font-mono text-sm sm:text-base break-all"
                                />
                                <button
                                    onClick={() => copyToClipboard(registeredStudent.password)}
                                    className="w-full sm:w-auto px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-sm font-medium"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mt-4">
                            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Next Steps:</h3>
                            <ol className="text-xs sm:text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                {registeredStudent.needsVerification ? (
                                    <>
                                        <li>Student will receive a verification email at {registeredStudent.email}</li>
                                        <li>Share the password above with the student securely</li>
                                        <li>Student must verify email before logging in</li>
                                        <li>After verification, student can log in with email and password</li>
                                    </>
                                ) : (
                                    <>
                                        <li>Account is immediately active (no email verification needed)</li>
                                        <li>Share the email and password above with the student securely</li>
                                        <li>Student can log in immediately</li>
                                        <li>Recommend student changes password after first login</li>
                                    </>
                                )}
                            </ol>
                        </div>
                    </div>

                    <button
                        onClick={handleNewRegistration}
                        className="mt-4 sm:mt-6 w-full px-4 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all font-medium"
                    >
                        Register Another Student
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 text-accent-600" />
                    Register New Student
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1">Create a new student account (Admin Only)</p>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-base"
                        placeholder="John Doe"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-base"
                        placeholder="student@example.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Lock className="h-4 w-4 inline mr-1" />
                        Password *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-base"
                            placeholder="Enter password"
                        />
                        <button
                            type="button"
                            onClick={generatePassword}
                            className="w-full sm:w-auto px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium whitespace-nowrap"
                        >
                            Generate Password
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Minimum 6 characters. Click Generate for a secure password.
                    </p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-base"
                        placeholder="+1234567890"
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent text-base"
                    />
                </div>

                {/* Send Email Checkbox */}
                <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <input
                        type="checkbox"
                        name="sendEmail"
                        id="sendEmail"
                        checked={formData.sendEmail}
                        onChange={handleChange}
                        className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sendEmail" className="text-sm text-gray-700">
                        <span className="font-medium">Send verification email to student</span>
                        <p className="text-xs text-gray-600 mt-1">
                            ⚠️ If checked: Student must verify email before logging in. If unchecked: Account works immediately.
                        </p>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 disabled:opacity-50 transition-all font-medium"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Registering...
                        </>
                    ) : (
                        <>
                            <UserPlus className="h-5 w-5" />
                            Register Student
                        </>
                    )}
                </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Important Notes:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Students will be created with 'student' role automatically</li>
                    <li><strong>Recommended:</strong> Uncheck "Send verification email" for immediate access</li>
                    <li>If verification email is sent, students must verify before logging in</li>
                    <li>If verification email is not sent, account is immediately active</li>
                    <li>Share the password securely with the student (shown after registration)</li>
                    <li>Students can change their password after first login</li>
                </ul>
            </div>
        </div>
    )
}

export default StudentRegistration
