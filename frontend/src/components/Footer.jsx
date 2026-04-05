import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center justify-start mb-4 -my-6 -ml-4 md:-ml-6">
                            <img
                                src="/images/logos/devget-logo.png"
                                alt="DEVGet Learning"
                                className="h-28 md:h-32 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden items-center gap-3">
                                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-3">
                                    <span className="text-white font-bold text-2xl">DG</span>
                                </div>
                                <div className="text-white text-2xl font-bold tracking-tight">
                                    DEVGet Learning
                                </div>
                            </div>
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Empowering African youth through free, world-class Tech & AI education. Building the next generation of tech leaders.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg"
                                aria-label="Facebook"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg"
                                aria-label="Instagram"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-xl flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-lg"
                                aria-label="TikTok"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-accent-400 transition-colors text-sm flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-accent-400 transition-all mr-0 group-hover:mr-2"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-accent-400 transition-colors text-sm flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-accent-400 transition-all mr-0 group-hover:mr-2"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-gray-300 hover:text-accent-400 transition-colors text-sm flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-accent-400 transition-all mr-0 group-hover:mr-2"></span>
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-accent-400 transition-colors text-sm flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-accent-400 transition-all mr-0 group-hover:mr-2"></span>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Support Us</h4>
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                            Help us provide free education to more students across Africa
                        </p>
                        <a
                            href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%20with%20a%20donation.%20How%20can%20I%20help%3F"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Heart className="h-4 w-4" />
                            Donate Now
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} DEVGet Learning. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/privacy" className="text-gray-400 hover:text-accent-400 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-gray-400 hover:text-accent-400 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
