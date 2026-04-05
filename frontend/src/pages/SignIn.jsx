import { useState, useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

const SignIn = () => {
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { user, signIn, signInWithGoogle } = useAuth()

    // Load remembered email on component mount
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        if (rememberedEmail) {
            setEmail(rememberedEmail)
            setRememberMe(true)
        }
    }, [])

    if (user) {
        return <Navigate to={redirectTo} />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { error } = await signIn(email, password, rememberMe)

            if (error) {
                if (error.message.includes('Network error')) {
                    setError('Unable to connect to authentication service. Please try again later.')
                } else if (error.message.includes('Email not confirmed')) {
                    setError('Please verify your email address before signing in. Check your inbox for the verification link.')
                } else {
                    setError(error.message)
                }
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setLoading(true)
        setError('')
        try {
            const { error } = await signInWithGoogle()
            if (error) {
                setError(error.message || 'Failed to sign in with Google. Please try again.')
            }
        } catch (err) {
            console.error('Google sign-in error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/backgrounds/ChatGPT Image Mar 30, 2026, 10_01_07 PM.png"
                    alt="Students learning"
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay using brand colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-900/95 via-accent-800/90 to-purple-900/85"></div>
            </div>

            <div className="relative z-10 max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link to="/" className="flex items-center justify-center mb-6">
                        <img
                            src="/images/logos/SignInLogo.png"
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            Welcome Back
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Sign In to Continue to Your Learning Portal
                    </h2>
                    <p className="text-base text-white/80">
                        Access your courses and continue learning
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white py-8 px-8 shadow-2xl rounded-3xl border border-gray-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-danger-50 border-l-4 border-danger-500 text-danger-700 px-4 py-3 rounded-lg font-medium text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-primary-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-primary-900 placeholder-primary-400"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-primary-900 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-primary-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-primary-900 placeholder-primary-400"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-primary-400 hover:text-primary-900" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-primary-400 hover:text-primary-900" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                Remember me
                            </label>
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
                                    Sign In
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Don't have an account? Contact your administrator.</p>
                    </div>
                </div>

                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-200 font-medium">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignIn