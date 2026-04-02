import { Link } from 'react-router-dom'
import { BookOpen, Code, Users, Globe, Heart, Award, Menu, X, ChevronDown, FileText, Newspaper, Zap, GraduationCap, Rocket, Palette, Cpu, Database, Layers, Bot, Sparkles, CheckCircle, ArrowRight, Star, Facebook, Instagram, Twitter } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'
import AdmissionsSection from '../components/AdmissionsSection'

const LandingPage = () => {
    const { user } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false)
    const [currentTextIndex, setCurrentTextIndex] = useState(0)

    const rotatingTexts = [
        'Tech Future',
        'Digital Leaders',
        'Innovation Hub',
        'Tech Community',
        'Success Stories'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length)
        }, 3000) // Change text every 3 seconds

        return () => clearInterval(interval)
    }, [])

    const features = [
        {
            icon: <Code className="h-6 w-6" />,
            title: "Comprehensive Curriculum",
            description: "From HTML basics to advanced AI/ML and full-stack development"
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Interactive Learning",
            description: "Videos, quizzes, hands-on projects, and real-world applications"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community Support",
            description: "Connect with peers, mentors, and fellow learners across Africa"
        },
        {
            icon: <Award className="h-6 w-6" />,
            title: "Certificates",
            description: "Earn certificates to showcase your skills and achievements"
        }
    ]

    const courses = [
        {
            category: "Basics",
            icon: <BookOpen className="h-6 w-6" />,
            gradient: "from-blue-500 to-blue-600",
            items: [
                { icon: <Globe className="h-4 w-4" />, name: "HTML Fundamentals" },
                { icon: <Palette className="h-4 w-4" />, name: "CSS Styling" },
                { icon: <Code className="h-4 w-4" />, name: "JavaScript Essentials" },
                { icon: <Cpu className="h-4 w-4" />, name: "Python Basics" },
                { icon: <Database className="h-4 w-4" />, name: "Database Fundamentals" }
            ]
        },
        {
            category: "Advanced",
            icon: <Rocket className="h-6 w-6" />,
            gradient: "from-purple-500 to-purple-600",
            items: [
                { icon: <Layers className="h-4 w-4" />, name: "MERN Stack Development" },
                { icon: <Cpu className="h-4 w-4" />, name: "AI/ML Fundamentals" },
                { icon: <Bot className="h-4 w-4" />, name: "Agentic AI Systems" }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section with Navigation */}
            <section className="relative min-h-screen flex flex-col overflow-hidden">
                {/* Background Image with Overlay - covers entire hero including navbar */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/backgrounds/ChatGPT Image Mar 30, 2026, 10_01_07 PM.png"
                        alt="Students learning"
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay using brand colors */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-900/95 via-accent-800/90 to-purple-900/85"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-50 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to="/" className="flex items-center flex-shrink-0 -my-10 md:-my-12">
                                <img
                                    src="/images/logos/devget-learning-logo.png"
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
                                <Link to="/" className="text-white font-medium hover:text-yellow-300 transition-colors">
                                    Home
                                </Link>
                                <Link to="/about" className="text-white/90 hover:text-yellow-300 transition-colors">
                                    About
                                </Link>

                                {/* Resources Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                                        onMouseEnter={() => setResourcesDropdownOpen(true)}
                                        className="flex items-center gap-1 text-white/90 hover:text-yellow-300 transition-colors"
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

                                <Link to="/contact" className="text-white/90 hover:text-yellow-300 transition-colors">
                                    Contact
                                </Link>
                            </div>

                            {/* CTA Buttons */}
                            <div className="hidden md:flex items-center gap-2">
                                <a
                                    href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%20with%20a%20donation.%20How%20can%20I%20help%3F"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-2 py-1 text-white/90 hover:text-yellow-300 transition-colors"
                                >
                                    <Heart className="h-3 w-3" />
                                    <span className="text-xs font-medium">Donate</span>
                                </a>
                                {!user ? (
                                    <Link
                                        to="/signin"
                                        className="px-3 py-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 rounded text-xs font-medium transition-all"
                                    >
                                        Student Portal
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="px-3 py-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 rounded text-xs font-medium transition-all"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        {mobileMenuOpen && (
                            <div className="md:hidden py-4 border-t border-white/10">
                                <div className="flex flex-col space-y-3">
                                    <Link to="/" className="px-4 py-2 text-white font-medium" onClick={() => setMobileMenuOpen(false)}>
                                        Home
                                    </Link>
                                    <Link to="/about" className="px-4 py-2 text-white/90" onClick={() => setMobileMenuOpen(false)}>
                                        About
                                    </Link>
                                    <Link to="/resources" className="px-4 py-2 text-white/90" onClick={() => setMobileMenuOpen(false)}>
                                        Resources
                                    </Link>
                                    <Link to="/contact" className="px-4 py-2 text-white/90" onClick={() => setMobileMenuOpen(false)}>
                                        Contact
                                    </Link>
                                    <div className="px-4 pt-3 border-t border-white/10 space-y-2">
                                        <a
                                            href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%20with%20a%20donation.%20How%20can%20I%20help%3F"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg"
                                        >
                                            <Heart className="h-4 w-4" />
                                            Donate
                                        </a>
                                        {!user ? (
                                            <Link
                                                to="/signin"
                                                className="block text-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg font-medium"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Student Portal
                                            </Link>
                                        ) : (
                                            <Link
                                                to="/dashboard"
                                                className="block text-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg font-medium"
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

                {/* Hero Content */}
                <div className="relative z-10 flex-1 flex items-center justify-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-green-100 text-sm font-medium mb-8">
                            <Heart className="h-4 w-4" />
                            100% Free Tech & AI Education for Africa
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Building Africa's
                            <span className="block text-yellow-300 mt-2 min-h-[1.2em]">
                                <span className="inline-block animate-fade-in-up" key={currentTextIndex}>
                                    {rotatingTexts[currentTextIndex]}
                                </span>
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-gray-100 mb-4 max-w-3xl mx-auto leading-relaxed">
                            A youth-led project providing free Tech & AI education to underserved communities in Malawi and across Africa
                        </p>

                        <p className="text-lg text-yellow-200 font-semibold mb-10">
                            No fees. No barriers. Just opportunity.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            {!user ? (
                                <a
                                    href="#admissions"
                                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-semibold transition-all shadow-xl hover:shadow-accent-500/50 transform hover:-translate-y-1"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Apply Now
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                            ) : (
                                <Link
                                    to="/dashboard"
                                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm font-semibold transition-all shadow-xl hover:shadow-accent-500/50 transform hover:-translate-y-1"
                                >
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Go to Dashboard
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            )}
                            <Link
                                to="/about"
                                className="w-full sm:w-auto px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                            >
                                Learn Our Mission
                            </Link>
                        </div>

                        {/* Social Media Icons */}
                        <div className="mt-8 flex items-center justify-center gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full border border-white/30 transition-all hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full border border-white/30 transition-all hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-3.5 w-3.5" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full border border-white/30 transition-all hover:scale-110"
                                aria-label="TikTok"
                            >
                                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full border border-white/30 transition-all hover:scale-110"
                                aria-label="X (Twitter)"
                            >
                                <Twitter className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                                <div className="text-4xl font-bold text-yellow-300 mb-2">100%</div>
                                <div className="text-white font-medium">Free Access</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                                <div className="text-4xl font-bold text-yellow-300 mb-2">5+</div>
                                <div className="text-white font-medium">Courses</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                                <div className="text-4xl font-bold text-yellow-300 mb-2">∞</div>
                                <div className="text-white font-medium">Opportunities</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="relative z-10 pb-8 flex justify-center animate-bounce">
                    <ChevronDown className="h-8 w-8 text-white/60" />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose DEVGet Learning?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to become a skilled developer - completely free
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-accent-300 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center text-accent-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Free Access Highlight */}
                    <div className="mt-12 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Free Access</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    All courses, certificates, live sessions, and features are completely free. No hidden costs, no subscriptions - just quality education for everyone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Course Categories</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Structured learning paths for every skill level
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {courses.map((course, index) => (
                            <div key={index} className="p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${course.gradient} rounded-xl flex items-center justify-center text-white`}>
                                        {course.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{course.category}</h3>
                                </div>

                                <div className="space-y-3">
                                    {course.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="text-accent-600">
                                                {item.icon}
                                            </div>
                                            <span className="text-gray-700 font-medium">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-700 via-accent-600 to-purple-700">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                        <Sparkles className="h-4 w-4" />
                        Join Our Community
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Ready to Start Your Tech Journey?
                    </h2>

                    <p className="text-xl text-white/90 mb-10">
                        Join thousands of learners building their future with free, quality Tech & AI education
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {!user ? (
                            <a
                                href="#admissions"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-accent-600 rounded-xl text-lg font-semibold transition-all shadow-lg"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <GraduationCap className="h-5 w-5" />
                                Apply Now
                                <ArrowRight className="h-5 w-5" />
                            </a>
                        ) : (
                            <Link
                                to="/dashboard"
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-accent-600 rounded-xl text-lg font-semibold transition-all shadow-lg"
                            >
                                <GraduationCap className="h-5 w-5" />
                                Continue Learning
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        )}
                        <Link
                            to="/about"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl text-lg font-semibold transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            <div id="admissions">
                <AdmissionsSection />
            </div>

            <Footer />
        </div>
    )
}

export default LandingPage
