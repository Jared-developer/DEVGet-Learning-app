import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const RoleProtectedRoute = ({ children, requiredRole, redirectTo = '/signin' }) => {
    const { user, userRoles, loading, refreshUser } = useAuth()
    const [isAssigningRole, setIsAssigningRole] = useState(false)

    useEffect(() => {
        const assignDefaultRole = async () => {
            // Only auto-assign for student role and if user has no roles
            if (user && !loading && userRoles.length === 0 && requiredRole === 'student' && !isAssigningRole) {
                setIsAssigningRole(true)
                try {
                    console.log('Auto-assigning student role to user:', user.id)

                    // Check if role already exists (race condition protection)
                    const { data: existingRoles } = await supabase
                        .from('user_roles')
                        .select('role')
                        .eq('user_id', user.id)

                    if (!existingRoles || existingRoles.length === 0) {
                        // Assign student role
                        const { error } = await supabase
                            .from('user_roles')
                            .insert([{ user_id: user.id, role: 'student' }])

                        if (error) {
                            console.error('Error auto-assigning student role:', error)
                        } else {
                            console.log('Successfully auto-assigned student role')
                            // Refresh user roles
                            await refreshUser()
                        }
                    }
                } catch (error) {
                    console.error('Error in auto-assign role:', error)
                } finally {
                    setIsAssigningRole(false)
                }
            }
        }

        assignDefaultRole()
    }, [user, loading, userRoles, requiredRole, isAssigningRole, refreshUser])

    if (loading || isAssigningRole) {
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
        // If user has no roles at all and it's not a student route, show access pending
        if (userRoles.length === 0 && requiredRole !== 'student') {
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
