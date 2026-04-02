import { useState, useEffect } from 'react'
import { X, FileText, Calendar, Clock, CheckCircle, AlertCircle, ExternalLink, Github } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const AssignmentsModal = ({ isOpen, onClose }) => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('pending')
    const [assignments, setAssignments] = useState({
        pending: [],
        submitted: [],
        graded: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && user) {
            loadAssignments()
        }
    }, [isOpen, user])

    const loadAssignments = async () => {
        setLoading(true)
        try {
            // Get user's enrolled courses
            const { data: enrollments, error: enrollError } = await supabase
                .from('enrollments')
                .select('course_id')
                .eq('user_id', user.id)
                .eq('status', 'active')

            if (enrollError) {
                console.error('Error loading enrollments:', enrollError)
                // If table doesn't exist, show empty state
                if (enrollError.code === '42P01') {
                    setAssignments({ pending: [], submitted: [], graded: [] })
                    setLoading(false)
                    return
                }
                throw enrollError
            }

            if (!enrollments || enrollments.length === 0) {
                setAssignments({ pending: [], submitted: [], graded: [] })
                setLoading(false)
                return
            }

            const courseIds = enrollments.map(e => e.course_id)

            // Get all assignments for enrolled courses
            const { data: allAssignments, error: assignError } = await supabase
                .from('assignments')
                .select(`
                    *,
                    course:courses (
                        id,
                        title
                    )
                `)
                .in('course_id', courseIds)
                .order('week_number', { ascending: true })

            if (assignError) {
                console.error('Error loading assignments:', assignError)
                // If table doesn't exist, show empty state
                if (assignError.code === '42P01') {
                    setAssignments({ pending: [], submitted: [], graded: [] })
                    setLoading(false)
                    return
                }
                throw assignError
            }

            // Get user's submissions
            const { data: submissions, error: subError } = await supabase
                .from('assignment_submissions')
                .select('*')
                .eq('user_id', user.id)

            if (subError) {
                console.error('Error loading submissions:', subError)
                // If table doesn't exist, continue without submissions
                if (subError.code === '42P01') {
                    // Just show all assignments as pending
                    const pending = (allAssignments || []).map(assignment => ({
                        id: assignment.id,
                        title: assignment.title,
                        course: assignment.course?.title || 'Unknown Course',
                        description: assignment.description,
                        points: assignment.points,
                        weekNumber: assignment.week_number,
                        dueDate: assignment.due_date,
                        priority: 'medium'
                    }))
                    setAssignments({ pending, submitted: [], graded: [] })
                    setLoading(false)
                    return
                }
            }

            // Create a map of submissions by assignment_id
            const submissionMap = {}
            if (submissions) {
                submissions.forEach(sub => {
                    submissionMap[sub.assignment_id] = sub
                })
            }

            // Categorize assignments
            const pending = []
            const submitted = []
            const graded = []

            if (allAssignments) {
                allAssignments.forEach(assignment => {
                    const submission = submissionMap[assignment.id]

                    if (!submission) {
                        pending.push({
                            id: assignment.id,
                            title: assignment.title,
                            course: assignment.course?.title || 'Unknown Course',
                            description: assignment.description,
                            points: assignment.points,
                            weekNumber: assignment.week_number,
                            dueDate: assignment.due_date,
                            priority: 'medium'
                        })
                    } else if (submission.status === 'graded') {
                        graded.push({
                            id: assignment.id,
                            title: assignment.title,
                            course: assignment.course?.title || 'Unknown Course',
                            points: assignment.points,
                            score: submission.score,
                            feedback: submission.feedback,
                            submittedDate: submission.submitted_at,
                            gradedDate: submission.graded_at,
                            githubUrl: submission.github_url,
                            status: 'graded'
                        })
                    } else {
                        submitted.push({
                            id: assignment.id,
                            title: assignment.title,
                            course: assignment.course?.title || 'Unknown Course',
                            points: assignment.points,
                            submittedDate: submission.submitted_at,
                            githubUrl: submission.github_url,
                            status: 'submitted'
                        })
                    }
                })
            }

            setAssignments({ pending, submitted, graded })
        } catch (error) {
            console.error('Error loading assignments:', error)
            setAssignments({ pending: [], submitted: [], graded: [] })
        } finally {
            setLoading(false)
        }
    }

    const getDaysUntilDue = (dueDate) => {
        if (!dueDate) return null
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-accent-600 to-accent-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">Final Projects</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 px-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'pending'
                                ? 'border-accent-600 text-accent-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Pending ({assignments.pending.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('submitted')}
                            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'submitted'
                                ? 'border-accent-600 text-accent-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Submitted ({assignments.submitted.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('graded')}
                            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'graded'
                                ? 'border-accent-600 text-accent-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Graded ({assignments.graded.length})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Pending Assignments */}
                            {activeTab === 'pending' && (
                                <>
                                    {assignments.pending.length === 0 ? (
                                        <div className="text-center py-12">
                                            <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Projects</h3>
                                            <p className="text-gray-600">All optional final projects are up to date</p>
                                        </div>
                                    ) : (
                                        assignments.pending.map((assignment) => {
                                            const daysUntilDue = assignment.dueDate ? getDaysUntilDue(assignment.dueDate) : null
                                            return (
                                                <div
                                                    key={assignment.id}
                                                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {assignment.title}
                                                                </h3>
                                                                <span className="px-2 py-1 text-xs font-medium rounded-full border bg-accent-50 text-accent-700 border-accent-200">
                                                                    Week {assignment.weekNumber}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 mb-3">{assignment.course}</p>
                                                            {assignment.description && (
                                                                <p className="text-sm text-gray-700 mb-4">{assignment.description}</p>
                                                            )}

                                                            <div className="flex items-center space-x-6 text-sm">
                                                                {assignment.dueDate && (
                                                                    <div className="flex items-center space-x-2">
                                                                        <Calendar className="h-4 w-4 text-gray-500" />
                                                                        <span className={daysUntilDue !== null && daysUntilDue <= 2 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                                                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                                            {daysUntilDue !== null && daysUntilDue >= 0 && ` (${daysUntilDue} days left)`}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center space-x-2 text-gray-600">
                                                                    <FileText className="h-4 w-4" />
                                                                    <span>{assignment.points} points</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="ml-4">
                                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                                                                Not Submitted
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2 p-3 bg-accent-50 border border-accent-200 rounded-lg text-sm text-accent-700">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span>Optional: Submit this final project from the course page (Week {assignment.weekNumber})</span>
                                                    </div>

                                                    {daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0 && (
                                                        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mt-2">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span>Due soon! Submit before the deadline.</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })
                                    )}
                                </>
                            )}

                            {/* Submitted Assignments */}
                            {activeTab === 'submitted' && (
                                <>
                                    {assignments.submitted.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Submitted Assignments</h3>
                                            <p className="text-gray-600">Your submitted assignments will appear here</p>
                                        </div>
                                    ) : (
                                        assignments.submitted.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-accent-50"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Clock className="h-5 w-5 text-accent-600" />
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {assignment.title}
                                                            </h3>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{assignment.course}</p>

                                                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>Submitted: {new Date(assignment.submittedDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <FileText className="h-4 w-4" />
                                                                <span>{assignment.points} points</span>
                                                            </div>
                                                        </div>

                                                        {assignment.githubUrl && (
                                                            <a
                                                                href={assignment.githubUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center space-x-2 text-sm text-accent-600 hover:text-accent-700"
                                                            >
                                                                <Github className="h-4 w-4" />
                                                                <span>View on GitHub</span>
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <span className="px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded-full">
                                                            Under Review
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}

                            {/* Graded Assignments */}
                            {activeTab === 'graded' && (
                                <>
                                    {assignments.graded.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Graded Assignments</h3>
                                            <p className="text-gray-600">Your graded assignments will appear here</p>
                                        </div>
                                    ) : (
                                        assignments.graded.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-green-50"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {assignment.title}
                                                            </h3>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{assignment.course}</p>

                                                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>Graded: {new Date(assignment.gradedDate).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        {assignment.githubUrl && (
                                                            <a
                                                                href={assignment.githubUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center space-x-2 text-sm text-accent-600 hover:text-accent-700 mb-4"
                                                            >
                                                                <Github className="h-4 w-4" />
                                                                <span>View on GitHub</span>
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        )}

                                                        {assignment.feedback && (
                                                            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                                <h4 className="font-semibold text-gray-900 mb-2">Instructor Feedback:</h4>
                                                                <p className="text-sm text-gray-700">{assignment.feedback}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="ml-4 text-center">
                                                        <div className="text-3xl font-bold text-green-600 mb-1">
                                                            {assignment.score}/{assignment.points}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {Math.round((assignment.score / assignment.points) * 100)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AssignmentsModal
