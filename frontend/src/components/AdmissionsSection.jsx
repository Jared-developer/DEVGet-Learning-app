import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const AdmissionsSection = () => {
    const [admissions, setAdmissions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        fetchActiveAdmissions()
    }, [])

    const fetchActiveAdmissions = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('admissions')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            setAdmissions(data || [])
        } catch (err) {
            console.error('Error fetching admissions:', err)
            setError('Failed to load admissions')
        } finally {
            setLoading(false)
        }
    }

    const truncateText = (text, maxLength = 150) => {
        if (!text || text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No deadline'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const isDeadlinePassed = (deadline) => {
        if (!deadline) return false
        return new Date(deadline) < new Date()
    }

    const handleDownload = (fileUrl, fileName) => {
        window.open(fileUrl, '_blank')
    }

    if (loading) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-primary-50">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admissions...</p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-primary-50">
                <div className="max-w-7xl mx-auto text-center">
                    <AlertCircle className="h-12 w-12 text-danger-500 mx-auto mb-4" />
                    <p className="text-danger-600">{error}</p>
                </div>
            </section>
        )
    }

    if (admissions.length === 0) {
        return null // Don't show section if no admissions
    }

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 to-primary-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 rounded-full text-white text-sm font-medium mb-4">
                        <FileText className="h-4 w-4" />
                        Open Applications
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Admissions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Download application forms and apply to join our programs
                    </p>
                </div>

                {/* Admissions Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {admissions.map((admission) => {
                        const deadlinePassed = isDeadlinePassed(admission.deadline)
                        const isExpanded = expandedId === admission.id
                        const shouldTruncate = admission.description && admission.description.length > 150

                        return (
                            <div
                                key={admission.id}
                                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 duration-300"
                            >
                                {/* Cover Image */}
                                {admission.image_url && (
                                    <img
                                        src={admission.image_url}
                                        alt={admission.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}

                                <div className="p-6">
                                    {/* Icon */}
                                    <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                                        <FileText className="h-7 w-7 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {admission.title}
                                    </h3>

                                    {/* Description */}
                                    {admission.description && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600">
                                                {isExpanded ? admission.description : truncateText(admission.description)}
                                            </p>
                                            {shouldTruncate && (
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : admission.id)}
                                                    className="text-accent-600 hover:text-accent-700 text-sm font-medium mt-1"
                                                >
                                                    {isExpanded ? 'Read Less' : 'Read More'}
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Deadline */}
                                    {admission.deadline && (
                                        <div className={`flex items-center gap-2 mb-4 text-sm ${deadlinePassed ? 'text-danger-600' : 'text-gray-600'
                                            }`}>
                                            {deadlinePassed ? (
                                                <Clock className="h-4 w-4" />
                                            ) : (
                                                <Calendar className="h-4 w-4" />
                                            )}
                                            <span>
                                                {deadlinePassed ? 'Deadline passed: ' : 'Deadline: '}
                                                {formatDate(admission.deadline)}
                                            </span>
                                        </div>
                                    )}

                                    {/* File Info */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span className="text-xs text-gray-500">
                                            {admission.file_type?.toUpperCase() || 'FILE'}
                                        </span>
                                        <button
                                            onClick={() => handleDownload(admission.file_url, admission.file_name)}
                                            disabled={deadlinePassed}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${deadlinePassed
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-accent-600 to-primary-600 text-white hover:from-accent-700 hover:to-primary-700 shadow-md hover:shadow-lg'
                                                }`}
                                        >
                                            <Download className="h-4 w-4" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Info Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-600">
                        Need help with your application? <a href="/contact" className="text-accent-600 hover:text-accent-700 font-semibold">Contact us</a>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default AdmissionsSection
