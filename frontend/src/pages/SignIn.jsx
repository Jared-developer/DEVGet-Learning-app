import { useState, useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, User, Phone } from 'lucide-react'

const SignIn = () => {
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'
    const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin'

    const [activeTab, setActiveTab] = useState(initialTab)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [signUpData, setSignUpData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        password: '', confirmPassword: '', experienceLevel: 'beginner'
    })
    const [showSignUpPassword, setShowSignUpPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const { user, signIn, signUp } = useAuth()

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail')
        if (rememberedEmail) {
            setEmail(rememberedEmail)
            setRememberMe(true)
        }
    }, [])

    useEffect(() => {
        setActiveTab(searchParams.get('tab') === 'signup' ? 'signup' : 'signin')
    }, [searchParams])

    if (user) return <Navigate to={redirectTo} />

    const switchTab = (tab) => {
        setActiveTab(tab)
        setError('')
        setSuccessMessage('')
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { error: signInError } = await signIn(email, password, rememberMe)
            if (signInError) {
                if (signInError.message.includes('Network error')) {
                    setError('Unable to connect. Please check your internet connection.')
                } else if (signInError.message.includes('Invalid login credentials')) {
                    setError('Incorrect email or password.')
                } else {
                    setError(signInError.message)
                }
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        if (signUpData.password !== signUpData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }
        if (signUpData.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }
        setLoading(true)
        try {
            const { error: signUpError } = await signUp(
                signUpData.email, signUpData.password,
                { firstName: signUpData.firstName, lastName: signUpData.lastName, phone: signUpData.phone, experienceLevel: signUpData.experienceLevel },
                'student'
            )
            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    setError('An account with this email already exists. Try signing in.')
                } else {
                    setError(signUpError.message)
                }
            } else {
                setSuccessMessage('Account created! Check your email for a verification link, then sign in.')
                setEmail(signUpData.email)
                switchTab('signin')
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccessMessage('')

        try {
            const { supabase } = await import('../lib/supabase')
            // Use production URL from env, fallback to current origin for local dev
            const appUrl = import.meta.env.VITE_APP_URL || window.location.origin

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                redirectTo: `${appUrl}/signin?reset=true`
            })

            if (resetError) {
                setError(resetError.message)
            } else {
                setSuccessMessage('Password reset link sent! Check your email inbox.')
                setResetEmail('')
                setTimeout(() => {
                    setShowForgotPassword(false)
                    setSuccessMessage('')
                }, 3000)
            }
        } catch {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
            {/* Centered Card Container */}
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row min-h-[600px]">
                    {/* Left Side - Logo and Welcome */}
                    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-accent-600 to-accent-700 p-12 items-center justify-center">
                        {/* Background Image */}
                        <div className="absolute inset-0 opacity-20">
                            <img
                                src="/images/backgrounds/ChatGPT Image Mar 30, 2026, 10_01_07 PM.png"
                                alt="Learning Background"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 max-w-lg text-white">
                            <Link to="/" className="inline-block mb-8 bg-white p-6 rounded-2xl shadow-lg">
                                <img
                                    src="/images/logos/updatedLogo.jpg"
                                    alt="DEVGet Learning"
                                    className="h-24 w-auto"
                                    onError={(e) => {
                                        e.target.style.display = 'none'
                                        e.target.nextSibling.style.display = 'block'
                                    }}
                                />
                                <div className="text-accent-600 text-3xl font-bold tracking-tight hidden">DEVGet Learning</div>
                            </Link>

                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                                    <Sparkles className="h-4 w-4" />
                                    {activeTab === 'signin' ? 'Welcome Back!' : 'Start Your Journey'}
                                </div>

                                <h1 className="text-4xl font-bold leading-tight">
                                    {activeTab === 'signin'
                                        ? 'Continue Your Learning Journey'
                                        : 'Join DEVGet Learning Today'}
                                </h1>

                                <p className="text-lg text-white/90">
                                    {activeTab === 'signin'
                                        ? 'Sign in to access your courses, track your progress, and continue building your skills.'
                                        : 'Create your free account and start learning with world-class courses. No credit card required.'}
                                </p>

                                <div className="pt-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-white/90">100% Free - Forever</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-white/90">8+ Courses Available</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-white/90">1000+ Active Learners</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Sign In/Sign Up Forms */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
                        <div className="w-full max-w-md">
                            {/* Mobile Logo - Only visible on small screens */}
                            <div className="lg:hidden text-center mb-8">
                                <Link to="/" className="inline-block bg-gray-50 p-4 rounded-xl">
                                    <img
                                        src="/images/logos/updatedLogo.jpg"
                                        alt="DEVGet Learning"
                                        className="h-20 w-auto mx-auto"
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                            e.target.nextSibling.style.display = 'block'
                                        }}
                                    />
                                    <div className="text-accent-600 text-2xl font-bold hidden">DEVGet</div>
                                </Link>
                            </div>

                            {/* Heading above form */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {activeTab === 'signin' ? 'Sign In to Your Account' : 'Create Your Account'}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {activeTab === 'signin' ? 'Welcome back! Enter your credentials' : 'Get started with your free account'}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                                <div className="flex border-b border-gray-200">
                                    <button onClick={() => switchTab('signin')}
                                        className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${activeTab === 'signin' ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50' : 'text-gray-500 hover:text-gray-700'}`}>
                                        Sign In
                                    </button>
                                    <button onClick={() => switchTab('signup')}
                                        className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${activeTab === 'signup' ? 'text-accent-600 border-b-2 border-accent-600 bg-accent-50' : 'text-gray-500 hover:text-gray-700'}`}>
                                        Sign Up
                                    </button>
                                </div>

                                <div className="py-8 px-8">
                                    {successMessage && (
                                        <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">{successMessage}</div>
                                    )}
                                    {error && (
                                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">{error}</div>
                                    )}

                                    {activeTab === 'signin' && (
                                        <form className="space-y-5" onSubmit={handleSignIn}>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                                                    <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="Enter your email" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                                    <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                                                        className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="Enter your password" />
                                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                                                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <input id="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded cursor-pointer" />
                                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">Remember me</label>
                                                </div>
                                                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                                                    Forgot password?
                                                </button>
                                            </div>

                                            <div className="flex justify-center">
                                                <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 py-2.5 px-6 border-2 border-accent-600 rounded-xl text-base font-semibold text-accent-600 bg-transparent hover:bg-accent-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent-600"></div> : <><span>Sign In</span><ArrowRight className="h-5 w-5" /></>}
                                                </button>
                                            </div>

                                            <p className="text-center text-sm text-gray-500 mt-4">
                                                New here?{' '}
                                                <button type="button" onClick={() => switchTab('signup')} className="text-accent-600 hover:text-accent-700 font-semibold">Create a free account</button>
                                            </p>
                                        </form>
                                    )}

                                    {activeTab === 'signup' && (
                                        <form className="space-y-4" onSubmit={handleSignUp}>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-4 w-4 text-gray-400" /></div>
                                                        <input id="firstName" type="text" required value={signUpData.firstName} onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                                                            className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="First name" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                                                    <input id="lastName" type="text" required value={signUpData.lastName} onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                                                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="Last name" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="su-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                                                    <input id="su-email" type="email" required value={signUpData.email} onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="Your email address" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                                                    <input id="phone" type="tel" value={signUpData.phone} onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                                                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="e.g. +265 999 000 000" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="su-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                                    <input id="su-password" type={showSignUpPassword ? 'text' : 'password'} required value={signUpData.password} onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                                        className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="Min. 6 characters" />
                                                    <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowSignUpPassword(!showSignUpPassword)} aria-label="Toggle password">
                                                        {showSignUpPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                                                    <input id="confirmPassword" type="password" required value={signUpData.confirmPassword} onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                                                        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" placeholder="Repeat your password" />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">Experience level</label>
                                                <select id="experienceLevel" value={signUpData.experienceLevel} onChange={(e) => setSignUpData({ ...signUpData, experienceLevel: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm bg-white">
                                                    <option value="beginner">Beginner — just starting out</option>
                                                    <option value="intermediate">Intermediate — some experience</option>
                                                    <option value="advanced">Advanced — comfortable with code</option>
                                                </select>
                                            </div>

                                            <div className="flex justify-center pt-1">
                                                <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 py-2.5 px-8 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                                    {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><span>Create Account</span><ArrowRight className="h-5 w-5" /></>}
                                                </button>
                                            </div>

                                            <p className="text-center text-sm text-gray-500 mt-4">
                                                Already have an account?{' '}
                                                <button type="button" onClick={() => switchTab('signin')} className="text-accent-600 hover:text-accent-700 font-semibold">Sign in</button>
                                            </p>
                                        </form>
                                    )}
                                </div>

                                <div className="text-center mt-6">
                                    <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-accent-600 transition-colors font-medium text-sm">
                                        ← Back to home
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-8 relative">
                            <button
                                onClick={() => {
                                    setShowForgotPassword(false)
                                    setError('')
                                    setSuccessMessage('')
                                    setResetEmail('')
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Close"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-100 rounded-full mb-4">
                                    <Lock className="h-6 w-6 text-accent-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h3>
                                <p className="text-gray-600 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                            </div>

                            {successMessage && (
                                <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="reset-email"
                                            type="email"
                                            required
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPassword(false)
                                            setError('')
                                            setSuccessMessage('')
                                            setResetEmail('')
                                        }}
                                        className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 inline-flex justify-center items-center gap-2 py-2.5 px-4 bg-accent-600 hover:bg-accent-700 text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>Send Reset Link<ArrowRight className="h-4 w-4" /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SignIn
