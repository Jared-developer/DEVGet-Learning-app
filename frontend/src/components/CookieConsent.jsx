import { useState, useEffect } from 'react'
import { X, Cookie, Shield, Settings, Check } from 'lucide-react'
import { useCookieConsent } from '../contexts/CookieConsentContext'

const CookieConsent = () => {
    const { consentGiven, preferences, acceptAll, acceptNecessary, saveCustomPreferences } = useCookieConsent()
    const [showBanner, setShowBanner] = useState(true)
    const [showSettings, setShowSettings] = useState(false)
    const [customPreferences, setCustomPreferences] = useState(preferences)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after component mounts
        if (consentGiven === null) {
            const timer = setTimeout(() => setIsVisible(true), 100)
            return () => clearTimeout(timer)
        }
    }, [consentGiven])

    if (consentGiven !== null || !showBanner) {
        return null
    }

    const handleAcceptAll = () => {
        acceptAll()
        setShowBanner(false)
    }

    const handleAcceptNecessary = () => {
        acceptNecessary()
        setShowBanner(false)
    }

    const handleSaveCustom = () => {
        saveCustomPreferences(customPreferences)
        setShowBanner(false)
        setShowSettings(false)
    }

    const togglePreference = (key) => {
        if (key === 'necessary') return // Can't disable necessary cookies
        setCustomPreferences(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    if (showSettings) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Settings className="h-6 w-6 text-accent-600" />
                                <h3 className="text-2xl font-bold text-gray-900">Cookie Preferences</h3>
                            </div>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Necessary Cookies */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-600" />
                                    <h4 className="font-bold text-gray-900">Necessary Cookies</h4>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                    Always Active
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.
                            </p>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900">Analytics Cookies</h4>
                                <button
                                    onClick={() => togglePreference('analytics')}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                        customPreferences.analytics ? 'bg-accent-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                        customPreferences.analytics ? 'transform translate-x-6' : ''
                                    }`} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                            </p>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900">Marketing Cookies</h4>
                                <button
                                    onClick={() => togglePreference('marketing')}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                        customPreferences.marketing ? 'bg-accent-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                        customPreferences.marketing ? 'transform translate-x-6' : ''
                                    }`} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                These cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an ad.
                            </p>
                        </div>

                        {/* Functional Cookies */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900">Functional Cookies</h4>
                                <button
                                    onClick={() => togglePreference('functional')}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                        customPreferences.functional ? 'bg-accent-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                        customPreferences.functional ? 'transform translate-x-6' : ''
                                    }`} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                These cookies enable enhanced functionality and personalization, such as video playback and live chat features.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-200 flex gap-3">
                        <button
                            onClick={handleSaveCustom}
                            className="flex-1 px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="h-5 w-5" />
                            Save Preferences
                        </button>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <style>{`
                @keyframes slideUpFade {
                    from {
                        opacity: 0;
                        transform: translateY(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .cookie-banner-enter {
                    animation: slideUpFade 0.5s ease-out forwards;
                }
            `}</style>
            
            <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 ${isVisible ? 'cookie-banner-enter' : 'opacity-0'}`}>
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-gray-200">
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center">
                                    <Cookie className="h-8 w-8 text-accent-600" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    We Value Your Privacy
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                                    By clicking "Accept All", you consent to our use of cookies.{' '}
                                    <a href="/privacy" className="text-accent-600 hover:text-accent-700 font-semibold underline">
                                        Learn more
                                    </a>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all hover:bg-gray-50 whitespace-nowrap"
                                >
                                    Customize
                                </button>
                                <button
                                    onClick={handleAcceptNecessary}
                                    className="px-6 py-3 border-2 border-accent-600 text-accent-600 hover:bg-accent-50 font-bold rounded-xl transition-all whitespace-nowrap"
                                >
                                    Necessary Only
                                </button>
                                <button
                                    onClick={handleAcceptAll}
                                    className="px-6 py-3 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CookieConsent
