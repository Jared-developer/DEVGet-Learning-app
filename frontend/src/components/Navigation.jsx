import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, FileText, BookOpen, Newspaper, Zap, Heart, Code } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Navigation = ({ currentPage = '' }) => {
    const { user } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-accent-900/95 via-accent-800/90 to-purple-900/85 border-b border-white/10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center justify-start flex-shrink-0 -my-10 md:-my-12 -ml-4 md:-ml-6">
                        <img
                            src="/images/logos/updatedLogo.jpg"
                            alt="DEVGet Learning"
                            className="h-32 md:h-40 w-auto"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden items-center gap-2">
                            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-2">
                                <span className="text-white font-bold text-xl">DG</span>
                            </div>
                            <span className="text-white text-xl font-bold">DEVGet Learning</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className={`${currentPage === 'home' ? 'text-white font-medium' : 'text-white/90'} hover:text-yellow-300 transition-colors`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/about"
                            className={`${currentPage === 'about' ? 'text-white font-medium' : 'text-white/90'} hover:text-yellow-300 transition-colors`}
                        >
                            About
                        </Link>

                        {/* Resources Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}
                                onMouseEnter={() => setResourcesDropdownOpen(true)}
                                className={`flex items-center gap-1 ${currentPage === 'resources' ? 'text-white font-medium' : 'text-white/90'} hover:text-yellow-300 transition-colors`}
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

                        <Link
                            to="/contact"
                            className={`${currentPage === 'contact' ? 'text-white font-medium' : 'text-white/90'} hover:text-yellow-300 transition-colors`}
                        >
                            Contact
                        </Link>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/developer-console"
                            className="flex items-center gap-1 px-2 py-1 text-white/90 hover:text-yellow-300 transition-colors"
                        >
                            <Code className="h-3 w-3" />
                            <span className="text-xs font-medium">Developers</span>
                        </Link>
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
                                <Link
                                    to="/developer-console"
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Code className="h-4 w-4" />
                                    Developer Console
                                </Link>
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
    )
}

export default Navigation
