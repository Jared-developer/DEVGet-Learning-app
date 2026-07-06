import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [userRoles, setUserRoles] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFetchingRoles, setIsFetchingRoles] = useState(false)

    const fetchUserRoles = async (currentUser) => {
        if (!currentUser) {
            setUserRoles([])
            return
        }

        // Prevent concurrent role fetches
        if (isFetchingRoles) {
            console.log('Role fetch already in progress, skipping...')
            return
        }

        try {
            setIsFetchingRoles(true)
            console.log('Fetching roles for user:', currentUser.id)

            // Set a shorter timeout and implement retry logic
            const createTimeoutPromise = (ms) => new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Role fetch timeout')), ms)
            );

            let result;
            let retryCount = 0;
            const maxRetries = 2;

            while (retryCount <= maxRetries) {
                try {
                    const timeoutMs = 5000 + (retryCount * 2000); // Increase timeout with each retry
                    const timeoutPromise = createTimeoutPromise(timeoutMs);
                    
                    const fetchPromise = supabase
                        .from('user_roles')
                        .select('role')
                        .eq('user_id', currentUser.id);

                    result = await Promise.race([fetchPromise, timeoutPromise]);
                    break; // Success, exit retry loop
                } catch (err) {
                    retryCount++;
                    console.warn(`Role fetch attempt ${retryCount} failed:`, err.message);
                    
                    if (retryCount > maxRetries) {
                        console.warn('All role fetch attempts failed, defaulting to student role');
                        result = { data: null, error: err };
                        break;
                    }
                    
                    // Wait before retrying with exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }

            if (result.error) {
                console.warn('Error fetching user roles, defaulting to student:', result.error.message)
                // Default to student role if fetch fails
                setUserRoles(['student'])
                return
            }

            const roles = result.data

            // If no roles found, default to student
            if (!roles || roles.length === 0) {
                console.log('No roles found, defaulting to student')
                setUserRoles(['student'])
                return
            }

            console.log('Fetched roles:', roles)
            const rolesList = roles.map(r => r.role)
            console.log('Roles list:', rolesList)
            setUserRoles(rolesList)
        } catch (error) {
            console.warn('Error fetching user roles, defaulting to student:', error.message)
            // Default to student role on error
            setUserRoles(['student'])
        } finally {
            setIsFetchingRoles(false)
        }
    }

    useEffect(() => {
        let mounted = true

        // Get initial session
        const initSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (mounted) {
                    const currentUser = session?.user ?? null
                    setUser(currentUser)
                    if (currentUser) {
                        await fetchUserRoles(currentUser)
                    }
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error getting session:', error)
                if (mounted) {
                    setUser(null)
                    setUserRoles([])
                    setLoading(false)
                }
            }
        }

        initSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (mounted) {
                    const currentUser = session?.user ?? null
                    setUser(currentUser)
                    if (currentUser) {
                        await fetchUserRoles(currentUser)
                    } else {
                        setUserRoles([])
                    }
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
            // Use production URL from env, fallback to current origin for local dev
            const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
            
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${appUrl}/dashboard`,
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

    const signUp = async (email, password, userDetails = {}, role = 'student') => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: userDetails.firstName || '',
                        last_name: userDetails.lastName || '',
                        phone: userDetails.phone || '',
                        learning_goals: userDetails.learningGoals || '',
                        experience_level: userDetails.experienceLevel || 'beginner',
                        role: role
                    }
                }
            })

            if (error) {
                console.error('Sign up error:', error)
                
                // Handle specific error cases for better user experience
                let userFriendlyError = { ...error };
                
                if (error.message.includes('rate limit') || error.message.includes('Rate limit')) {
                    userFriendlyError.message = 'Too many signup attempts. Please wait a few minutes and try again.';
                } else if (error.message.includes('Email rate limit exceeded')) {
                    userFriendlyError.message = 'Email rate limit exceeded. Please wait a moment and try again.';
                } else if (error.message.includes('already registered') || error.message.includes('User already registered')) {
                    userFriendlyError.message = 'An account with this email already exists. Try signing in instead.';
                }
                
                return { data, error: userFriendlyError }
            }

            // Assign role to user
            if (data.user) {
                try {
                    await supabase
                        .from('user_roles')
                        .insert([{ user_id: data.user.id, role: role }])
                } catch (roleError) {
                    console.error('Error assigning role:', roleError)
                }
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
            if (freshUser) {
                await fetchUserRoles(freshUser)
            }
            return { user: freshUser, error: null }
        } catch (err) {
            console.error('Error refreshing user:', err)
            return { user: null, error: err }
        }
    }

    const hasRole = (role) => {
        return userRoles.includes(role)
    }

    const value = {
        user,
        userRoles,
        hasRole,
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