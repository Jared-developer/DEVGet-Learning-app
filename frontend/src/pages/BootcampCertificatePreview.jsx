import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Download, Share2, ArrowLeft, Linkedin } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import AIGovernanceCertificateWithSignatures from '../components/AIGovernanceCertificateWithSignatures';

const BootcampCertificatePreview = () => {
    const { certificateId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const certificateRef = useRef(null);

    useEffect(() => {
        if (user) {
            loadCertificate();
        }
    }, [certificateId, user]);

    const loadCertificate = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            
            // Load certificate data
            const response = await fetch(`${apiUrl}/api/certificate-recipients/${certificateId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    setError('Certificate not found');
                } else {
                    setError('Failed to load certificate');
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            
            if (!data.success) {
                setError('Failed to load certificate');
                setLoading(false);
                return;
            }

            // Verify this certificate belongs to the current user
            if (data.certificate.user_id !== user.id) {
                setError('You do not have access to this certificate');
                setLoading(false);
                return;
            }

            setCertificate(data.certificate);
            setLoading(false);

        } catch (error) {
            console.error('Error loading certificate:', error);
            setError('Failed to load certificate');
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!certificateRef.current || downloading) return;

        setDownloading(true);
        try {
            const element = certificateRef.current.querySelector('.certificate-wrapper-sig');
            if (!element) {
                alert('Certificate not ready for download');
                setDownloading(false);
                return;
            }

            // Get the actual certificate div (not the wrapper)
            const certificateDiv = element.querySelector('[style*="width: 1056px"]');
            if (!certificateDiv) {
                alert('Certificate element not found');
                setDownloading(false);
                return;
            }

            // Temporarily remove transform from wrapper
            const originalTransform = element.style.transform;
            element.style.transform = 'none';

            const canvas = await html2canvas(certificateDiv, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                logging: false,
                width: 1056,
                height: 720,
                windowWidth: 1056,
                windowHeight: 720
            });

            // Restore transform
            element.style.transform = originalTransform;

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${certificate.recipient_name.replace(/\s+/g, '_')}_${certificateId}_Certificate.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleShareLinkedIn = () => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(`I'm proud to have completed the AI Governance Bootcamp 1.0!`);
        const summary = encodeURIComponent(
            `I've successfully completed the AI Governance and Digital Safety Bootcamp, gaining expertise in ethical AI implementation and digital safety best practices.`
        );
        
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };

    const handleShareX = () => {
        const text = encodeURIComponent(
            `🎓 I'm proud to have completed the AI Governance Bootcamp 1.0! Gained expertise in ethical AI implementation and digital safety. #AIGovernance #DigitalSafety #DEVGetLearning`
        );
        const url = encodeURIComponent(window.location.href);
        
        const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(xUrl, '_blank', 'width=600,height=600');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your certificate...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span>Back to Dashboard</span>
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={downloading}
                                className="flex items-center gap-2 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download className="h-4 w-4" />
                                <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
                            </button>
                            
                            <button
                                onClick={handleShareLinkedIn}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
                            >
                                <Linkedin className="h-4 w-4" />
                                <span className="hidden sm:inline">LinkedIn</span>
                            </button>
                            
                            <button
                                onClick={handleShareX}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Share on X</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Display */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Your Certificate
                    </h1>
                    <p className="text-gray-600">
                        AI Governance Bootcamp 1.0 - Certificate ID: {certificateId}
                    </p>
                </div>

                <div ref={certificateRef}>
                    <AIGovernanceCertificateWithSignatures
                        studentName={certificate.recipient_name.toUpperCase()}
                        completionDate={certificate.completion_date || new Date(certificate.issued_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        courseTitle="AI GOVERNANCE AND DIGITAL SAFETY BOOTCAMP 1.0"
                        certificateId={certificate.certificate_id}
                        verificationUrl={window.location.origin + '/verify'}
                        editable={false}
                    />
                </div>

                {/* Action Buttons (Mobile Friendly) */}
                <div className="mt-8 flex flex-col sm:hidden gap-3 max-w-md mx-auto">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50"
                    >
                        <Download className="h-5 w-5" />
                        <span>{downloading ? 'Downloading...' : 'Download as PDF'}</span>
                    </button>
                    
                    <button
                        onClick={handleShareLinkedIn}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
                    >
                        <Linkedin className="h-5 w-5" />
                        <span>Share on LinkedIn</span>
                    </button>
                    
                    <button
                        onClick={handleShareX}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Share2 className="h-5 w-5" />
                        <span>Share on X (Twitter)</span>
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-8 max-w-3xl mx-auto">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">🎉 Congratulations!</h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            You've successfully completed the AI Governance and Digital Safety Bootcamp 1.0. 
                            This certificate acknowledges your commitment to excellence in understanding AI governance 
                            principles, ethical AI implementation, and digital safety best practices.
                        </p>
                        <p className="text-blue-800 text-sm mt-3">
                            <strong>What's Next?</strong> Share your achievement on LinkedIn and X to showcase 
                            your expertise to your professional network. Download the PDF to include in your portfolio or resume.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BootcampCertificatePreview;
