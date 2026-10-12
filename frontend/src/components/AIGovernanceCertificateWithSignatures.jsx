import { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import SignatureModal from './SignatureModal';

const AIGovernanceCertificateWithSignatures = ({
    studentName = "JOHN DOE",
    completionDate = "October 11, 2026",
    courseTitle = "AI GOVERNANCE AND DIGITAL SAFETY BOOTCAMP 1.0",
    certificateId = "CERT-2026-001",
    verificationUrl = "https://devget.com/verify",
    editable = false,
    allowedSlot = null // Only this slot can be edited
}) => {
    const certificateRef = useRef(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [signatures, setSignatures] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSlot, setCurrentSlot] = useState(null);

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
                setQrCodeUrl('');
            }
        };

        generateQR();
    }, [certificateId, verificationUrl]);

    useEffect(() => {
        // Fetch existing signatures
        const fetchSignatures = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                const response = await fetch(`${apiUrl}/api/signatures/${certificateId}`);
                
                if (!response.ok) {
                    console.error('Failed to fetch signatures:', response.status);
                    return;
                }
                
                const data = await response.json();
                if (data.success) {
                    const signaturesMap = {};
                    data.signatures.forEach(sig => {
                        signaturesMap[sig.slot_number] = sig;
                    });
                    setSignatures(signaturesMap);
                }
            } catch (error) {
                console.error('Error fetching signatures:', error);
            }
        };

        fetchSignatures();
    }, [certificateId]);

    const handleAddSignature = (slotNumber) => {
        setCurrentSlot(slotNumber);
        setModalOpen(true);
    };

    const handleSignatureSubmit = async (signatureData) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/signatures`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    certificateId,
                    ...signatureData
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                alert('Server error: Failed to save signature. Please try again or contact support.');
                return;
            }

            const data = await response.json();
            if (data.success) {
                setSignatures(prev => ({
                    ...prev,
                    [signatureData.slotNumber]: data.signature
                }));
                if (signatureData.confirmed) {
                    alert('✓ Signature confirmed successfully!');
                    setModalOpen(false);
                } else {
                    alert('✓ Signature saved as draft!');
                }
            } else {
                alert('Error: ' + (data.error || 'Failed to save signature. Please try again.'));
                // Don't close modal on error - user can try again
            }
        } catch (error) {
            console.error('Error saving signature:', error);
            alert('Network error: Failed to save signature. Please check your connection and try again.');
            // Don't close modal on error - user can try again
        }
    };

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

    const renderSignatureSlot = (slotNumber) => {
        const sig = signatures[slotNumber];
        // Only allow editing if editable is true AND this is the allowed slot (or no slot restriction)
        const canEdit = editable && (!sig || !sig.confirmed) && (allowedSlot === null || allowedSlot === slotNumber);

        if (sig) {
            return (
                <div style={{ textAlign: 'center', minWidth: '120px', position: 'relative' }}>
                    <img
                        src={sig.signature}
                        alt="Signature"
                        style={{
                            height: '35px',
                            width: 'auto',
                            maxWidth: '120px',
                            marginBottom: '5px'
                        }}
                    />
                    <div style={{ height: '1.5px', background: '#0f4c5c', marginBottom: '3px' }} />
                    <p style={{ fontSize: '9px', color: '#666', margin: 0, fontWeight: '600' }}>
                        {sig.name}
                    </p>
                    <p style={{ fontSize: '8px', color: '#888', margin: '2px 0 0 0' }}>
                        {sig.title}
                    </p>
                    {canEdit && (
                        <button
                            onClick={() => handleAddSignature(slotNumber)}
                            style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                padding: '4px 8px',
                                fontSize: '10px',
                                backgroundColor: '#20b2aa',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Edit
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div style={{ textAlign: 'center', minWidth: '120px' }}>
                {canEdit ? (
                    <button
                        onClick={() => handleAddSignature(slotNumber)}
                        style={{
                            width: '100%',
                            height: '60px',
                            border: '2px dashed #20b2aa',
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            color: '#20b2aa',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>+</span>
                        <span>Add Signature</span>
                    </button>
                ) : (
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
                )}
                <div style={{ height: '1.5px', background: '#0f4c5c', marginBottom: '3px' }} />
                <p style={{ fontSize: '9px', color: '#666', margin: 0, fontWeight: '600' }}>
                    SIGNATURE {slotNumber}
                </p>
            </div>
        );
    };

    return (
        <>
            <style>{`
                .certificate-wrapper-sig {
                    transform-origin: top center;
                    width: 1056px;
                    margin: 0 auto;
                }
                
                .certificate-outer-container {
                    overflow-x: auto !important;
                    overflow-y: visible !important;
                }
                
                /* Scale certificate on smaller screens */
                @media (max-width: 1096px) {
                    .certificate-wrapper-sig {
                        transform: scale(calc((100vw - 20px) / 1056));
                    }
                }
                
                @media (max-width: 768px) {
                    .certificate-outer-container {
                        padding: 10px 5px !important;
                    }
                    
                    .certificate-wrapper-sig {
                        transform: scale(calc((100vw - 10px) / 1056));
                    }
                }
                
                @media (max-width: 480px) {
                    .certificate-wrapper-sig {
                        transform: scale(calc(100vw / 1056));
                    }
                    
                    .certificate-outer-container {
                        padding: 5px 0 !important;
                    }
                }
            `}</style>
            <div className="certificate-outer-container" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                gap: '20px',
                width: '100%',
                minHeight: '100vh',
                overflowX: 'auto',
                overflowY: 'visible',
                boxSizing: 'border-box'
            }}>
                <div
                    className="certificate-wrapper-sig"
                    style={{
                        transformOrigin: 'top center'
                    }}>
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

                        {/* Official Gold Seal */}
                        <div style={{ position: 'absolute', top: '20px', right: '40px', width: '140px', height: '140px', zIndex: 3 }}>
                            <img src="/Bootcamp_Certificates_Elements/Official_seal.png" alt="Official Seal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>

                        {/* Partner logos */}
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
                                    {renderSignatureSlot(1)}
                                    {renderSignatureSlot(2)}
                                    {renderSignatureSlot(3)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

            <SignatureModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSignatureSubmit}
                signatureData={currentSlot ? signatures[currentSlot] : null}
                slotNumber={currentSlot}
            />
        </>
    );
};

export default AIGovernanceCertificateWithSignatures;
