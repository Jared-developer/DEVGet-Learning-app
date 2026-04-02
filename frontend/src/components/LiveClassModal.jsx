import { useState, useEffect } from 'react'
import { X, Video, Calendar, Clock, Users, ExternalLink, Bell, CheckCircle } from 'lucide-react'

const LiveClassModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('upcoming')
    const [sessions, setSessions] = useState({
        upcoming: [],
        past: []
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            loadSessions()
        }
    }, [isOpen])

    const loadSessions = async () => {
        setLoading(true)
        try {
            const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID

            if (!calendarId) {
                console.warn('Google Calendar ID not configured')
                setSessions({ upcoming: [], past: [] })
                setLoading(false)
                return
            }

            // Fetch events from Google Calendar public feed
            const now = new Date()
            const timeMin = now.toISOString()
            const timeMax = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days ahead

            const apiKey = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error('Failed to fetch calendar events')
            }

            const data = await response.json()
            const events = data.items || []

            // Separate upcoming and past events
            const upcoming = []
            const past = []

            events.forEach(event => {
                const startTime = new Date(event.start.dateTime || event.start.date)
                const endTime = new Date(event.end.dateTime || event.end.date)
                const duration = Math.round((endTime - startTime) / (1000 * 60)) // minutes

                const session = {
                    id: event.id,
                    title: event.summary || 'Untitled Event',
                    course: extractCourse(event.summary),
                    instructor: extractInstructor(event.description),
                    date: startTime.toISOString().split('T')[0],
                    time: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    duration: `${duration} min`,
                    meetingLink: extractMeetingLink(event.description, event.location, event.hangoutLink),
                    description: event.description || '',
                    status: startTime > now ? 'scheduled' : 'completed',
                    attendees: event.attendees?.length || 0,
                    maxAttendees: extractMaxAttendees(event.description) || 100,
                    recordingUrl: extractRecordingUrl(event.description),
                    reminder: false
                }

                if (startTime > now) {
                    upcoming.push(session)
                } else {
                    past.push(session)
                }
            })

            setSessions({ upcoming, past })
        } catch (error) {
            console.error('Error loading calendar events:', error)
            setSessions({ upcoming: [], past: [] })
        } finally {
            setLoading(false)
        }
    }

    // Helper functions to extract information from event data
    const extractCourse = (summary) => {
        // Extract course from format: [COURSE] Topic - Instructor
        const match = summary?.match(/\[(.*?)\]/)
        return match ? match[1] : 'General'
    }

    const extractInstructor = (description) => {
        // Extract instructor from description
        const match = description?.match(/Instructor:\s*(.+?)(?:\n|$)/i)
        return match ? match[1].trim() : 'DEVGet Learning Team'
    }

    const extractMeetingLink = (description, location, hangoutLink) => {
        // Try to find meeting link in description
        const urlMatch = description?.match(/(https?:\/\/[^\s]+(?:zoom|meet|teams)[^\s]*)/i)
        if (urlMatch) return urlMatch[1]

        // Check location field
        if (location && location.startsWith('http')) return location

        // Check hangout link
        if (hangoutLink) return hangoutLink

        return null
    }

    const extractMaxAttendees = (description) => {
        const match = description?.match(/Max\s*Attendees?:\s*(\d+)/i)
        return match ? parseInt(match[1]) : null
    }

    const extractRecordingUrl = (description) => {
        const match = description?.match(/Recording:\s*(https?:\/\/[^\s]+)/i)
        return match ? match[1] : null
    }

    const handleJoinSession = (session) => {
        window.open(session.meetingLink, '_blank')
    }

    const handleWatchRecording = (session) => {
        window.open(session.recordingUrl, '_blank')
    }

    const handleAddToCalendar = (session) => {
        // Create Google Calendar event URL
        const startDate = new Date(`${session.date}T${session.time}`)
        const durationMinutes = parseInt(session.duration)
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

        // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
        }

        const calendarUrl = new URL('https://calendar.google.com/calendar/render')
        calendarUrl.searchParams.append('action', 'TEMPLATE')
        calendarUrl.searchParams.append('text', session.title)
        calendarUrl.searchParams.append('details', `${session.course}\n\nInstructor: ${session.instructor}\n\nJoin: ${session.meetingLink}`)
        calendarUrl.searchParams.append('dates', `${formatDate(startDate)}/${formatDate(endDate)}`)
        calendarUrl.searchParams.append('location', session.meetingLink)

        window.open(calendarUrl.toString(), '_blank')
    }

    const toggleReminder = (sessionId) => {
        setSessions(prev => ({
            ...prev,
            upcoming: prev.upcoming.map(s =>
                s.id === sessionId ? { ...s, reminder: !s.reminder } : s
            )
        }))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Video className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">Live Class Sessions</h2>
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
                            onClick={() => setActiveTab('upcoming')}
                            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'upcoming'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Upcoming Sessions
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`py-4 px-2 border-b-2 font-medium transition-colors ${activeTab === 'past'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Past Sessions
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Calendar Subscription Info */}
                    <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-primary-900 mb-2">View All Scheduled Events</h4>
                                <p className="text-sm text-primary-700 mb-3">
                                    Subscribe to our calendar to see all live classes, project deadlines, and important events.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={import.meta.env.VITE_GOOGLE_CALENDAR_PUBLIC_URL || 'https://calendar.google.com'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        <span>View Full Calendar</span>
                                    </a>
                                    <button
                                        onClick={() => {
                                            const calendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID || ''
                                            const icalUrl = `https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`
                                            navigator.clipboard.writeText(icalUrl)
                                            alert('Calendar subscription URL copied! Paste it in your calendar app to subscribe.')
                                        }}
                                        className="inline-flex items-center space-x-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors text-sm"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        <span>Copy Subscribe URL</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeTab === 'upcoming' && (
                                <>
                                    {sessions.upcoming.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Sessions</h3>
                                            <p className="text-gray-600">Check back later for scheduled live classes</p>
                                        </div>
                                    ) : (
                                        sessions.upcoming.map((session) => (
                                            <div
                                                key={session.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {session.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mb-3">{session.course}</p>

                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{new Date(session.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{session.time} ({session.duration})</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Users className="h-4 w-4" />
                                                                <span>{session.attendees}/{session.maxAttendees} attendees</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Video className="h-4 w-4" />
                                                                <span>{session.instructor}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        {session.meetingLink && (
                                                            <button
                                                                onClick={() => handleJoinSession(session)}
                                                                className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors whitespace-nowrap"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                                <span>Join Session</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleAddToCalendar(session)}
                                                            className="flex items-center space-x-2 px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                                                        >
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Add to Calendar</span>
                                                        </button>
                                                        <button
                                                            onClick={() => toggleReminder(session.id)}
                                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${session.reminder
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <Bell className="h-4 w-4" />
                                                            <span>{session.reminder ? 'Reminder On' : 'Set Reminder'}</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                        <span>Seats filled</span>
                                                        <span>{Math.round((session.attendees / session.maxAttendees) * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-accent-600 h-2 rounded-full transition-all"
                                                            style={{ width: `${(session.attendees / session.maxAttendees) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}

                            {activeTab === 'past' && (
                                <>
                                    {sessions.past.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Past Sessions</h3>
                                            <p className="text-gray-600">Your attended sessions will appear here</p>
                                        </div>
                                    ) : (
                                        sessions.past.map((session) => (
                                            <div
                                                key={session.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gray-50"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {session.title}
                                                            </h3>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{session.course}</p>

                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>{new Date(session.date).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-gray-600">
                                                                <Users className="h-4 w-4" />
                                                                <span>{session.attendees} attended</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {session.recordingUrl && (
                                                        <button
                                                            onClick={() => handleWatchRecording(session)}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors ml-4"
                                                        >
                                                            <Video className="h-4 w-4" />
                                                            <span>Watch Recording</span>
                                                        </button>
                                                    )}
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

export default LiveClassModal
