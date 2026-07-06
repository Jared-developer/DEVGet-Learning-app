import { Link } from 'react-router-dom'
import { BookOpen, Code, Users, Globe, Heart, Award, Menu, X, ChevronDown, FileText, Newspaper, Zap, GraduationCap, Rocket, Palette, Cpu, Database, Layers, Bot, Sparkles, ArrowRight, CheckCircle, Star, TrendingUp, Target, Clock, Video, MessageCircle, Shield } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'

const LandingPage = () => {
    const { user } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false)

    const features = [
        {
            icon: <Code className="h-6 w-6" />,
            title: "Expert-Led Curriculum",
            description: "Learn from industry professionals with real-world experience in tech and AI"
        },
        {
            icon: <Video className="h-6 w-6" />,
            title: "Interactive Content",
            description: "Videos, live sessions, hands-on projects, and real-time coding exercises"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Vibrant Community",
            description: "Connect with thousands of learners, mentors, and professionals across Africa"
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Industry Certificates",
            description: "Earn recognized certifications to boost your career prospects"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Learn at Your Pace",
            description: "Flexible, self-paced learning that fits your schedule and lifestyle"
        },
        {
            icon: <MessageCircle className="h-6 w-6" />,
            title: "24/7 AI Assistant",
            description: "Get instant help and answers with our intelligent learning assistant"
        }
    ]

    const courses = [
        {
            category: "Foundation",
            icon: <BookOpen className="h-6 w-6" />,
            gradient: "from-accent-400 to-accent-600",
            description: "Start your tech journey with essential programming skills",
            items: [
                { icon: <Globe className="h-4 w-4" />, name: "HTML & Web Fundamentals", level: "Beginner" },
                { icon: <Palette className="h-4 w-4" />, name: "CSS & Modern Design", level: "Beginner" },
                { icon: <Code className="h-4 w-4" />, name: "JavaScript Essentials", level: "Beginner" },
                { icon: <Cpu className="h-4 w-4" />, name: "Python Programming", level: "Beginner" },
                { icon: <Database className="h-4 w-4" />, name: "Database Fundamentals", level: "Beginner" }
            ]
        },
        {
            category: "Professional",
            icon: <Rocket className="h-6 w-6" />,
            gradient: "from-primary-500 to-primary-700",
            description: "Advanced skills for building production-ready applications",
            items: [
                { icon: <Layers className="h-4 w-4" />, name: "MERN Stack Development", level: "Advanced" },
                { icon: <Bot className="h-4 w-4" />, name: "AI & Machine Learning", level: "Advanced" },
                { icon: <Sparkles className="h-4 w-4" />, name: "Agentic AI Systems", level: "Advanced" }
            ]
        }
    ]

    const testimonials = [
        {
            name: "Sarah M.",
            role: "Full Stack Developer",
            image: "👩‍💻",
            quote: "DEVGet transformed my career. From zero coding knowledge to landing my first developer job in 8 months!"
        },
        {
            name: "James K.",
            role: "AI Engineer",
            image: "👨‍💻",
            quote: "The AI courses are world-class and completely free. I'm now building ML models for my startup."
        },
        {
            name: "Grace N.",
            role: "Software Engineer",
            image: "👩‍💼",
            quote: "The community support is incredible. I always get help when I'm stuck, and I've made lifelong connections."
        }
    ]

    const stats = [
        { number: "100%", label: "Fully Sponsored", icon: <Heart className="h-6 w-6" /> },
        { number: "8+", label: "Courses", icon: <BookOpen className="h-6 w-6" /> },
        { number: "1000+", label: "Active Learners", icon: <Users className="h-6 w-6" /> },
        { number: "24/7", label: "Learning Support", icon: <Clock className="h-6 w-6" /> }
    ]

    const benefits = [
        { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "No credit card required" },
        { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "Start learning immediately" },
        { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "Access all courses for free" },
        { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "Lifetime access to materials" },
        { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "Join vibrant community" },
        { icon: <CheckCircle className="h-5 w-5 text-green-600" />, text: "Earn industry certificates" }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation - White Background */}
            <nav className="relative z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center justify-start flex-shrink-0 -my-10 md:-my-12">
                            <img
                                src="/images/logos/updatedLogo.jpg"
                                alt="DEVGet Learning"
                                className="h-32 md:h-40 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span className="text-white text-xl font-bold ml-2 hidden">DEVGet</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-gray-900 font-semibold hover:text-accent-600 transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="text-gray-700 hover:text-accent-600 transition-colors">
                                About
                            </Link>

                            {/* Resources Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                                    onMouseEnter={() => setResourcesDropdownOpen(true)}
                                    className="flex items-center gap-1 text-gray-700 hover:text-accent-600 transition-colors"
                                >
                                    Resources
                                    <ChevronDown className={`h-4 w-4 transition-transform ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {resourcesDropdownOpen && (
                                    <div
                                        onMouseLeave={() => setResourcesDropdownOpen(false)}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                                    >
                                        <Link
                                            to="/resources"
                                            onClick={() => setResourcesDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <FileText className="h-4 w-4 text-accent-600" />
                                            <span className="text-sm text-gray-700">Documentation</span>
                                        </Link>
                                        <Link
                                            to="/resources"
                                            onClick={() => setResourcesDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <BookOpen className="h-4 w-4 text-accent-600" />
                                            <span className="text-sm text-gray-700">Tutorials</span>
                                        </Link>
                                        <Link
                                            to="/resources"
                                            onClick={() => setResourcesDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <Newspaper className="h-4 w-4 text-accent-600" />
                                            <span className="text-sm text-gray-700">Articles</span>
                                        </Link>
                                        <Link
                                            to="/resources"
                                            onClick={() => setResourcesDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <Zap className="h-4 w-4 text-accent-600" />
                                            <span className="text-sm text-gray-700">Tools</span>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link to="/contact" className="text-gray-700 hover:text-accent-600 transition-colors">
                                Contact
                            </Link>
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            <a
                                href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%20with%20a%20donation.%20How%20can%20I%20help%3F"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-1 text-gray-700 hover:text-accent-600 transition-colors"
                            >
                                <Heart className="h-3 w-3" />
                                <span className="text-xs font-medium">Donate</span>
                            </a>
                            {!user ? (
                                <>
                                    <Link
                                        to="/signin"
                                        className="px-3 py-1 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded text-xs font-medium transition-all"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signin?tab=signup"
                                        className="px-3 py-1 bg-accent-600 hover:bg-accent-700 text-white rounded text-xs font-semibold transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    className="px-3 py-1 bg-accent-600 hover:bg-accent-700 text-white rounded text-xs font-semibold transition-all"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>

                        {/* Mobile CTA and Menu Button */}
                        <div className="flex md:hidden items-center gap-4">
                            {!user ? (
                                <Link
                                    to="/signin"
                                    className="text-gray-700 hover:text-accent-600 text-sm font-medium transition-colors whitespace-nowrap flex items-center"
                                >
                                    Sign In
                                </Link>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    className="text-accent-600 hover:text-accent-700 text-sm font-semibold transition-colors whitespace-nowrap flex items-center"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <div className="w-px h-6 bg-gray-300"></div>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 -mr-2 flex items-center justify-center"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200 bg-white">
                            <div className="flex flex-col space-y-3">
                                <Link to="/" className="px-4 py-2 text-gray-900 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                                    Home
                                </Link>
                                <Link to="/about" className="px-4 py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                    About
                                </Link>
                                <Link to="/resources" className="px-4 py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                    Resources
                                </Link>
                                <Link to="/contact" className="px-4 py-2 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                    Contact
                                </Link>
                                <div className="px-4 pt-3 border-t border-gray-200 space-y-2">
                                    <a
                                        href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%20with%20a%20donation.%20How%20can%20I%20help%3F"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                                    >
                                        <Heart className="h-4 w-4" />
                                        Donate
                                    </a>
                                    {!user ? (
                                        <>
                                            <Link
                                                to="/signin"
                                                className="block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign In
                                            </Link>
                                            <Link
                                                to="/signin?tab=signup"
                                                className="block text-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg font-semibold"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            to="/dashboard"
                                            className="block text-center px-4 py-2 bg-accent-600 text-white rounded-lg font-semibold"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section - Bold New Design - Mobile Optimized */}
            <section className="relative bg-white pt-20 sm:pt-28 pb-16 sm:pb-24 overflow-hidden">
                {/* CSS Animations */}
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes fadeInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }
                    
                    .animate-fadeInUp {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    
                    .animate-fadeInDown {
                        animation: fadeInDown 0.6s ease-out forwards;
                    }
                    
                    .animate-slideInLeft {
                        animation: slideInLeft 0.8s ease-out forwards;
                    }
                    
                    .animate-pulse-slow {
                        animation: pulse 3s ease-in-out infinite;
                    }
                `}</style>

                {/* Background Image - Full Coverage */}
                <div className="absolute inset-0">
                    <img
                        src="/images/backgrounds/ChatGPT Image Mar 30, 2026, 10_01_07 PM.png"
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content - With Teal Background */}
                        <div className="bg-gradient-to-br from-accent-600/70 to-accent-700/70 backdrop-blur-sm p-6 sm:p-8 lg:p-10 text-white text-center lg:text-left shadow-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-semibold mb-4 sm:mb-6 animate-fadeInDown opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                                Trusted by 1000+ African Learners
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight animate-fadeInUp opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                                Your Gateway to
                                <span className="block text-yellow-300 mt-1 sm:mt-2 animate-pulse-slow">Tech Excellence</span>
                            </h1>

                            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fadeInUp opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                                Master in-demand tech skills with world-class courses. No cost and Fully sponsored.
                            </p>

                            {/* Benefits List - Hidden on smallest screens, shown on sm+ */}
                            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-10 max-w-xl mx-auto lg:mx-0 animate-slideInLeft opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-2 text-white/90 text-sm">
                                        {benefit.icon}
                                        <span className="font-medium">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:max-w-md mx-auto lg:mx-0 animate-fadeInUp opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                                {!user ? (
                                    <Link
                                        to="/signin?tab=signup"
                                        className="inline-flex items-center justify-center px-0 sm:px-8 py-3 sm:py-4 text-white sm:bg-white sm:text-accent-600 sm:rounded-xl text-base sm:text-lg font-bold transition-all sm:shadow-xl sm:hover:shadow-2xl hover:scale-105 w-full sm:w-auto"
                                    >
                                        <span className="inline-flex items-center gap-2 border-b-2 border-yellow-300">
                                            <GraduationCap className="h-5 w-5" />
                                            Get Started
                                        </span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex items-center justify-center gap-2 px-0 sm:px-8 py-3 sm:py-4 text-white sm:bg-white sm:text-accent-600 sm:rounded-xl text-base sm:text-lg font-bold transition-all sm:shadow-xl sm:hover:shadow-2xl hover:scale-105 w-full sm:w-auto"
                                    >
                                        <GraduationCap className="h-5 w-5" />
                                        Continue Learning
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Right Content - Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mt-8 lg:mt-0">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all">
                                    <div className="text-white/80 mb-1 sm:mb-2">{stat.icon}</div>
                                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">{stat.number}</div>
                                    <div className="text-white/80 font-medium text-xs sm:text-sm lg:text-base">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges - Mobile Optimized */}
            <section className="py-8 sm:py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <p className="text-sm sm:text-base text-gray-600 font-medium px-4">Empowering Africa's next generation of tech leaders</p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8">
                        <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            <span className="font-semibold">Award Winning</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                            <span className="font-semibold">Trusted Platform</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-accent-600 flex-shrink-0" />
                            <span className="font-semibold">1000+ Students</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                            <span className="font-semibold">Growing Community</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Mobile Optimized */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-accent-100 rounded-full text-accent-700 text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            Platform Features
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                            Everything You Need to Succeed
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            A comprehensive learning platform designed to take you from beginner to professional
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group relative bg-white p-6 sm:p-8 rounded-2xl border-2 border-gray-200 hover:border-accent-300 hover:shadow-2xl transition-all duration-300 text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section - Mobile Optimized */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 via-primary-50 to-accent-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-accent-100 rounded-full text-accent-700 text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                            <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                            Simple Process
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                            Your Learning Journey in 4 Steps
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            From sign-up to career-ready in a simple, straightforward process
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {/* Step 1 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-accent-100 hover:border-accent-300 hover:shadow-2xl transition-all duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-left-4 w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    1
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center text-accent-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Sign Up Free</h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Create your account in seconds. No credit card, no commitments.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-accent-100 hover:border-accent-300 hover:shadow-2xl transition-all duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-left-4 w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    2
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center text-accent-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Choose Your Path</h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Select courses that match your goals and skill level.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-accent-100 hover:border-accent-300 hover:shadow-2xl transition-all duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-left-4 w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    3
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center text-accent-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <Video className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Learn & Practice</h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Watch videos, complete projects, get help from AI assistant.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative group">
                            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-accent-100 hover:border-accent-300 hover:shadow-2xl transition-all duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-left-4 w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    4
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-2xl flex items-center justify-center text-accent-600 mb-6 mx-auto group-hover:scale-110 transition-transform">
                                    <Award className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Earn & Succeed</h3>
                                <p className="text-gray-600 text-center leading-relaxed">
                                    Get certified and launch your tech career with confidence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section - Enhanced */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-700 text-sm font-bold mb-4">
                            <BookOpen className="h-4 w-4" />
                            Course Catalog
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Structured Learning Paths
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From absolute beginner to industry professional - we've got you covered
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {courses.map((course, index) => (
                            <div key={index} className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all">
                                <div className={`bg-gradient-to-br ${course.gradient} p-8 text-white`}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            {course.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-bold">{course.category}</h3>
                                            <p className="text-white/90 text-sm">{course.items.length} courses</p>
                                        </div>
                                    </div>
                                    <p className="text-white/90 text-lg">{course.description}</p>
                                </div>

                                <div className="p-8 space-y-4">
                                    {course.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="text-accent-600 group-hover:scale-110 transition-transform">
                                                    {item.icon}
                                                </div>
                                                <span className="text-gray-900 font-semibold">{item.name}</span>
                                            </div>
                                            <span className="text-xs font-bold px-3 py-1 bg-accent-100 text-accent-700 rounded-full">
                                                {item.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-yellow-700 text-sm font-bold mb-4">
                            <Star className="h-4 w-4 fill-yellow-700" />
                            Success Stories
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Hear From Our Community
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Real stories from students who transformed their careers with DEVGet Learning
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-accent-200 hover:shadow-xl transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="text-5xl">{testimonial.image}</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-accent-600 font-semibold">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-100 rounded-full text-primary-700 text-xs sm:text-sm font-bold mb-3 sm:mb-4">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            Our Partners
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
                            Trusted by Leading Organizations
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            We collaborate with innovative organizations to bring you world-class education and opportunities
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-center justify-items-center">
                        {/* AI & STEM Logo */}
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full max-w-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-6 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                                    <img
                                        src="/images/Partiner-logos/AI_&_STEM_Logo.jpeg"
                                        alt="AI & STEM"
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">AI & STEM HUB</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Advancing artificial intelligence and STEM education across Africa
                                </p>
                            </div>
                        </div>

                        {/* Space Shift Logo */}
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full max-w-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-6 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                                    <img
                                        src="/images/Partiner-logos/Space_Shift_logo.png"
                                        alt="Space Shift"
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Space Shift</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Transforming the digital landscape through innovative technology solutions
                                </p>
                            </div>
                        </div>

                        {/* Women in STEM Logo */}
                        <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full max-w-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-6 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                                    <img
                                        src="/images/Partiner-logos/Women_IN_STEM_LOGO.jpeg"
                                        alt="Women in STEM"
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Women in STEM</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Empowering women to excel in science, technology, engineering, and mathematics
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Partnership Benefits */}
                    <div className="mt-16 bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-200">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                Partnership Impact
                            </h3>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Through our strategic partnerships, we're able to provide enhanced learning experiences and real-world opportunities
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Target className="h-8 w-8 text-accent-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Focused Learning</h4>
                                <p className="text-gray-600 text-sm">
                                    Curriculum designed with industry leaders to meet real market demands
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Rocket className="h-8 w-8 text-primary-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Career Opportunities</h4>
                                <p className="text-gray-600 text-sm">
                                    Direct pathways to internships and job opportunities with our partners
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Community Impact</h4>
                                <p className="text-gray-600 text-sm">
                                    Building a stronger tech ecosystem across Africa through collaboration
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Free Forever Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-500 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                        <Heart className="h-10 w-10 text-white" />
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Fully Sponsored. No Catch. Forever.
                    </h2>

                    <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                        Every course, every certificate, every feature is completely free. We believe education should be accessible to everyone, everywhere.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        {['No Hidden Fees', 'No Credit Card', 'No Time Limits', 'No Restrictions'].map((item, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <CheckCircle className="h-6 w-6 text-white mx-auto mb-2" />
                                <p className="text-sm font-semibold">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-600 to-accent-700">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Ready to Transform Your Career?
                    </h2>

                    <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
                        Join 1000+ students who are already learning and building amazing things
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {!user ? (
                            <>
                                <Link
                                    to="/signin?tab=signup"
                                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-accent-600 rounded-xl text-xl font-bold transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
                                >
                                    <GraduationCap className="h-6 w-6" />
                                    Get Started Free
                                    <ArrowRight className="h-6 w-6" />
                                </Link>
                                <Link
                                    to="/about"
                                    className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 rounded-xl text-xl font-bold transition-all"
                                >
                                    Learn More
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-accent-600 rounded-xl text-xl font-bold transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
                            >
                                <GraduationCap className="h-6 w-6" />
                                Go to Dashboard
                                <ArrowRight className="h-6 w-6" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default LandingPage
