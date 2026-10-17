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
    allowedSlot = null, // Only this slot can be edited
    useDefaultSignatures = true // Use signatures from CERT-2026-001 for all certificates
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
        // Fetch signatures from CERT-2026-001 (master certificate) for all certificates
        const fetchSignatures = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || '';
                // Always fetch from CERT-2026-001 regardless of current certificate ID
                const masterCertId = 'CERT-2026-001';
                const url = `${apiUrl}/api/signatures/${masterCertId}`;
                console.log('🔍 Fetching master signatures from:', url);
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    console.error('❌ Failed to fetch signatures:', response.status, response.statusText);
                    return;
                }
                
                const data = await response.json();
                console.log('📝 Signatures response:', data);
                
                if (data.success && data.signatures.length > 0) {
                    const signaturesMap = {};
                    data.signatures.forEach(sig => {
                        signaturesMap[sig.slot_number] = sig;
                    });
                    console.log('✅ Loaded master signatures for all certificates:', signaturesMap);
                    setSignatures(signaturesMap);
                } else {
                    console.warn('⚠️ No signatures found in master certificate:', masterCertId);
                }
            } catch (error) {
                console.error('❌ Error fetching signatures:', error);
            }
        };

        if (useDefaultSignatures) {
            fetchSignatures();
        }
    }, [useDefaultSignatures]);

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
            // Find the wrapper and temporarily remove transform
            const wrapper = certificateRef.current.closest('.certificate-wrapper-sig');
            const savedTransform = wrapper ? wrapper.style.transform : null;
            const savedTransformOrigin = wrapper ? wrapper.style.transformOrigin : null;
            
            if (wrapper) {
                wrapper.style.transform = 'none';
                wrapper.style.transformOrigin = 'initial';
            }

            // Wait for DOM update
            await new Promise(resolve => setTimeout(resolve, 100));

            // Use very high scale (4x) for maximum quality - crisp text and clear images
            const canvas = await html2canvas(certificateRef.current, {
                scale: 4,
                backgroundColor: '#ffffff',
                useCORS: true,
                allowTaint: true,
                width: 1056,
                height: 720,
                windowWidth: 1056,
                windowHeight: 720,
                logging: false,
                imageTimeout: 0
            });

            // Restore transforms
            if (wrapper) {
                wrapper.style.transform = savedTransform || '';
                wrapper.style.transformOrigin = savedTransformOrigin || '';
            }

            // Convert to high quality PNG
            const imgData = canvas.toDataURL('image/png', 1.0);
            
            // Create PDF with A4 landscape dimensions but high DPI
            // A4 landscape: 297mm x 210mm = 11.69in x 8.27in
            // At 150 DPI: 1754px x 1240px
            const pdfWidth = 297; // mm
            const pdfHeight = 210; // mm
            
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
                compress: false
            });

            // Add the high-resolution image to fill the entire page
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            pdf.save(`${studentName.replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const renderSignatureSlot = (slotNumber) => {
        const sig = signatures[slotNumber];
        // Only allow editing if editable is true AND this is the allowed slot (or no slot restriction)
        const canEdit = editable && (!sig || !sig.confirmed) && (allowedSlot === null || allowedSlot === slotNumber);
        
        // First signature is larger
        const isFirstSlot = slotNumber === 1;
        const signatureHeight = isFirstSlot ? '65px' : '35px';
        const signatureMaxWidth = isFirstSlot ? '200px' : '120px';
        const containerMinWidth = isFirstSlot ? '180px' : '120px';
        const marginBottom = isFirstSlot ? '0px' : '5px';

        if (sig) {
            return (
                <div style={{ textAlign: 'center', minWidth: containerMinWidth, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <img
                        src={sig.signature}
                        alt="Signature"
                        style={{
                            height: signatureHeight,
                            width: 'auto',
                            maxWidth: signatureMaxWidth,
                            marginBottom: marginBottom,
                            objectFit: 'contain',
                            display: 'block',
                            margin: '0 auto'
                        }}
                    />
                    <div style={{ height: '1.5px', background: '#0f4c5c', marginTop: '1px', marginBottom: '3px' }} />
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
            <div style={{ textAlign: 'center', minWidth: containerMinWidth }}>
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
                        height: signatureHeight,
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
                            background: '#fafafa',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Left teal border */}
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '48px', background: '#0f4c5c', zIndex: 1 }} />

                        {/* Top circuit pattern */}
                        <div style={{ position: 'absolute', top: 0, left: '48px', right: 0, height: '150px', zIndex: 1 }}>
                            <img src="/Bootcamp_Certificates_Elements/png_topbacground.png" alt="" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
                        </div>

                        {/* Bottom circuit pattern */}
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '300px', height: '150px', zIndex: 1 }}>
                            <img src="/Bootcamp_Certificates_Elements/png_Footerbackground.png" alt="" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15 }} />
                        </div>

                        {/* Badge in top right corner */}
                        <div style={{ 
                            position: 'absolute', 
                            top: '20px', 
                            right: '25px', 
                            width: '170px', 
                            height: '200px', 
                            zIndex: 4
                        }}>
                            <img 
                                src="/Bootcamp_Certificates_Elements/TopRightConnerBadge.png" 
                                alt="Badge"
                                crossOrigin="anonymous"
                                style={{ 
                                    width: '170px', 
                                    height: '200px', 
                                    objectFit: 'contain'
                                }} 
                            />
                        </div>

                        {/* Partner logos */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 5
                        }}>
                            <div style={{
                                background: '#ffffff',
                                borderRadius: '15px',
                                padding: '12px 25px',
                                display: 'flex',
                                gap: '25px',
                                alignItems: 'center'
                            }}>
                                <img src="/images/Partiner-logos/AI_&_STEM_Logo.jpeg" alt="AI & STEM" crossOrigin="anonymous" style={{ height: '40px', width: 'auto' }} />
                                <img src="/images/Partiner-logos/Space_Shift_logo.png" alt="SpaceShift" crossOrigin="anonymous" style={{ height: '40px', width: 'auto' }} />
                                <img src="/images/Partiner-logos/Women_IN_STEM_LOGO.jpeg" alt="Women in STEM" crossOrigin="anonymous" style={{ height: '40px', width: 'auto' }} />
                                <img src="/images/logos/updatedLogo.jpg" alt="DEVGet Learning" crossOrigin="anonymous" style={{ height: '70px', width: 'auto' }} />
                            </div>
                        </div>

                        {/* Main content */}
                        <div style={{ position: 'relative', zIndex: 2, padding: '120px 80px 40px 80px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Title */}
                            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                                <h1 style={{
                                    fontSize: '66px',
                                    fontWeight: '700',
                                    color: '#0f4c5c',
                                    margin: '0',
                                    letterSpacing: '8px',
                                    fontFamily: 'Arial, sans-serif',
                                    lineHeight: '1.2'
                                }}>
                                    CERTIFICATE
                                </h1>
                                <div style={{
                                    display: 'inline-block',
                                    background: '#20b2aa',
                                    color: '#ffffff',
                                    padding: '10px 40px',
                                    borderRadius: '25px',
                                    fontSize: '20px',
                                    fontWeight: '400',
                                    letterSpacing: '4px',
                                    marginTop: '12px',
                                    lineHeight: '1',
                                    whiteSpace: 'nowrap'
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
                                {/* QR Code and Official Seal section */}
                                <div style={{ 
                                    flex: '0 0 auto', 
                                    display: 'flex', 
                                    alignItems: 'flex-end',
                                    gap: '12px',
                                    minWidth: '180px' 
                                }}>
                                    {/* QR Code */}
                                    <div style={{ textAlign: 'center' }}>
                                        {qrCodeUrl ? (
                                            <>
                                                <img src={qrCodeUrl} alt="QR Code" crossOrigin="anonymous" style={{ width: '85px', height: '85px', border: '2px solid #0f4c5c', display: 'block', margin: '0 auto 5px auto' }} />
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
                                    
                                    {/* Official Gold Seal */}
                                    <div style={{ 
                                        textAlign: 'center',
                                        paddingBottom: '50px'
                                    }}>
                                        <img 
                                            src="/Bootcamp_Certificates_Elements/Official_seal.png" 
                                            alt="Official Seal"
                                            crossOrigin="anonymous"
                                            style={{ 
                                                width: '75px', 
                                                height: '75px', 
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
                                                display: 'block',
                                                margin: '0 auto'
                                            }} 
                                        />
                                    </div>
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
