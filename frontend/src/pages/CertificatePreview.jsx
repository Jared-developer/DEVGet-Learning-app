import React from 'react';
import AIGovernanceCertificate from '../components/AIGovernanceCertificate';

const CertificatePreview = () => {
  return (
    <div style={{ 
      padding: '10px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#0f4c5c',
        fontSize: 'clamp(18px, 4vw, 32px)',
        fontWeight: '600',
        padding: '10px 5px',
        width: '100%',
        margin: '0 0 20px 0'
      }}>
        Certificate Preview
      </h1>
      <AIGovernanceCertificate 
        studentName="John Doe" 
        completionDate="October 11, 2026"
        courseTitle="AI GOVERNANCE AND DIGITAL SAFETY BOOTCAMP 1.0"
      />
    </div>
  );
};

export default CertificatePreview;
