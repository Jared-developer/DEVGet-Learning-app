import { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'

const AdBanner = () => {
    const [ads, setAds] = useState([])
    const [currentAdIndex, setCurrentAdIndex] = useState(0)
    const [isMinimized, setIsMinimized] = useState(false)
    const [isClosed, setIsClosed] = useState(false)

    useEffect(() => {
        // Check if user has closed the ad banner
        const adClosed = localStorage.getItem('adBannerClosed')
        if (adClosed === 'true') {
            setIsClosed(true)
        }

        // Fetch ads (replace with your actual API endpoint)
        fetchAds()
    }, [])

    useEffect(() => {
        // Auto-rotate ads every 5 seconds if there are multiple ads
        if (ads.length > 1 && !isMinimized) {
            const interval = setInterval(() => {
                setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length)
            }, 5000)

            return () => clearInterval(interval)
        }
    }, [ads.length, isMinimized])

    const fetchAds = async () => {
        try {
            // Replace with actual API call
            // const response = await fetch('/api/ads')
            // const data = await response.json()
            
            // Sample ads for demonstration
            const sampleAds = [
                {
                    id: 1,
                    title: "Limited Time Offer!",
                    message: "Get 20% off on premium courses. Use code: LEARN20",
                    link: "/courses",
                    bgColor: "from-blue-500 to-blue-600"
                },
                {
                    id: 2,
                    title: "New Course Alert!",
                    message: "Master React in 30 days. Enroll now for free!",
                    link: "/courses/react",
                    bgColor: "from-purple-500 to-purple-600"
                },
                {
                    id: 3,
                    title: "Join Our Community",
                    message: "Connect with 1000+ learners worldwide",
                    link: "/community",
                    bgColor: "from-green-500 to-green-600"
                }
            ]
            
            setAds(sampleAds)
        } catch (error) {
            console.error('Error fetching ads:', error)
        }
    }

    const handleClose = () => {
        setIsClosed(true)
        localStorage.setItem('adBannerClosed', 'true')
    }

    const handleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    if (isClosed || ads.length === 0) {
        return null
    }

    const currentAd = ads[currentAdIndex]

    return (
        <div className="relative z-40">
            <div className={`bg-gradient-to-r ${currentAd.bgColor} text-white transition-all duration-300 ${isMinimized ? 'h-0 overflow-hidden' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-3 gap-4">
                        {/* Ad Content */}
                        <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center gap-2">
                                <span className="font-bold text-sm sm:text-base">{currentAd.title}</span>
                                <span className="text-xs sm:text-sm text-white/90">{currentAd.message}</span>
                            </div>
                            {currentAd.link && (
                                <a
                                    href={currentAd.link}
                                    className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                                >
                                    Learn More
                                </a>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            {/* Ad Counter */}
                            {ads.length > 1 && (
                                <div className="hidden sm:flex items-center gap-1">
                                    {ads.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentAdIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                index === currentAdIndex ? 'bg-white w-4' : 'bg-white/50'
                                            }`}
                                            aria-label={`Go to ad ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Minimize Button */}
                            <button
                                onClick={handleMinimize}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                aria-label="Minimize banner"
                            >
                                <ChevronUp className="h-4 w-4" />
                            </button>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                aria-label="Close banner"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimized State Bar */}
            {isMinimized && (
                <div className={`bg-gradient-to-r ${currentAd.bgColor} text-white`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <button
                            onClick={handleMinimize}
                            className="w-full flex items-center justify-center gap-2 py-2 hover:bg-white/10 transition-colors"
                        >
                            <span className="text-xs font-semibold">{currentAd.title}</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdBanner
