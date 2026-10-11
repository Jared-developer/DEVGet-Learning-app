import React from 'react';
import AIGovernanceCertificate from '../components/AIGovernanceCertificate';

const CertificatePreview = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'auto'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#0f4c5c',
        fontSize: '32px',
        fontWeight: '600'
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
