import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// Suppress browser extension errors
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('message channel closed') ||
        event.reason?.message?.includes('listener indicated an asynchronous response')) {
        event.preventDefault()
        console.warn('Suppressed browser extension error:', event.reason.message)
    }
})

// Suppress console errors from browser extensions
const originalError = console.error
console.error = (...args) => {
    const errorMessage = args[0]?.toString() || ''
    if (errorMessage.includes('message channel closed') ||
        errorMessage.includes('listener indicated an asynchronous response')) {
        return
    }
    originalError.apply(console, args)
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)