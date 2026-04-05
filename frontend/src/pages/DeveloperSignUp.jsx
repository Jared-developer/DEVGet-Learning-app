import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Terminal, CheckCircle } from 'lucide-react'

const DeveloperSignUp = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const { user, signUp } = useAuth()

    if (user) {
        return <Navigate to="/developer-console" />
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            setLoading(false)
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            setLoading(false)
            return
        }

        try {
            const { error } = await signUp(formData.email, formData.password, {
                full_name: formData.fullName,
                user_type: 'developer'
            }, 'developer')

            if (error) {
                if (error.message.includes('already registered')) {
                    setError('This email is already registered. Please sign in instead.')
                } else {
                    setError(error.message)
                }
            } else {
                setSuccess(true)
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900"></div>

                <div className="relative z-10 max-w-md w-full">
                    <div className="bg-white py-12 px-8 shadow-2xl rounded-3xl border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Check Your Email
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We've sent a verification link to <strong>{formData.email}</strong>.
                            Please check your inbox and click the link to verify your account.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-800">
                                After verifying your email, you can sign in to access the Developer Console.
                            </p>
                        </div>
                        <Link
                            to="/developer-signin"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 transition-all"
                        >
                            Go to Sign In
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900"></div>

            <div className="relative z-10 max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/" className="flex items-center justify-center mb-6">
                        <img
                            src="/images/logos/updatedLogo.jpg"
                            alt="DEVGet Learning"
                            className="h-36 md:h-44 w-auto"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        <div className="text-white text-4xl font-bold tracking-tight hidden">
                            DEVGet Learning
                        </div>
                    </Link>
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
                            <Terminal className="h-4 w-4" />
                            Developer Registration
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Create Developer Account
                    </h2>
                    <p className="text-base text-white/80">
                        Get access to API keys and developer tools
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-8 shadow-2xl rounded-3xl border border-gray-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg font-medium text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                                    )}
                                </button>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-900" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-700 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            Already have an account?{' '}
                            <Link to="/developer-signin" className="text-accent-600 hover:text-accent-700 font-semibold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="text-center space-y-3">
                    <Link to="/signin" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200 font-medium">
                        ← Student Portal Sign In
                    </Link>
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 text-sm">
                            Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeveloperSignUp
