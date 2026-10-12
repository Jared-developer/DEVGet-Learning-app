import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const AIGovernanceCertificate = ({
    studentName = "JOHN DOE",
    completionDate = "October 11, 2026",
    courseTitle = "AI GOVERNANCE AND DIGITAL SAFETY BOOTCAMP 1.0",
    certificateId = "CERT-2026-001",
    verificationUrl = "https://devget.com/verify"
}) => {
    const certificateRef = useRef(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const generateQR = async () => {
            try {
                const url = await QRCode.toDataURL(`${verificationUrl}/${certificateId}`, {
                    width: 120,
                    margin: 1,
                    color: {
                        dark: '#0f4c5c',
                        light: '#ffffff'
                    }
                });
                setQrCodeUrl(url);
            } catch (err) {
                console.error('QR Code generation error:', err);
                // Set a placeholder or empty state
                setQrCodeUrl('');
            }
        };

        generateQR();
    }, [certificateId, verificationUrl]);

    const downloadPDF = async () => {
        if (!certificateRef.current) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 10px',
            gap: '20px',
            width: '100%',
            minHeight: '100vh',
            overflow: 'visible'
        }}>
            <div
                className="certificate-wrapper"
                style={{
                    width: '100%',
                    maxWidth: '1056px',
                    display: 'flex',
                    justifyContent: 'center',
                    transform: 'scale(1)',
                    transformOrigin: 'top center',
                    overflow: 'visible'
                }}
            >
                <div
                    ref={certificateRef}
                    style={{
                        position: 'relative',
                        width: '1056px',
                        height: '720px',
                        background: 'linear-gradient(to right, #0f4c5c 0%, #0f4c5c 4.5%, #fafafa 4.5%, #fafafa 100%)',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden',
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%23e0e0e0\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23grid)\' opacity=\'0.3\'/%3E%3C/svg%3E")',
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    {/* Left teal border */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '48px', background: '#0f4c5c' }} />

                    {/* Top circuit pattern */}
                    <div style={{ position: 'absolute', top: 0, left: '48px', right: 0, height: '150px' }}>
                        <img src="/Bootcamp_Certificates_Elements/png_topbacground.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
                    </div>

                    {/* Bottom circuit pattern */}
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '300px', height: '150px' }}>
                        <img src="/Bootcamp_Certificates_Elements/png_Footerbackground.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
                    </div>

                    {/* Official Gold Seal - top right */}
                    <div style={{ position: 'absolute', top: '20px', right: '40px', width: '140px', height: '140px', zIndex: 3 }}>
                        <img src="/Bootcamp_Certificates_Elements/Official_seal.png" alt="Official Seal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>

                    {/* Partner logos at the top - centered with white background */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 3
                    }}>
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '15px',
                            padding: '12px 25px',
                            display: 'flex',
                            gap: '25px',
                            alignItems: 'center'
                        }}>
                            <img src="/images/Partiner-logos/AI_&_STEM_Logo.jpeg" alt="AI & STEM" style={{ height: '40px', width: 'auto' }} />
                            <img src="/images/Partiner-logos/Space_Shift_logo.png" alt="SpaceShift" style={{ height: '40px', width: 'auto' }} />
                            <img src="/images/Partiner-logos/Women_IN_STEM_LOGO.jpeg" alt="Women in STEM" style={{ height: '40px', width: 'auto' }} />
                            <img src="/images/logos/updatedLogo.jpg" alt="DEVGet Learning" style={{ height: '70px', width: 'auto' }} />
                        </div>
                    </div>

                    {/* Main content */}
                    <div style={{ position: 'relative', zIndex: 2, padding: '100px 80px 40px 80px', height: '100%', display: 'flex', flexDirection: 'column' }}>

                        {/* Title */}
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h1 style={{
                                fontSize: '66px',
                                fontWeight: '700',
                                color: '#0f4c5c',
                                margin: '0',
                                letterSpacing: '8px',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                CERTIFICATE
                            </h1>
                            <div style={{
                                display: 'inline-block',
                                background: '#20b2aa',
                                color: '#ffffff',
                                padding: '6px 35px',
                                borderRadius: '25px',
                                fontSize: '22px',
                                fontWeight: '400',
                                letterSpacing: '5px',
                                marginTop: '8px'
                            }}>
                                OF ACHIEVEMENT
                            </div>
                        </div>

                        {/* Presented to */}
                        <p style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            color: '#0f4c5c',
                            letterSpacing: '3px',
                            fontWeight: '600',
                            margin: '0 0 15px 0'
                        }}>
                            THIS CERTIFICATE IS PROUDLY PRESENTED TO
                        </p>

                        {/* Student name */}
                        <h2 style={{
                            textAlign: 'center',
                            fontSize: '48px',
                            fontWeight: '700',
                            color: '#0f4c5c',
                            margin: '0 0 5px 0',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            {studentName}
                        </h2>
                        <div style={{
                            width: '420px',
                            height: '2px',
                            background: '#20b2aa',
                            margin: '0 auto 20px auto'
                        }} />

                        {/* Recognition text */}
                        <p style={{
                            textAlign: 'center',
                            fontSize: '13px',
                            color: '#666',
                            margin: '0 0 10px 0'
                        }}>
                            In recognition of successful completion of the
                        </p>

                        <h3 style={{
                            textAlign: 'center',
                            fontSize: '19px',
                            fontWeight: '700',
                            color: '#20b2aa',
                            margin: '0 0 18px 0',
                            letterSpacing: '1px'
                        }}>
                            {courseTitle}
                        </h3>

                        {/* Description */}
                        <p style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#666',
                            lineHeight: '1.5',
                            maxWidth: '720px',
                            margin: '0 auto 25px auto'
                        }}>
                            This certificate acknowledges the participant's commitment to excellence in understanding AI governance principles, ethical AI implementation, and digital safety best practices.
                        </p>

                        {/* Bottom section */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginTop: 'auto',
                            paddingBottom: '0'
                        }}>
                            {/* QR Code */}
                            <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: '100px' }}>
                                {qrCodeUrl ? (
                                    <>
                                        <img src={qrCodeUrl} alt="QR Code" style={{ width: '85px', height: '85px', border: '2px solid #0f4c5c', display: 'block', margin: '0 auto 5px auto' }} />
                                        <p style={{ fontSize: '8px', color: '#666', margin: '0', lineHeight: '1.3' }}>
                                            <strong>CERTIFICATE ID:</strong><br />{certificateId}<br /><strong>DATE OF ISSUE:</strong><br />{completionDate}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{
                                            width: '85px',
                                            height: '85px',
                                            border: '2px solid #0f4c5c',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#f0f0f0',
                                            margin: '0 auto 5px auto'
                                        }}>
                                            <span style={{ fontSize: '9px', color: '#666' }}>QR Code</span>
                                        </div>
                                        <p style={{ fontSize: '8px', color: '#666', margin: '0', lineHeight: '1.3' }}>
                                            <strong>CERTIFICATE ID:</strong><br />{certificateId}<br /><strong>DATE OF ISSUE:</strong><br />{completionDate}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Signatures */}
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'space-around',
                                gap: '15px',
                                paddingLeft: '30px',
                                paddingRight: '10px'
                            }}>
                                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{
                                        height: '35px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '5px',
                                        fontFamily: 'Brush Script MT, cursive',
                                        fontSize: '18px',
                                        color: '#0f4c5c'
                                    }}>
                                        [Signature]
                                    </div>
                                    <div style={{ height: '1.5px', background: '#0f4c5c', marginBottom: '3px' }} />
                                    <p style={{ fontSize: '9px', color: '#666', margin: 0, fontWeight: '600' }}>SIGNATURE 1</p>
                                </div>
                                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{
                                        height: '35px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '5px',
                                        fontFamily: 'Brush Script MT, cursive',
                                        fontSize: '18px',
                                        color: '#0f4c5c'
                                    }}>
                                        [Signature]
                                    </div>
                                    <div style={{ height: '1.5px', background: '#0f4c5c', marginBottom: '3px' }} />
                                    <p style={{ fontSize: '9px', color: '#666', margin: 0, fontWeight: '600' }}>SIGNATURE 2</p>
                                </div>
                                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{
                                        height: '35px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '5px',
                                        fontFamily: 'Brush Script MT, cursive',
                                        fontSize: '18px',
                                        color: '#0f4c5c'
                                    }}>
                                        [Signature]
                                    </div>
                                    <div style={{ height: '1.5px', background: '#0f4c5c', marginBottom: '3px' }} />
                                    <p style={{ fontSize: '9px', color: '#666', margin: 0, fontWeight: '600' }}>SIGNATURE 3</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .certificate-wrapper {
                    margin-bottom: 20px;
                }
                
                /* Tablet and smaller desktops */
                @media (max-width: 1100px) {
                    .certificate-wrapper {
                        transform: scale(0.95) !important;
                    }
                }
                
                @media (max-width: 1056px) {
                    .certificate-wrapper {
                        transform: scale(0.90) !important;
                    }
                }
                
                /* Tablets portrait */
                @media (max-width: 950px) {
                    .certificate-wrapper {
                        transform: scale(0.80) !important;
                    }
                }
                
                @media (max-width: 850px) {
                    .certificate-wrapper {
                        transform: scale(0.70) !important;
                    }
                }
                
                /* Mobile landscape and small tablets */
                @media (max-width: 750px) {
                    .certificate-wrapper {
                        transform: scale(0.60) !important;
                        margin-bottom: 30px;
                    }
                }
                
                @media (max-width: 650px) {
                    .certificate-wrapper {
                        transform: scale(0.52) !important;
                        margin-bottom: 40px;
                    }
                }
                
                /* Mobile portrait */
                @media (max-width: 550px) {
                    .certificate-wrapper {
                        transform: scale(0.44) !important;
                        margin-bottom: 50px;
                    }
                }
                
                @media (max-width: 470px) {
                    .certificate-wrapper {
                        transform: scale(0.38) !important;
                        margin-bottom: 60px;
                    }
                }
                
                /* Small mobile devices */
                @media (max-width: 400px) {
                    .certificate-wrapper {
                        transform: scale(0.34) !important;
                        margin-bottom: 70px;
                    }
                }
                
                @media (max-width: 360px) {
                    .certificate-wrapper {
                        transform: scale(0.31) !important;
                        margin-bottom: 80px;
                    }
                }
            `}</style>

            <button onClick={downloadPDF} style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                background: '#20b2aa',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(32, 178, 170, 0.3)',
                transition: 'all 0.2s',
                width: '100%',
                maxWidth: '300px'
            }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 5px 20px rgba(32, 178, 170, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(32, 178, 170, 0.3)';
                }}>
                Download Certificate as PDF
            </button>
        </div>
    );
};

export default AIGovernanceCertificate;
