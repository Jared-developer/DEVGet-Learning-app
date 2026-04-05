import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { courseContent } from '../data/courseContent'
import Sidebar from '../components/Sidebar'
import ProfileModal from '../components/ProfileModal'
import CertificatesModal from '../components/CertificatesModal'
import LiveClassModal from '../components/LiveClassModal'
import AssignmentsModal from '../components/AssignmentsModal'
import AnnouncementsModal from '../components/AnnouncementsModal'
import StudentRegistration from '../components/StudentRegistration'
import AdmissionsManager from '../components/AdmissionsManager'
import InstructorManager from '../components/InstructorManager'
import {
    Code,
    BookOpen,
    Database,
    Palette,
    Globe,
    Cpu,
    Zap,
    Layers,
    Play,
    Clock,
    Award,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Star,
    X
} from 'lucide-react'

const Dashboard = () => {
    const { user, signOut, updateProfile } = useAuth()
    const navigate = useNavigate()
    const [activeCategory, setActiveCategory] = useState('enrolled')
    const [activeModal, setActiveModal] = useState(null)
    const [showEnrollModal, setShowEnrollModal] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [enrollmentLoading, setEnrollmentLoading] = useState(false)
    const [dashboardLoading, setDashboardLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadEnrolledCourses()
        } else {
            setDashboardLoading(false)
        }
    }, [user])

    const loadEnrolledCourses = async () => {
        if (!user) {
            setDashboardLoading(false)
            return
        }

        try {
            console.log('Loading enrolled courses for user:', user.id)
            const { data: enrollments, error } = await supabase
                .from('enrollments')
                .select(`
                    id,
                    enrolled_at,
                    status,
                    course:courses (
                        id,
                        title,
                        description,
                        category,
                        difficulty,
                        duration,
                        instructor,
                        thumbnail
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'active')

            if (error) {
                console.error('Error loading enrolled courses:', error)
                setEnrolledCourses([])
                setDashboardLoading(false)
                return
            }

            if (!enrollments || enrollments.length === 0) {
                console.log('No enrollments found')
                setEnrolledCourses([])
                setDashboardLoading(false)
                return
            }

            const formattedCourses = enrollments
                .filter(enrollment => enrollment.course)
                .map(enrollment => {
                    const courseTitle = enrollment.course.title
                    let courseId = courseTitle.toLowerCase().replace(/\s+/g, '-')

                    if (courseTitle.includes('MERN')) courseId = 'mern-stack'
                    else if (courseTitle.includes('AI') && courseTitle.includes('Machine Learning')) courseId = 'ai-ml'
                    else if (courseTitle.includes('Agentic AI')) courseId = 'agentic-ai'
                    else if (courseTitle.includes('HTML')) courseId = 'html-fundamentals'

                    const actualCourseData = courseContent[courseId]

                    return {
                        id: courseId,
                        title: courseTitle,
                        description: enrollment.course.description,
                        category: enrollment.course.category,
                        level: enrollment.course.difficulty || actualCourseData?.level || 'Beginner',
                        duration: enrollment.course.duration || actualCourseData?.duration || 'N/A',
                        instructor: enrollment.course.instructor || actualCourseData?.instructor || 'Unknown',
                        enrolledAt: enrollment.enrolled_at,
                        progress: 0,
                        completed: false,
                        enrollmentId: enrollment.id,
                        lessons: actualCourseData?.lessons || 0
                    }
                })

            console.log('Formatted courses:', formattedCourses)
            setEnrolledCourses(formattedCourses)
            setDashboardLoading(false)
        } catch (error) {
            console.error('Error loading enrolled courses:', error)
            setEnrolledCourses([])
            setDashboardLoading(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
    }

    const handleEnrollClick = (course) => {
        setSelectedCourse(course)
        setShowEnrollModal(true)
    }

    const handleEnrollConfirm = async () => {
        if (!selectedCourse) return

        setEnrollmentLoading(true)

        try {
            const { data: courses, error: searchError } = await supabase
                .from('courses')
                .select('id, title')
                .ilike('title', `%${selectedCourse.title}%`)
                .limit(1)

            if (searchError || !courses || courses.length === 0) {
                alert('Course not found in database')
                setEnrollmentLoading(false)
                return
            }

            const courseDbId = courses[0].id

            const { error } = await supabase
                .from('enrollments')
                .insert([{
                    user_id: user.id,
                    course_id: courseDbId,
                    status: 'active'
                }])

            if (error) throw error

            await loadEnrolledCourses()
            setShowEnrollModal(false)
            setSelectedCourse(null)
            navigate(`/course/${selectedCourse.id}`)
        } catch (error) {
            console.error('Error enrolling:', error)
            alert('Failed to enroll. You may already be enrolled in this course.')
        } finally {
            setEnrollmentLoading(false)
        }
    }

    const handleUnenroll = async (courseId, enrollmentId) => {
        if (!confirm('Are you sure you want to unenroll from this course?')) return

        try {
            const { error } = await supabase
                .from('enrollments')
                .delete()
                .eq('id', enrollmentId)

            if (error) throw error

            await loadEnrolledCourses()
            alert('Successfully unenrolled from course')
        } catch (error) {
            console.error('Error unenrolling:', error)
            alert('Failed to unenroll. Please try again.')
        }
    }

    const isEnrolled = (courseId) => {
        return enrolledCourses.some(course => course.id === courseId)
    }

    const basicsCoursesData = [
        {
            id: 'html-fundamentals',
            title: 'HTML Fundamentals',
            description: 'Learn the building blocks of web development',
            icon: <Globe className="h-6 w-6" />,
            duration: '4 weeks',
            lessons: 24,
            level: 'Beginner',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            id: 'css-styling',
            title: 'CSS Styling',
            description: 'Master styling and responsive design',
            icon: <Palette className="h-6 w-6" />,
            duration: '5 weeks',
            lessons: 30,
            level: 'Beginner',
            gradient: 'from-pink-500 to-pink-600'
        },
        {
            id: 'javascript-essentials',
            title: 'JavaScript Essentials',
            description: 'Programming fundamentals and DOM manipulation',
            icon: <Code className="h-6 w-6" />,
            duration: '8 weeks',
            lessons: 48,
            level: 'Beginner',
            gradient: 'from-yellow-500 to-yellow-600'
        },
        {
            id: 'python-basics',
            title: 'Python Basics',
            description: 'Learn Python programming from scratch',
            icon: <Cpu className="h-6 w-6" />,
            duration: '6 weeks',
            lessons: 36,
            level: 'Beginner',
            gradient: 'from-green-500 to-green-600'
        },
        {
            id: 'database-fundamentals',
            title: 'Database Fundamentals',
            description: 'SQL and database design principles',
            icon: <Database className="h-6 w-6" />,
            duration: '4 weeks',
            lessons: 28,
            level: 'Beginner',
            gradient: 'from-indigo-500 to-indigo-600'
        }
    ]

    const advancedCoursesData = [
        {
            id: 'mern-stack',
            title: 'MERN Stack Development',
            description: 'Full-stack development with MongoDB, Express, React, Node.js',
            icon: <Layers className="h-6 w-6" />,
            duration: '16 weeks',
            lessons: 64,
            level: 'Advanced',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            id: 'ai-ml',
            title: 'AI & Machine Learning',
            description: 'Master AI and ML from fundamentals to advanced deep learning',
            icon: <Cpu className="h-6 w-6" />,
            duration: '16 weeks',
            lessons: 48,
            level: 'Intermediate',
            gradient: 'from-orange-500 to-orange-600'
        },
        {
            id: 'agentic-ai',
            title: 'Agentic AI Development',
            description: 'Build autonomous AI agents and systems',
            icon: <Zap className="h-6 w-6" />,
            duration: '16 weeks',
            lessons: 57,
            level: 'Expert',
            gradient: 'from-red-500 to-red-600'
        }
    ]

    const getCourseIcon = (courseId) => {
        const allCourses = [...basicsCoursesData, ...advancedCoursesData]
        const course = allCourses.find(c => c.id === courseId)
        return course?.icon || <BookOpen className="h-6 w-6" />
    }

    const getCourseGradient = (courseId) => {
        const allCourses = [...basicsCoursesData, ...advancedCoursesData]
        const course = allCourses.find(c => c.id === courseId)
        return course?.gradient || 'from-accent-500 to-accent-600'
    }

    const getEnrolledCoursesWithIcons = () => {
        return enrolledCourses.map(course => ({
            ...course,
            icon: getCourseIcon(course.id),
            gradient: getCourseGradient(course.id)
        }))
    }

    const courseCategories = {
        enrolled: {
            title: 'My Courses',
            description: 'Your enrolled courses and learning progress',
            icon: <CheckCircle className="h-5 w-5" />,
            courses: getEnrolledCoursesWithIcons()
        },
        basics: {
            title: 'Basics',
            description: 'Build your foundation with essential technologies',
            icon: <BookOpen className="h-5 w-5" />,
            courses: basicsCoursesData
        },
        advanced: {
            title: 'Advanced',
            description: 'Take your skills to the next level',
            icon: <Layers className="h-5 w-5" />,
            courses: advancedCoursesData
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex">
            <Sidebar
                user={user}
                onSignOut={handleSignOut}
                onOpenModal={setActiveModal}
            />

            {dashboardLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your dashboard...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 w-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        {/* Welcome Section */}
                        <div className="mb-6 sm:mb-8 pt-12 sm:pt-0">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                Welcome back, {user?.user_metadata?.first_name || 'Student'}!
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600">Continue your learning journey</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-gray-900">{enrolledCourses.length}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Enrolled Courses</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-gray-900">0%</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Avg Progress</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xl sm:text-2xl font-bold text-gray-900">0</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Certificates</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex gap-2 sm:gap-4 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                                {Object.entries(courseCategories).map(([key, category]) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveCategory(key)}
                                        className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${activeCategory === key
                                            ? 'border-accent-600 text-accent-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {category.icon}
                                        <span>{category.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Course Grid */}
                        <div>
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                                    {courseCategories[activeCategory].title}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">{courseCategories[activeCategory].description}</p>
                            </div>

                            {activeCategory === 'enrolled' && enrolledCourses.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                                    <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Enrolled Courses</h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
                                    <button
                                        onClick={() => setActiveCategory('basics')}
                                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all text-sm sm:text-base"
                                    >
                                        Browse Courses
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {courseCategories[activeCategory].courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                                        >
                                            <div className={`h-24 sm:h-32 bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white`}>
                                                <div className="transform group-hover:scale-110 transition-transform">
                                                    {course.icon}
                                                </div>
                                            </div>
                                            <div className="p-4 sm:p-6">
                                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                                        {course.level}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 text-xs">
                                                        <Clock className="h-3 w-3" />
                                                        {course.duration}
                                                    </span>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                                                {isEnrolled(course.id) ? (
                                                    <Link
                                                        to={`/course/${course.id}`}
                                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all text-sm"
                                                    >
                                                        <Play className="h-4 w-4" />
                                                        Continue Learning
                                                    </Link>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEnrollClick(course)}
                                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all text-sm"
                                                    >
                                                        Enroll Now
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Enroll Modal */}
            {showEnrollModal && selectedCourse && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Enroll in Course</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to enroll in <span className="font-semibold">{selectedCourse.title}</span>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowEnrollModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all"
                                disabled={enrollmentLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEnrollConfirm}
                                className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all disabled:opacity-50"
                                disabled={enrollmentLoading}
                            >
                                {enrollmentLoading ? 'Enrolling...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {activeModal === 'profile' && <ProfileModal isOpen={true} onClose={() => setActiveModal(null)} />}
            {activeModal === 'announcements' && <AnnouncementsModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'certificates' && <CertificatesModal isOpen={true} onClose={() => setActiveModal(null)} user={user} />}
            {activeModal === 'liveClass' && <LiveClassModal isOpen={true} onClose={() => setActiveModal(null)} />}
            {activeModal === 'assignments' && <AssignmentsModal isOpen={true} onClose={() => setActiveModal(null)} />}

            {/* Admin Modals */}
            {activeModal === 'registerStudent' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Student Registration</h2>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                            <StudentRegistration />
                        </div>
                    </div>
                </div>
            )}
            {activeModal === 'admissions' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full my-8">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Admissions Management</h2>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                            <AdmissionsManager />
                        </div>
                    </div>
                </div>
            )}
            {activeModal === 'instructors' && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full my-8">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Instructor Management</h2>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                            <InstructorManager />
                        </div>
                    </div>
                </div>
            )}

            {/* AI Assistant - Only available in course pages */}
        </div>
    )
}

export default Dashboard
