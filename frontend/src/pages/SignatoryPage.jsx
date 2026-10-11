import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import AIGovernanceCertificateWithSignatures from '../components/AIGovernanceCertificateWithSignatures';

const SignatoryPage = () => {
  const { certificateId } = useParams();
  const [searchParams] = useSearchParams();
  const slotNumber = searchParams.get('slot') ? parseInt(searchParams.get('slot')) : null;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // You can add certificate validation here
    setLoading(false);
  }, [certificateId]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <p>Loading certificate...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px 10px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        marginBottom: '20px',
        padding: '0 10px'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#0f4c5c',
          fontSize: 'clamp(24px, 5vw, 32px)',
          fontWeight: '600',
          marginBottom: '10px'
        }}>
          Certificate Signature Request
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: 'clamp(14px, 3vw, 16px)',
          marginBottom: '15px',
          lineHeight: '1.5'
        }}>
          {slotNumber 
            ? `Please review the certificate and add your signature to Slot ${slotNumber}.`
            : 'Please review the certificate and add your signature.'
          }
        </p>
        <div style={{
          padding: '12px 15px',
          backgroundColor: slotNumber ? '#d1ecf1' : '#fff3cd',
          border: slotNumber ? '1px solid #bee5eb' : '1px solid #ffeeba',
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <p style={{ margin: 0, color: slotNumber ? '#0c5460' : '#856404', fontSize: 'clamp(12px, 2.5vw, 14px)', lineHeight: '1.6' }}>
            <strong>Instructions:</strong> 
            {slotNumber 
              ? ` You can only edit Signature Slot ${slotNumber}. Click "Add Signature" on the designated slot, fill in your details, and click "Confirm & Lock" when done. Once confirmed, your signature cannot be changed.`
              : ' Click on "Add Signature" button on any empty signature slot. You can save as draft and edit multiple times. Once you click "Confirm & Lock", your signature cannot be changed.'
            }
          </p>
        </div>
      </div>

      <AIGovernanceCertificateWithSignatures
        studentName="John Doe"
        completionDate="October 11, 2026"
        courseTitle="AI GOVERNANCE AND DIGITAL SAFETY BOOTCAMP 1.0"
        certificateId={certificateId}
        editable={true}
        allowedSlot={slotNumber}
      />
    </div>
  );
};

export default SignatoryPage;
