import { createContext, useContext, useState, useEffect } from 'react'

const CookieConsentContext = createContext()

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext)
    if (!context) {
        throw new Error('useCookieConsent must be used within CookieConsentProvider')
    }
    return context
}

export const CookieConsentProvider = ({ children }) => {
    const [consentGiven, setConsentGiven] = useState(null)
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true, can't be disabled
        analytics: false,
        marketing: false,
        functional: false
    })

    useEffect(() => {
        // Check if consent has been given before
        const savedConsent = localStorage.getItem('cookieConsent')
        const savedPreferences = localStorage.getItem('cookiePreferences')
        
        if (savedConsent) {
            setConsentGiven(savedConsent === 'true')
        }
        
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences))
        }
    }, [])

    const acceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            marketing: true,
            functional: true
        }
        setPreferences(allAccepted)
        setConsentGiven(true)
        localStorage.setItem('cookieConsent', 'true')
        localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted))
        initializeCookies(allAccepted)
    }

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        }
        setPreferences(necessaryOnly)
        setConsentGiven(true)
        localStorage.setItem('cookieConsent', 'true')
        localStorage.setItem('cookiePreferences', JSON.stringify(necessaryOnly))
        initializeCookies(necessaryOnly)
    }

    const saveCustomPreferences = (customPreferences) => {
        const prefs = { ...customPreferences, necessary: true }
        setPreferences(prefs)
        setConsentGiven(true)
        localStorage.setItem('cookieConsent', 'true')
        localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
        initializeCookies(prefs)
    }

    const initializeCookies = (prefs) => {
        // Initialize analytics cookies if accepted
        if (prefs.analytics) {
            // Add Google Analytics or other analytics initialization here
            console.log('Analytics cookies enabled')
        }

        // Initialize marketing cookies if accepted
        if (prefs.marketing) {
            // Add marketing/advertising cookies initialization here
            console.log('Marketing cookies enabled')
        }

        // Initialize functional cookies if accepted
        if (prefs.functional) {
            // Add functional cookies initialization here
            console.log('Functional cookies enabled')
        }
    }

    const resetConsent = () => {
        setConsentGiven(null)
        setPreferences({
            necessary: true,
            analytics: false,
            marketing: false,
            functional: false
        })
        localStorage.removeItem('cookieConsent')
        localStorage.removeItem('cookiePreferences')
    }

    return (
        <CookieConsentContext.Provider
            value={{
                consentGiven,
                preferences,
                acceptAll,
                acceptNecessary,
                saveCustomPreferences,
                resetConsent
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    )
}
