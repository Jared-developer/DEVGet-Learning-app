import { useState, useEffect } from 'react'
import { X, Award, Download, Share2, Calendar, CheckCircle, ExternalLink, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const CertificatesModal = ({ isOpen, onClose, user }) => {
    const [certificates, setCertificates] = useState([])
    const [bootcampCertificates, setBootcampCertificates] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Bootcamp definitions
    const bootcamps = {
        'ai-governance-bootcamp-1.0': {
            title: 'AI GOVERNANCE BOOTCAMP 1.0',
            description: 'AI Governance and Digital Safety',
            color: 'from-purple-500 to-purple-700'
        }
    }

    useEffect(() => {
        if (isOpen && user) {
            loadCertificates()
            loadBootcampCertificates()
        }
    }, [isOpen, user])

    const loadBootcampCertificates = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || ''
            const response = await fetch(`${apiUrl}/api/certificate-recipients/user/${user.id}`)

            if (!response.ok) {
                console.error('Error loading bootcamp certificates')
                return
            }

            const data = await response.json()
            if (data.success) {
                setBootcampCertificates(data.certificates || [])
            }
        } catch (error) {
            console.error('Error loading bootcamp certificates:', error)
            setBootcampCertificates([])
        }
    }

    const loadCertificates = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('certificates')
                .select(`
                    *,
                    course:courses (
                        id,
                        title,
                        description,
                        instructor
                    )
                `)
                .eq('user_id', user.id)
                .order('issued_at', { ascending: false })

            if (error) {
                console.error('Error loading certificates:', error)
                // If table doesn't exist, show empty state
                if (error.code === '42P01') {
                    setCertificates([])
                    setLoading(false)
                    return
                }
                throw error
            }

            setCertificates(data || [])
        } catch (error) {
            console.error('Error loading certificates:', error)
            setCertificates([])
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = (certificate) => {
        console.log('Downloading certificate:', certificate.certificateId)
        // Implement download logic
    }

    const handleShare = (certificate) => {
        console.log('Sharing certificate:', certificate.certificateId)
        // Implement share logic
    }

    const handleViewBootcampCertificate = (certificate) => {
        // Navigate to certificate preview page
        navigate(`/certificate/${certificate.certificate_id}`)
        onClose()
    }

    if (!isOpen) return null

    const hasAnyCertificates = certificates.length > 0 || bootcampCertificates.length > 0

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-accent-600 to-accent-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Award className="h-6 w-6" />
                        <h2 className="text-2xl font-bold">My Certificates</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
                        </div>
                    ) : !hasAnyCertificates ? (
                        <div className="text-center py-12">
                            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
                            <p className="text-gray-600">Complete courses and bootcamps to earn certificates</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Bootcamp Certificates Section */}
                            {bootcampCertificates.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-purple-600" />
                                        Bootcamp Certificates
                                    </h3>
                                    <div className="space-y-4">
                                        {bootcampCertificates.map((cert) => {
                                            const bootcamp = bootcamps[cert.bootcamp_id] || {
                                                title: cert.bootcamp_id,
                                                description: 'Bootcamp Certificate',
                                                color: 'from-gray-500 to-gray-700'
                                            }

                                            return (
                                                <div
                                                    key={cert.id}
                                                    className={`border-2 border-purple-200 rounded-xl p-6 bg-gradient-to-br ${bootcamp.color} text-white shadow-lg hover:shadow-xl transition-all`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-3">
                                                                <Award className="h-6 w-6" />
                                                                <h4 className="text-xl font-bold">
                                                                    {bootcamp.title}
                                                                </h4>
                                                            </div>

                                                            <div className="space-y-2 text-sm opacity-90">
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <CheckCircle className="h-4 w-4" />
                                                                    <span className="font-mono text-xs bg-white/20 px-2 py-1 rounded">
                                                                        {cert.certificate_id}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm mt-2">
                                                                    Awarded to: {cert.recipient_name}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleViewBootcampCertificate(cert)}
                                                            className="flex items-center space-x-2 px-4 py-3 bg-white text-purple-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold shadow-md"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span>View Certificate</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Course Certificates Section */}
                            {certificates.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-accent-600" />
                                        Course Certificates
                                    </h3>
                                    <div className="space-y-4">
                                        {certificates.map((cert) => (
                                            <div
                                                key={cert.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <Award className="h-5 w-5 text-accent-600" />
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {cert.course.title}
                                                            </h3>
                                                        </div>

                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="h-4 w-4" />
                                                                <span>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <span className="font-mono text-xs">{cert.certificate_number}</span>
                                                            </div>
                                                            {cert.grade && (
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-semibold">Grade: {cert.grade}</span>
                                                                    {cert.score && <span>({cert.score}%)</span>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        <button
                                                            onClick={() => handleDownload(cert)}
                                                            className="flex items-center space-x-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            <span>Download</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(cert)}
                                                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                            <span>Share</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Certificate Preview */}
                                                <div className="mt-4 p-4 bg-white border-2 border-accent-200 rounded-lg">
                                                    <div className="text-center">
                                                        <div className="text-xs text-gray-500 mb-2">CERTIFICATE OF COMPLETION</div>
                                                        <div className="text-sm font-semibold text-gray-900 mb-1">{cert.course.title}</div>
                                                        <div className="text-xs text-gray-600">
                                                            Awarded to {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Student'}
                                                        </div>
                                                        {cert.grade && (
                                                            <div className="text-xs text-gray-600 mt-1">
                                                                Grade: {cert.grade}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Share Your Achievement</h4>
                                <p className="text-sm text-blue-700">
                                    Add your certificates to LinkedIn, share on social media, or include them in your resume.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CertificatesModal
