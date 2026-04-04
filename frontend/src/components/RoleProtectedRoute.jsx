import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const RoleProtectedRoute = ({ children, requiredRole, redirectTo = '/signin' }) => {
    const { user, userRoles, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to={redirectTo} />
    }

    // Admins have access to everything
    if (userRoles.includes('admin')) {
        return children
    }

    // Check if user has the required role
    if (requiredRole && !userRoles.includes(requiredRole)) {
        // If user has no roles at all, show a message instead of redirecting
        if (userRoles.length === 0) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Pending</h2>
                        <p className="text-gray-600 mb-6">
                            Your account is being set up. Please contact support if this persists.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-all"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            )
        }

        // Redirect based on what roles they do have
        if (userRoles.includes('student')) {
            return <Navigate to="/dashboard" />
        } else if (userRoles.includes('developer')) {
            return <Navigate to="/developer-console" />
        } else if (userRoles.includes('instructor')) {
            return <Navigate to="/dashboard" />
        } else {
            // No matching roles, redirect to appropriate sign-in
            return <Navigate to={redirectTo} />
        }
    }

    return children
}

export default RoleProtectedRoute
