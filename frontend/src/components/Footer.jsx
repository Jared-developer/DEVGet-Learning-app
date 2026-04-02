import { Link } from 'react-router-dom'
import { Heart, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-4">
                            <img
                                src="/images/logos/devget-learning-logo.png"
                                alt="DEVGet Learning"
                                className="h-36 md:h-40 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div className="text-white text-2xl font-bold tracking-tight hidden">
                                DEVGet Learning
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Empowering African youth through free, world-class Tech & AI education. Building the next generation of tech leaders.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://tiktok.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="TikTok"
                            >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 hover:bg-accent-600 rounded-lg flex items-center justify-center transition-all transform hover:scale-110"
                                aria-label="X (Twitter)"
                            >
                                <Twitter className="h-5 w-5" />
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
