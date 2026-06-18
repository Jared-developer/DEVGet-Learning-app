import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useProgressTracking } from '../hooks/useProgressTracking'
import LessonNotes from '../components/LessonNotes'
import AIAssistant from '../components/AIAssistant'
import CourseCommunity from '../components/CourseCommunity'
import AssignmentSubmission from '../components/AssignmentSubmission'
import InstructorUpdates from '../components/InstructorUpdates'
import ErrorBoundary from '../components/ErrorBoundary'
import {
    ArrowLeft,
    Play,
    FileText,
    CheckCircle,
    Clock,
    Award,
    BookOpen,
    Video,
    PenTool,
    Target,
    ChevronDown,
    ChevronRight,
    MessageCircle,
    User,
    LogOut,
    Bell,
    TrendingUp
} from 'lucide-react'
import { courseContent } from '../data/courseContent'

const CoursePage = () => {
    const { courseId } = useParams()
    const { user, signOut } = useAuth()
    const [activeTab, setActiveTab] = useState('overview')
    const [enrollmentStatus, setEnrollmentStatus] = useState(null)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [enrollmentId, setEnrollmentId] = useState(null)
    const [courseDbId, setCourseDbId] = useState(null)
    const [expandedModules, setExpandedModules] = useState({})
    const [quizAnswers, setQuizAnswers] = useState({})
    const [showQuizResults, setShowQuizResults] = useState(false)
    
    // Progress tracking
    const {
        courseProgress,
        lessonProgress,
        markLessonComplete,
        markLessonInProgress,
        getLessonStatus,
        isLessonCompleted,
        getQuizScore,
        getProgressStats
    } = useProgressTracking(courseDbId)

    const getCourseKey = (urlSlug) => {
        const courseMap = {
            'complete-ai-&-machine-learning': 'ai-ml',
            'complete-ai-machine-learning': 'ai-ml',
            'ai-ml': 'ai-ml',
            'mern-stack': 'mern-stack',
            'agentic-ai': 'agentic-ai',
            'agentic-ai-development': 'agentic-ai',
            'html-fundamentals': 'html-fundamentals',
            'html-for-absolute-beginners': 'html-fundamentals'
        }
        return courseMap[urlSlug] || urlSlug
    }

    const actualCourseId = getCourseKey(courseId)
    const course = courseContent[actualCourseId] || {
        title: 'Course Not Found',
        description: 'This course is not available.',
        modules: [],
        instructor: 'Unknown',
        duration: 'N/A',
        lessons: 0,
        level: 'Unknown'
    }

    const getCourseTitlePattern = (courseTitle) => {
        const titleMap = {
            'Agentic AI Development: From Fundamentals to Autonomous Systems': 'Agentic AI Development',
            'AI & Machine Learning': 'AI',
            'Complete MERN Stack Development': 'Complete MERN',
            'HTML for Absolute Beginners': 'HTML for Absolute Beginners'
        }
        return titleMap[courseTitle] || courseTitle
    }

    useEffect(() => {
        checkEnrollment()
    }, [courseId, user])

    const checkEnrollment = async () => {
        if (!user) {
            setEnrollmentStatus('not-enrolled')
            setLoading(false)
            return
        }

        try {
            const searchTitle = getCourseTitlePattern(course.title)
            let { data: courses } = await supabase
                .from('courses')
                .select('id, title')
                .eq('title', searchTitle)
                .limit(1)

            if (!courses || courses.length === 0) {
                const result = await supabase
                    .from('courses')
                    .select('id, title')
                    .ilike('title', `%${searchTitle}%`)
                    .limit(1)
                courses = result.data
            }

            if (!courses || courses.length === 0) {
                setEnrollmentStatus('not-enrolled')
                setLoading(false)
                return
            }

            const courseDbId = courses[0].id
            setCourseDbId(courseDbId)

            const { data: enrollment, error: enrollError } = await supabase
                .from('enrollments')
                .select('id, status')
                .eq('user_id', user.id)
                .eq('course_id', courseDbId)
                .maybeSingle()

            if (enrollError) {
                console.error('Error fetching enrollment:', enrollError)
                setEnrollmentStatus('not-enrolled')
            } else if (enrollment) {
                setEnrollmentStatus(enrollment.status)
                setEnrollmentId(enrollment.id)
            } else {
                setEnrollmentStatus('not-enrolled')
            }
        } catch (error) {
            console.error('Error checking enrollment:', error)
            setEnrollmentStatus('not-enrolled')
        } finally {
            setLoading(false)
        }
    }

    const handleEnroll = async () => {
        if (!user) {
            alert('Please sign in to enroll')
            return
        }

        try {
            const searchTitle = getCourseTitlePattern(course.title)
            let { data: courses } = await supabase
                .from('courses')
                .select('id, title')
                .eq('title', searchTitle)
                .limit(1)

            if (!courses || courses.length === 0) {
                const result = await supabase
                    .from('courses')
                    .select('id, title')
                    .ilike('title', `%${searchTitle}%`)
                    .limit(1)
                courses = result.data
            }

            if (!courses || courses.length === 0) {
                alert('Course not found in database')
                return
            }

            const courseDbId = courses[0].id
            setCourseDbId(courseDbId)

            const { data, error } = await supabase
                .from('enrollments')
                .insert([{
                    user_id: user.id,
                    course_id: courseDbId,
                    status: 'active'
                }])
                .select()

            if (error) throw error

            setEnrollmentStatus('active')
            setEnrollmentId(data[0].id)
            alert('Successfully enrolled in course!')
        } catch (error) {
            console.error('Error enrolling:', error)
            alert('Failed to enroll. Please try again.')
        }
    }

    const handleUnenroll = async () => {
        if (!user || !enrollmentId) {
            alert('Unable to unenroll')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to unenroll from this course? Your progress will be lost.'
        )

        if (!confirmed) return

        try {
            const { error } = await supabase
                .from('enrollments')
                .delete()
                .eq('id', enrollmentId)

            if (error) throw error

            setEnrollmentStatus('not-enrolled')
            setEnrollmentId(null)
            alert('Successfully unenrolled from course')
        } catch (error) {
            console.error('Error unenrolling:', error)
            alert('Failed to unenroll. Please try again.')
        }
    }

    const handleLessonClick = (lesson, moduleId) => {
        const lessonWithWeek = { ...lesson, weekNumber: moduleId }
        const lessonId = `${moduleId}-${lesson.id}`
        
        setSelectedLesson(lessonWithWeek)
        setQuizAnswers({})
        setShowQuizResults(false)
        
        // Mark lesson as in progress when opened
        markLessonInProgress(lessonId, lesson.title, lesson.type)
        
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleQuizAnswer = (questionId, answerIndex) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }))
    }

    const submitQuiz = () => {
        setShowQuizResults(true)
        
        // Calculate score and mark lesson complete if quiz passed
        const { score, total, percentage } = calculateQuizScore()
        const lessonId = `${selectedLesson.weekNumber}-${selectedLesson.id}`
        
        // Mark as complete if score is 70% or higher
        if (percentage >= 70) {
            markLessonComplete(lessonId, selectedLesson.title, 'quiz', percentage)
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const calculateQuizScore = () => {
        if (!selectedLesson?.questions) return { score: 0, total: 0, percentage: 0 }

        const total = selectedLesson.questions.length
        const score = selectedLesson.questions.reduce((acc, q, idx) => {
            return acc + (quizAnswers[idx] === q.correctAnswer ? 1 : 0)
        }, 0)
        const percentage = Math.round((score / total) * 100)

        return { score, total, percentage }
    }

    const markVideoComplete = () => {
        if (!selectedLesson) return
        
        const lessonId = `${selectedLesson.weekNumber}-${selectedLesson.id}`
        markLessonComplete(lessonId, selectedLesson.title, selectedLesson.type || 'video')
    }

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }))
    }

    const getIconForType = (type) => {
        switch (type) {
            case 'video':
                return <Video className="h-4 w-4" />
            case 'quiz':
                return <CheckCircle className="h-4 w-4" />
            case 'assignment':
                return <PenTool className="h-4 w-4" />
            case 'project':
                return <Target className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const getProgressIcon = (moduleId, lessonId) => {
        const fullLessonId = `${moduleId + 1}-${lessonId}`
        const status = getLessonStatus(fullLessonId)
        
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case 'in_progress':
                return <Play className="h-4 w-4 text-yellow-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-400" />
        }
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <BookOpen className="h-4 w-4" /> },
        { id: 'curriculum', label: 'Curriculum', icon: <FileText className="h-4 w-4" /> },
        { id: 'updates', label: 'Instructor Updates', icon: <Bell className="h-4 w-4" /> },
        { id: 'progress', label: 'Progress', icon: <Award className="h-4 w-4" /> },
        { id: 'community', label: 'Community', icon: <MessageCircle className="h-4 w-4" /> }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all font-medium text-sm sm:text-base"
                            >
                                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="hidden xs:inline">Dashboard</span>
                            </Link>
                            <div className="h-4 sm:h-6 w-px bg-gray-200 flex-shrink-0"></div>
                            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
                                {course.title}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            {user && (
                                <>
                                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <button
                                        onClick={signOut}
                                        className="p-1.5 sm:p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                                        title="Sign Out"
                                    >
                                        <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Course Header */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{course.title}</h1>
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="truncate">{course.duration}</span>
                                </span>
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span>{course.lessons} lessons</span>
                                </span>
                                <span className="flex items-center gap-1.5 sm:gap-2">
                                    <Award className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span>{course.level}</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex-shrink-0 w-full lg:w-auto">
                            {loading ? (
                                <div className="text-sm sm:text-base text-gray-500 text-center lg:text-left">Loading...</div>
                            ) : enrollmentStatus === 'not-enrolled' ? (
                                <button
                                    onClick={handleEnroll}
                                    className="w-full lg:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-all shadow-sm text-sm sm:text-base"
                                >
                                    Enroll Now
                                </button>
                            ) : (
                                <div className="flex items-center justify-center lg:justify-start gap-2 px-3 sm:px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                    <span className="font-medium text-sm sm:text-base">Enrolled</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id)
                                    setSelectedLesson(null)
                                }}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b-2 font-medium transition-all whitespace-nowrap text-xs sm:text-sm lg:text-base ${activeTab === tab.id
                                    ? 'border-accent-600 text-accent-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <span className="flex-shrink-0">{tab.icon}</span>
                                <span className="hidden xs:inline">{tab.label}</span>
                                <span className="xs:hidden">
                                    {tab.id === 'overview' && 'Info'}
                                    {tab.id === 'curriculum' && 'Lessons'}
                                    {tab.id === 'updates' && 'Updates'}
                                    {tab.id === 'progress' && 'Progress'}
                                    {tab.id === 'community' && 'Chat'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                                <p className="text-gray-600 leading-relaxed text-lg">{course.description}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {course.modules?.map((module, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700">{module.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-accent-50 to-purple-50 border border-accent-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to Start?</h3>
                                <p className="text-gray-600 mb-4">
                                    {enrollmentStatus === 'active'
                                        ? 'Head to the Curriculum tab to begin your learning journey.'
                                        : 'Enroll now to get full access to all course materials.'}
                                </p>
                                {enrollmentStatus === 'active' ? (
                                    <button
                                        onClick={() => setActiveTab('curriculum')}
                                        className="px-6 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all"
                                    >
                                        Go to Curriculum
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleEnroll}
                                        className="px-6 py-2 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all"
                                    >
                                        Enroll Now
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Curriculum Tab */}
                    {activeTab === 'curriculum' && !selectedLesson && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                                {enrollmentStatus === 'active' && (
                                    <button
                                        onClick={handleUnenroll}
                                        className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all text-sm font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Unenroll from Course
                                    </button>
                                )}
                            </div>
                            {course.modules?.map((module, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleModule(idx)}
                                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedModules[idx] ? (
                                                <ChevronDown className="h-5 w-5 text-gray-600" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5 text-gray-600" />
                                            )}
                                            <span className="font-semibold text-gray-900">{module.title}</span>
                                        </div>
                                        <span className="text-sm text-gray-600">{module.lessons?.length || 0} lessons</span>
                                    </button>
                                    {expandedModules[idx] && (
                                        <div className="p-4 space-y-2">
                                    {module.lessons?.map((lesson, lessonIdx) => {
                                        const fullLessonId = `${idx + 1}-${lesson.id}`
                                        const isCompleted = isLessonCompleted(fullLessonId)
                                        const quizScore = getQuizScore(fullLessonId)
                                        
                                        return (
                                            <button
                                                key={lessonIdx}
                                                onClick={() => handleLessonClick(lesson, idx + 1)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                                                    isCompleted 
                                                        ? 'bg-green-50 hover:bg-green-100' 
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="text-accent-600">
                                                        {getIconForType(lesson.type)}
                                                    </div>
                                                    {getProgressIcon(idx, lesson.id)}
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`text-gray-700 ${isCompleted ? 'line-through' : ''}`}>
                                                        {lesson.title}
                                                    </span>
                                                    {quizScore && (
                                                        <div className="text-sm text-green-600 font-medium">
                                                            Quiz Score: {quizScore}%
                                                        </div>
                                                    )}
                                                </div>
                                                {lesson.duration && (
                                                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Lesson */}
                    {activeTab === 'curriculum' && selectedLesson && (
                        <div>
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="flex items-center gap-2 text-accent-600 hover:text-accent-700 mb-6 font-medium"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Curriculum
                            </button>
                            <LessonNotes
                                lesson={selectedLesson}
                                onQuizAnswer={handleQuizAnswer}
                                quizAnswers={quizAnswers}
                                onSubmitQuiz={submitQuiz}
                                showQuizResults={showQuizResults}
                                quizScore={calculateQuizScore()}
                                onMarkComplete={markVideoComplete}
                                isCompleted={isLessonCompleted(`${selectedLesson.weekNumber}-${selectedLesson.id}`)}
                            />
                        </div>
                    )}

                    {/* Progress Tab */}
                    {activeTab === 'progress' && (
                        <div className="space-y-6">
                            {enrollmentStatus === 'active' ? (
                                <>
                                    <div className="text-center mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h2>
                                        <p className="text-gray-600">Track your learning journey</p>
                                    </div>

                                    {/* Progress Overview */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                                    <BookOpen className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-blue-900">
                                                        {getProgressStats().completedLessons}/{getProgressStats().totalLessons}
                                                    </div>
                                                    <div className="text-blue-700 font-medium">Lessons Completed</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                                                    <TrendingUp className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-green-900">
                                                        {getProgressStats().progressPercentage}%
                                                    </div>
                                                    <div className="text-green-700 font-medium">Progress</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                                                    <Clock className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-purple-900">
                                                        {getProgressStats().inProgress}
                                                    </div>
                                                    <div className="text-purple-700 font-medium">In Progress</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Course Progress</span>
                                            <span className="text-sm text-gray-500">{getProgressStats().progressPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className="bg-gradient-to-r from-accent-500 to-accent-600 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${getProgressStats().progressPercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Module Progress */}
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-bold text-gray-900">Module Progress</h3>
                                        {course.modules?.map((module, idx) => {
                                            const moduleCompletedCount = module.lessons?.filter(lesson => {
                                                const lessonId = `${idx + 1}-${lesson.id}`
                                                return isLessonCompleted(lessonId)
                                            }).length || 0
                                            const moduleTotalCount = module.lessons?.length || 0
                                            const moduleProgress = moduleTotalCount > 0 ? Math.round((moduleCompletedCount / moduleTotalCount) * 100) : 0

                                            return (
                                                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                                                        <span className="text-sm text-gray-500">{moduleCompletedCount}/{moduleTotalCount} lessons</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div 
                                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${moduleProgress}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-500 mt-1">{moduleProgress}%</div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                                        {Object.values(lessonProgress)
                                            .filter(progress => progress.status === 'completed')
                                            .sort((a, b) => new Date(b.completion_date) - new Date(a.completion_date))
                                            .slice(0, 5)
                                            .map((progress, idx) => (
                                                <div key={idx} className="flex items-center gap-3 py-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <span className="flex-1 text-gray-700">{progress.lesson_title}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(progress.completion_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                        {Object.values(lessonProgress).filter(p => p.status === 'completed').length === 0 && (
                                            <p className="text-gray-500 text-center py-4">No completed lessons yet. Start learning to see your progress!</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Enroll to Track Progress</h3>
                                    <p className="text-gray-600 mb-6">Enroll in this course to track your learning progress</p>
                                    <button
                                        onClick={handleEnroll}
                                        className="px-6 py-3 bg-accent-600 text-white rounded-lg font-medium hover:bg-accent-700 transition-all"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Community Tab */}
                    {activeTab === 'community' && (
                        courseDbId ? (
                            <ErrorBoundary fallbackMessage="Unable to load community chat. Please refresh the page or try again later.">
                                <CourseCommunity courseId={courseDbId} />
                            </ErrorBoundary>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Loading community...</p>
                            </div>
                        )
                    )}

                    {/* Instructor Updates Tab */}
                    {activeTab === 'updates' && (
                        courseDbId ? (
                            <InstructorUpdates courseDbId={courseDbId} />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600">Loading updates...</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            <AIAssistant courseId={courseDbId} lessonTitle={course.title} />
        </div>
    )
}

export default CoursePage
