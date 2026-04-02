import { useState, useEffect } from 'react'
import { Github, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const AssignmentSubmission = ({ courseId, weekNumber, courseName }) => {
    const { user } = useAuth()
    const [assignment, setAssignment] = useState(null)
    const [submission, setSubmission] = useState(null)
    const [githubUrl, setGithubUrl] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (user && courseId && weekNumber) {
            loadAssignmentAndSubmission()
        }
    }, [user, courseId, weekNumber])

    const loadAssignmentAndSubmission = async () => {
        setLoading(true)
        try {
            // Load assignment
            const { data: assignmentData, error: assignmentError } = await supabase
                .from('assignments')
                .select('*')
                .eq('course_id', courseId)
                .eq('week_number', weekNumber)
                .single()

            if (assignmentError && assignmentError.code !== 'PGRST116') {
                throw assignmentError
            }

            setAssignment(assignmentData)

            // Load existing submission if assignment exists
            if (assignmentData && user) {
                const { data: submissionData, error: submissionError } = await supabase
                    .from('assignment_submissions')
                    .select('*')
                    .eq('assignment_id', assignmentData.id)
                    .eq('user_id', user.id)
                    .single()

                if (submissionError && submissionError.code !== 'PGRST116') {
                    throw submissionError
                }

                if (submissionData) {
                    setSubmission(submissionData)
                    setGithubUrl(submissionData.github_url)
                    setNotes(submissionData.notes || '')
                }
            }
        } catch (err) {
            console.error('Error loading assignment:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setSubmitting(true)

        try {
            // Validate GitHub URL
            const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/.+/i
            if (!githubUrlPattern.test(githubUrl)) {
                throw new Error('Please provide a valid GitHub URL')
            }

            if (submission) {
                // Update existing submission
                const { error: updateError } = await supabase
                    .from('assignment_submissions')
                    .update({
                        github_url: githubUrl,
                        notes: notes || null,
                        submitted_at: new Date().toISOString()
                    })
                    .eq('id', submission.id)

                if (updateError) throw updateError
            } else {
                // Create new submission
                const { error: insertError } = await supabase
                    .from('assignment_submissions')
                    .insert([{
                        assignment_id: assignment.id,
                        user_id: user.id,
                        github_url: githubUrl,
                        notes: notes || null,
                        status: 'submitted'
                    }])

                if (insertError) throw insertError
            }

            setSuccess(true)
            await loadAssignmentAndSubmission()

            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err.message || 'Failed to submit assignment')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!assignment) {
        return null
    }

    return (
        <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl border-2 border-accent-200 p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent-600 rounded-xl flex items-center justify-center">
                        <Github className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-bold text-primary-900">{assignment.title}</h3>
                            <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                                Optional
                            </span>
                        </div>
                        <p className="text-sm text-primary-600">Week {weekNumber} Final Project • {assignment.points} points</p>
                    </div>
                </div>
                {submission && (
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${submission.status === 'graded'
                        ? 'bg-success-100 text-success-700'
                        : submission.status === 'submitted'
                            ? 'bg-accent-100 text-accent-700'
                            : 'bg-primary-100 text-primary-700'
                        }`}>
                        {submission.status === 'graded' ? `Graded: ${submission.score}/${assignment.points}` : 'Submitted'}
                    </span>
                )}
            </div>

            {assignment.description && (
                <p className="text-primary-700 mb-6">{assignment.description}</p>
            )}

            {submission && submission.status === 'graded' && submission.feedback && (
                <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
                    <h4 className="font-semibold text-success-900 mb-2 flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Instructor Feedback
                    </h4>
                    <p className="text-sm text-success-800">{submission.feedback}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                        GitHub Repository URL *
                    </label>
                    <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-400" />
                        <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username/repository"
                            required
                            disabled={submission?.status === 'graded'}
                            className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-primary-100 disabled:cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-primary-500 mt-1">
                        Make sure your repository is public so instructors can review it
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any additional information about your submission..."
                        rows={3}
                        disabled={submission?.status === 'graded'}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-primary-100 disabled:cursor-not-allowed"
                    />
                </div>

                {error && (
                    <div className="flex items-center space-x-2 p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {success && (
                    <div className="flex items-center space-x-2 p-3 bg-success-50 border border-success-200 rounded-lg text-success-700">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm">Assignment {submission ? 'updated' : 'submitted'} successfully!</span>
                    </div>
                )}

                <div className="flex items-center space-x-3">
                    {submission?.status !== 'graded' && (
                        <button
                            type="submit"
                            disabled={submitting || !githubUrl}
                            className="flex-1 flex items-center justify-center space-x-2 bg-accent-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                            <span>{submitting ? 'Submitting...' : submission ? 'Update Submission' : 'Submit Assignment'}</span>
                        </button>
                    )}

                    {submission && (
                        <a
                            href={submission.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-6 py-3 border-2 border-accent-600 text-accent-600 rounded-lg font-semibold hover:bg-accent-50 transition-colors"
                        >
                            <ExternalLink className="h-5 w-5" />
                            <span>View Submission</span>
                        </a>
                    )}
                </div>

                {submission && (
                    <p className="text-xs text-primary-500 text-center">
                        Submitted on {new Date(submission.submitted_at).toLocaleDateString()} at {new Date(submission.submitted_at).toLocaleTimeString()}
                    </p>
                )}
            </form>
        </div>
    )
}

export default AssignmentSubmission
