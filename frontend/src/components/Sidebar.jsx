import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
    LayoutDashboard,
    User,
    BookOpen,
    CheckCircle,
    Award,
    Video,
    ChevronLeft,
    ChevronRight,
    LogOut,
    UserPlus,
    Settings,
    Bell,
    Users,
    GraduationCap
} from 'lucide-react'

const Sidebar = ({ user, onSignOut, onOpenModal }) => {
    const [isMinimized, setIsMinimized] = useState(window.innerWidth < 1024) // Start minimized on mobile
    const [isInstructor, setIsInstructor] = useState(false)
    const location = useLocation()
    const isAdmin = user?.user_metadata?.role === 'admin'

    // Check if user is an instructor
    useEffect(() => {
        const checkInstructorStatus = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from('course_instructors')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('is_active', true)
                    .limit(1)

                if (!error && data && data.length > 0) {
                    setIsInstructor(true)
                }
            } catch (error) {
                console.error('Error checking instructor status:', error)
            }
        }

        checkInstructorStatus()
    }, [user])

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="h-5 w-5" />,
            path: '/dashboard',
            badge: null,
            isLink: true
        },
        {
            id: 'profile',
            label: 'My Profile',
            icon: <User className="h-5 w-5" />,
            badge: null,
            isLink: false,
            onClick: () => onOpenModal?.('profile')
        },
        {
            id: 'announcements',
            label: 'Announcements',
            icon: <Bell className="h-5 w-5" />,
            badge: null,
            isLink: false,
            onClick: () => onOpenModal?.('announcements')
        },
        {
            id: 'resources',
            label: 'Resources',
            icon: <BookOpen className="h-5 w-5" />,
            path: '/resources',
            badge: null,
            isLink: true
        },
        {
            id: 'assignments',
            label: 'Assignments',
            icon: <CheckCircle className="h-5 w-5" />,
            badge: '3',
            isLink: false,
            onClick: () => onOpenModal?.('assignments')
        },
        {
            id: 'certificates',
            label: 'Certificates',
            icon: <Award className="h-5 w-5" />,
            badge: null,
            isLink: false,
            onClick: () => onOpenModal?.('certificates')
        },
        {
            id: 'live-classes',
            label: 'Live Classes',
            icon: <Video className="h-5 w-5" />,
            badge: 'Live',
            isLink: false,
            onClick: () => onOpenModal?.('liveClass')
        }
    ]

    const adminMenuItems = [
        {
            id: 'register-student',
            label: 'Register Student',
            icon: <UserPlus className="h-5 w-5" />,
            badge: null,
            isLink: false,
            onClick: () => onOpenModal?.('registerStudent')
        },
        {
            id: 'admissions',
            label: 'Admissions',
            icon: <Settings className="h-5 w-5" />,
            badge: null,
            isLink: false,
            onClick: () => onOpenModal?.('admissions')
        },
        {
            id: 'instructors',
            label: 'Instructors',
            icon: <Users className="h-5 w-5" />,
            badge: null,
            isLink: false,
            onClick: () => onOpenModal?.('instructors')
        }
    ]

    const isActive = (item) => {
        if (item.isLink && item.path) {
            return location.pathname === item.path
        }
        return false
    }

    return (
        <>
            {/* Mobile Overlay */}
            {!isMinimized && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMinimized(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white border-r border-primary-200 shadow-lg transition-all duration-300 ease-in-out z-40 flex flex-col
                    ${isMinimized ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-64'}
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="absolute -right-3 top-6 bg-accent-600 text-white p-1.5 rounded-full shadow-lg hover:bg-accent-700 transition-all duration-200 z-50 hidden lg:flex items-center justify-center"
                >
                    {isMinimized ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMinimized(true)}
                    className="absolute right-4 top-4 text-primary-600 hover:text-primary-900 lg:hidden"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Logo/Brand */}
                <div className="p-4 sm:p-6 border-b border-primary-200">
                    {!isMinimized ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-display font-bold text-primary-900 text-base sm:text-lg">DEVGet</h2>
                                <p className="text-xs text-primary-500">Learning Portal</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile Section */}
                <div className="p-3 sm:p-4 border-b border-primary-200">
                    {!isMinimized ? (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-md overflow-hidden flex-shrink-0">
                                {user?.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user?.email?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-primary-900 truncate text-xs sm:text-sm">
                                    {user?.user_metadata?.first_name || 'Student'}
                                </p>
                                <p className="text-xs text-primary-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-semibold shadow-md overflow-hidden">
                                {user?.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user?.email?.charAt(0).toUpperCase()
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="p-3 sm:p-4 flex-1 overflow-y-auto">
                    <div className="space-y-1 sm:space-y-2">
                        {menuItems.map((item) => {
                            const active = isActive(item)
                            const baseClasses = `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 group relative ${isMinimized ? 'justify-center' : ''
                                } ${active
                                    ? 'bg-gradient-to-r from-accent-600 to-accent-700 text-white shadow-md'
                                    : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900'
                                }`

                            const content = (
                                <>
                                    <span className={active ? 'text-white' : 'text-primary-500 group-hover:text-accent-600'}>
                                        {item.icon}
                                    </span>
                                    {!isMinimized && (
                                        <>
                                            <span className="font-medium text-xs sm:text-sm flex-1">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-semibold ${item.badge === 'Live'
                                                        ? 'bg-error-100 text-error-700 animate-pulse'
                                                        : active
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-accent-100 text-accent-700'
                                                        }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {isMinimized && item.badge && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-error-500 rounded-full"></span>
                                    )}
                                </>
                            )

                            return item.isLink ? (
                                <Link key={item.id} to={item.path} className={baseClasses}>
                                    {content}
                                </Link>
                            ) : (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.onClick) {
                                            item.onClick()
                                        }
                                    }}
                                    type="button"
                                    className={`${baseClasses} w-full text-left cursor-pointer`}
                                >
                                    {content}
                                </button>
                            )
                        })}
                    </div>

                    {/* Admin Section */}
                    {isAdmin && (
                        <div className="mt-4 sm:mt-6">
                            {!isMinimized && (
                                <div className="px-3 sm:px-4 mb-2">
                                    <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Admin</p>
                                </div>
                            )}
                            <div className="space-y-1 sm:space-y-2">
                                {adminMenuItems.map((item) => {
                                    const baseClasses = `flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 group relative text-primary-600 hover:bg-primary-50 hover:text-primary-900 ${isMinimized ? 'justify-center' : ''
                                        }`

                                    const content = (
                                        <>
                                            <span className="text-primary-500 group-hover:text-accent-600">
                                                {item.icon}
                                            </span>
                                            {!isMinimized && (
                                                <span className="font-medium text-xs sm:text-sm flex-1">{item.label}</span>
                                            )}
                                        </>
                                    )

                                    return (
                                        <button
                                            key={item.id}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                item.onClick?.()
                                            }}
                                            type="button"
                                            className={`${baseClasses} w-full text-left cursor-pointer`}
                                        >
                                            {content}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Instructor Section */}
                    {isInstructor && (
                        <div className="mt-4 sm:mt-6">
                            {!isMinimized && (
                                <div className="px-3 sm:px-4 mb-2">
                                    <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Instructor</p>
                                </div>
                            )}
                            <div className="space-y-1 sm:space-y-2">
                                <Link
                                    to="/instructor/dashboard"
                                    className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 group relative ${isMinimized ? 'justify-center' : ''
                                        } ${location.pathname === '/instructor/dashboard'
                                            ? 'bg-gradient-to-r from-accent-600 to-accent-700 text-white shadow-md'
                                            : 'text-primary-600 hover:bg-primary-50 hover:text-primary-900'
                                        }`}
                                >
                                    <span className={location.pathname === '/instructor/dashboard' ? 'text-white' : 'text-primary-500 group-hover:text-accent-600'}>
                                        <GraduationCap className="h-5 w-5" />
                                    </span>
                                    {!isMinimized && (
                                        <span className="font-medium text-xs sm:text-sm flex-1">Instructor Dashboard</span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Sign Out Button */}
                <div className="p-3 sm:p-4 border-t border-primary-200">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onSignOut?.()
                        }}
                        type="button"
                        className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 text-error-600 hover:bg-error-50 w-full cursor-pointer ${isMinimized ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut className="h-5 w-5" />
                        {!isMinimized && <span className="font-medium text-xs sm:text-sm">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Spacer for content - only on desktop */}
            <div className={`hidden lg:block transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'}`}></div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMinimized(false)}
                className={`fixed top-4 left-4 z-50 bg-accent-600 text-white p-2 rounded-lg shadow-lg hover:bg-accent-700 transition-all lg:hidden ${!isMinimized ? 'hidden' : ''}`}
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </>
    )
}

export default Sidebar
