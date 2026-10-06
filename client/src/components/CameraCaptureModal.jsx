import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onPhotoCaptured }) {
  if (!isOpen) return null;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'

  // Start webcam
  useEffect(() => {
    let currentStream = null;

    async function initCamera() {
      setErrorMsg('');
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setErrorMsg('Unable to access camera. Please allow camera permissions or upload an image file instead.');
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `civic-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onPhotoCaptured(file, canvas.toDataURL('image/jpeg', 0.9));
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '1.5rem', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Capture Infrastructure Photo
            </h3>
          </div>
          <button onClick={handleClose} style={{ padding: '0.25rem', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg ? (
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            color: '#b91c1c',
            margin: '1.5rem 0'
          }}>
            <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Camera Permission Required</div>
            <div style={{ fontSize: '0.875rem' }}>{errorMsg}</div>
          </div>
        ) : (
          <div style={{
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#000000',
            aspectRatio: '4/3',
            marginBottom: '1.25rem',
            border: '2px solid #0284c7'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Viewfinder reticle overlay */}
            <div style={{
              position: 'absolute',
              inset: '20px',
              border: '1px dashed rgba(255,255,255,0.4)',
              borderRadius: '8px',
              pointerEvents: 'none'
            }} />
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {!errorMsg && (
            <>
              <button
                type="button"
                onClick={toggleFacingMode}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <RefreshCw size={16} /> Switch Camera
              </button>
              <button
                type="button"
                onClick={handleCapture}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.75rem', fontSize: '1rem' }}
              >
                <Camera size={18} /> Snap Photo
              </button>
            </>
          )}
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-secondary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
