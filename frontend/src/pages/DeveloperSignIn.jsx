import { useState, useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Terminal, Code } from 'lucide-react'

const DeveloperSignIn = () => {
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/developer-console'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { user, signIn } = useAuth()

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
                            Developer Access
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Sign In to Developer Console
                    </h2>
                    <p className="text-base text-white/80">
                        Access API keys, documentation, and developer tools
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your password"
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
                        </div>

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
                                    <Code className="h-5 w-5" />
                                    Access Developer Console
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/developer-signup" className="text-accent-600 hover:text-accent-700 font-semibold">
                                Create Developer Account
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

export default DeveloperSignIn
