import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true

        // Get initial session
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (mounted) {
                    setUser(session?.user ?? null)
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error getting session:', error)
                if (mounted) {
                    setUser(null)
                    setLoading(false)
                }
            }
        }

        initSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    setUser(session?.user ?? null)
                    setLoading(false)
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email, password, rememberMe = false) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            // Store email in localStorage if remember me is checked
            if (!error && rememberMe) {
                localStorage.setItem('rememberedEmail', email)
            } else if (!rememberMe) {
                localStorage.removeItem('rememberedEmail')
            }

            if (error) {
                console.error('Sign in error:', error)
            }
            return { data, error }
        } catch (err) {
            console.error('Network error during sign in:', err)
            return {
                data: null,
                error: {
                    message: 'Network error. Please check your internet connection and try again.'
                }
            }
        }
    }

    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            })
            if (error) {
                console.error('Google sign in error:', error)
            }
            return { data, error }
        } catch (err) {
            console.error('Network error during Google sign in:', err)
            return {
                data: null,
                error: {
                    message: 'Network error. Please check your internet connection and try again.'
                }
            }
        }
    }

    const signUp = async (email, password, userDetails = {}) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`,
                    data: {
                        first_name: userDetails.firstName || '',
                        last_name: userDetails.lastName || '',
                        phone: userDetails.phone || '',
                        learning_goals: userDetails.learningGoals || '',
                        experience_level: userDetails.experienceLevel || 'beginner'
                    }
                }
            })
            if (error) {
                console.error('Sign up error:', error)
            }
            return { data, error }
        } catch (err) {
            console.error('Network error during sign up:', err)
            return {
                data: null,
                error: {
                    message: 'Network error. Please check your internet connection and try again.'
                }
            }
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    const updateProfile = async (updates) => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                data: {
                    first_name: updates.first_name,
                    last_name: updates.last_name,
                    phone: updates.phone,
                    learning_goals: updates.learning_goals,
                    experience_level: updates.experience_level,
                    bio: updates.bio,
                    avatar_url: updates.avatar_url
                }
            })

            if (error) {
                console.error('Profile update error:', error)
                throw error
            }

            // Refresh user data
            const { data: { user: updatedUser } } = await supabase.auth.getUser()
            setUser(updatedUser)

            return { data, error: null }
        } catch (err) {
            console.error('Error during profile update:', err)
            throw err
        }
    }

    const refreshUser = async () => {
        try {
            const { data: { user: freshUser }, error } = await supabase.auth.getUser()
            if (error) throw error
            setUser(freshUser)
            return { user: freshUser, error: null }
        } catch (err) {
            console.error('Error refreshing user:', err)
            return { user: null, error: err }
        }
    }

    const value = {
        user,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}