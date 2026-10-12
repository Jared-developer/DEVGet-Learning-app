import { useState, useRef, useEffect } from 'react';

const SignatureModal = ({ isOpen, onClose, onSubmit, signatureData, slotNumber }) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [signatureMode, setSignatureMode] = useState('draw'); // 'draw' or 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (signatureData) {
      setName(signatureData.name || '');
      setTitle(signatureData.title || '');
      setIsEditing(!signatureData.confirmed);
      
      if (signatureData.signature && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          context.drawImage(img, 0, 0);
        };
        img.src = signatureData.signature;
      }
    }
  }, [signatureData]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.strokeStyle = '#0f4c5c';
      context.lineWidth = 2;
      context.lineCap = 'round';
      setCtx(context);
    }
  }, [isOpen]);

  const startDrawing = (e) => {
    if (!isEditing) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.type.includes('touch') ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !isEditing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.type.includes('touch') ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.type.includes('touch') ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (!isEditing) return;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e) => {
    if (!isEditing) return;
    
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate dimensions to fit image in canvas while maintaining aspect ratio
        const maxWidth = canvas.width;
        const maxHeight = canvas.height;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }
        
        // Center the image
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;
        
        context.drawImage(img, x, y, width, height);
        setUploadedImage(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (confirmed = false) => {
    if (!name.trim() || !title.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const canvas = canvasRef.current;
    const signatureImage = canvas.toDataURL('image/png');
    
    // Check if canvas is empty
    const isCanvasEmpty = !canvas.getContext('2d')
      .getImageData(0, 0, canvas.width, canvas.height).data
      .some(channel => channel !== 0);
    
    if (isCanvasEmpty) {
      alert('Please add your signature');
      return;
    }

    onSubmit({
      name: name.trim(),
      title: title.trim(),
      signature: signatureImage,
      confirmed,
      slotNumber
    });

    // Only close modal and disable editing if confirmed
    // Don't close on draft save or if there's an error
    if (confirmed) {
      setIsEditing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#0f4c5c' }}>
          {isEditing ? 'Add Signature' : 'View Signature'} - Slot {slotNumber}
        </h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: isEditing ? '#fff' : '#f5f5f5'
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            Title/Position
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditing}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: isEditing ? '#fff' : '#f5f5f5'
            }}
            placeholder="e.g., Program Director, CEO"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
            Signature Method
          </label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button
              onClick={() => setSignatureMode('draw')}
              disabled={!isEditing}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: signatureMode === 'draw' ? '#20b2aa' : '#f0f0f0',
                color: signatureMode === 'draw' ? '#fff' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: isEditing ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              ✏️ Draw
            </button>
            <button
              onClick={() => setSignatureMode('upload')}
              disabled={!isEditing}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: signatureMode === 'upload' ? '#20b2aa' : '#f0f0f0',
                color: signatureMode === 'upload' ? '#fff' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: isEditing ? 'pointer' : 'not-allowed',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              📤 Upload
            </button>
          </div>
          
          {signatureMode === 'upload' && isEditing && (
            <div style={{ marginBottom: '10px' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                Upload a PNG, JPG, or other image file (max 2MB)
              </p>
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            width={440}
            height={150}
            onMouseDown={signatureMode === 'draw' ? startDrawing : undefined}
            onMouseMove={signatureMode === 'draw' ? draw : undefined}
            onMouseUp={signatureMode === 'draw' ? stopDrawing : undefined}
            onMouseLeave={signatureMode === 'draw' ? stopDrawing : undefined}
            onTouchStart={signatureMode === 'draw' ? startDrawing : undefined}
            onTouchMove={signatureMode === 'draw' ? draw : undefined}
            onTouchEnd={signatureMode === 'draw' ? stopDrawing : undefined}
            style={{
              border: '2px solid #0f4c5c',
              borderRadius: '6px',
              cursor: isEditing && signatureMode === 'draw' ? 'crosshair' : 'not-allowed',
              backgroundColor: isEditing ? '#fff' : '#f5f5f5',
              display: 'block',
              width: '100%',
              touchAction: 'none'
            }}
          />
          {isEditing && (
            <button
              onClick={clearSignature}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear Signature
            </button>
          )}
        </div>

        {signatureData?.confirmed && (
          <div style={{
            padding: '12px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            color: '#155724',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            ✓ This signature has been confirmed and cannot be edited.
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              flex: '1 1 auto',
              minWidth: '80px'
            }}
          >
            Close
          </button>
          {isEditing && (
            <>
              <button
                onClick={() => handleSubmit(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#20b2aa',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  flex: '1 1 auto',
                  minWidth: '100px'
                }}
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit(true)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#0f4c5c',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  flex: '1 1 auto',
                  minWidth: '120px'
                }}
              >
                Confirm & Lock
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
