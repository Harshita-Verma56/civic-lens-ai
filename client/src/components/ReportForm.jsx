import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  MapPin,
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
  Navigation,
  Image as ImageIcon,
  Mic,
  MicOff,
  Crosshair
} from 'lucide-react';
import { DEMO_SAMPLES } from '../sampleData/demoImages';
import { analyzeImage, createReport } from '../services/api';
import AiAnalysisResult from './AiAnalysisResult';
import CameraCaptureModal from './CameraCaptureModal';

export default function ReportForm({ onReportSubmitted, onViewDashboard }) {
  const fileInputRef = useRef(null);

  // Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sampleHint, setSampleHint] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // AI & Submission State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedReport, setSubmittedReport] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAiOverlay, setShowAiOverlay] = useState(true);

  // Speech-to-text dictation helper
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setSampleHint('');
    setAiResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle curated demo sample selection
  const handleSelectSample = (sample) => {
    setSelectedFile(null);
    setPreviewUrl(sample.url);
    setSampleHint(sample.hintType);
    setLocation(sample.location);
    setDescription(sample.description);
    setAiResult(null);
    setErrorMessage('');
  };

  // Browser Geolocation helper
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocatingUser(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In civic reporting, coords + zone
        setLocation(`Lat ${latitude.toFixed(4)}, Lon ${longitude.toFixed(4)} (GPS Verified)`);
        setLocatingUser(false);
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        // Fallback to municipal default
        setLocation('742 Evergreen Terrace, Sector 5');
        setLocatingUser(false);
      },
      { timeout: 8000 }
    );
  };

  // Run AI Analysis
  const handleRunAiAnalysis = async () => {
    if (!previewUrl && !selectedFile) {
      setErrorMessage('Please upload or select an infrastructure photo first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');
    setAnalysisStep('Preprocessing high-resolution photo...');

    try {
      const stepTimer1 = setTimeout(() => setAnalysisStep('Scanning surface texture & structural anomalies...'), 500);
      const stepTimer2 = setTimeout(() => setAnalysisStep('Determining civic severity & municipal recommendation...'), 1100);

      const target = selectedFile || previewUrl;
      const result = await analyzeImage(target, {
        description,
        hintType: sampleHint
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      setAiResult(result);
    } catch (err) {
      setErrorMessage(err.message || 'AI Vision analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Submit Official Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();

    if (!previewUrl && !selectedFile) {
      setErrorMessage('Please provide an image of the infrastructure issue.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        image: selectedFile ? '' : previewUrl,
        location: location || 'Location not specified',
        description: description || 'Visual report submitted by citizen.',
        issueType: aiResult?.issueType,
        severity: aiResult?.severity,
        confidence: aiResult?.confidence,
        explanation: aiResult?.explanation,
        recommendedAction: aiResult?.recommendedAction,
        status: 'Pending'
      };

      const created = await createReport(payload, selectedFile);
      setSubmittedReport(created);
      if (onReportSubmitted) {
        onReportSubmitted(created);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit report. Please check server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setSampleHint('');
    setLocation('');
    setDescription('');
    setAiResult(null);
    setSubmittedReport(null);
    setErrorMessage('');
  };

  // If report submitted successfully, show confirmation screen
  if (submittedReport) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem', maxWidth: '680px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderTop: '4px solid #10b981' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#d1fae5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle size={36} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Report Successfully Filed!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Thank you for helping keep public infrastructure safe and well-maintained.
          </p>

          {/* Report summary card */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>Tracking ID:</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0284c7' }}>
                {submittedReport.id}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b' }}>Issue:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{submittedReport.issueType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b' }}>Severity:</span>
              <span className={`badge ${submittedReport.severity === 'Critical' ? 'badge-critical' : submittedReport.severity === 'High' ? 'badge-high' : 'badge-medium'}`}>
                {submittedReport.severity}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b' }}>Status:</span>
              <span className="status-pill status-pending">
                <span className="status-dot" />
                {submittedReport.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.825rem', color: '#64748b' }}>Location:</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#334155', maxWidth: '300px', textAlign: 'right' }}>
                {submittedReport.location}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={onViewDashboard} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              View in Live Dashboard
            </button>
            <button onClick={resetForm} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '840px' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Report an Infrastructure Problem
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Upload a photo of damaged roads, potholes, broken lights, or drainage failures. Our AI vision model will classify the issue and estimate severity automatically.
        </p>
      </div>

      {errorMessage && (
        <div style={{
          padding: '0.85rem 1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          color: '#b91c1c',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Reporting Form Card */}
      <form onSubmit={handleSubmitReport} className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Image Capture / Upload */}
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={18} color="#0284c7" />
            1. Issue Photo (Required)
          </label>

          {/* Quick Demo Photo Samples for Hackathon Judges */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>
              Instant Demo Samples (1-Click Test):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {DEMO_SAMPLES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectSample(s)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `1.5px solid ${previewUrl === s.url ? '#0284c7' : '#e2e8f0'}`,
                    backgroundColor: previewUrl === s.url ? '#f0f9ff' : '#ffffff',
                    transition: 'all 0.15s',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={s.url}
                    alt={s.title}
                    style={{ width: '100%', height: '56px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.35rem' }}
                  />
                  <span style={{ fontSize: '0.725rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                    {s.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop / File Input Zone */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.backgroundColor = '#f0f9ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <Upload size={24} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                Upload or take a photo of the problem
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                PNG, JPG, or WebP up to 10MB
              </p>
            </div>
          ) : (
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #cbd5e1',
              backgroundColor: '#0f172a'
            }}>
              <div className={isAnalyzing ? 'ai-scan-container' : ''}>
                <img
                  src={previewUrl}
                  alt="Infrastructure defect preview"
                  style={{
                    width: '100%',
                    maxHeight: '340px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                {isAnalyzing && <div className="ai-scan-line" />}
              </div>

              {/* Action overlay bar on image */}
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                  {selectedFile ? `File: ${selectedFile.name}` : 'Demo Sample Photo Selected'}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <RefreshCw size={14} /> Change Photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Location & Description */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.5rem' }}>
          {/* Location */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} color="#0284c7" />
                2. Location (Optional)
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={locatingUser}
                style={{
                  fontSize: '0.775rem',
                  color: '#0284c7',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <Navigation size={12} />
                {locatingUser ? 'Locating...' : 'Detect GPS'}
              </button>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 402 Oak Ridge Parkway, or cross street"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={16} color="#0284c7" />
              3. Notes / Description (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Deep pothole right after curve, cars swerving"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* AI Analysis Trigger Button */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          {!aiResult ? (
            <button
              type="button"
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing || !previewUrl}
              className="btn btn-accent"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1rem',
                borderRadius: '10px'
              }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  {analysisStep || 'Analyzing with AI Vision...'}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Image with AI Vision
                </>
              )}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleRunAiAnalysis}
                disabled={isAnalyzing}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.85rem' }}
              >
                <RefreshCw size={16} /> Re-analyze Image
              </button>
            </div>
          )}
        </div>

        {/* AI Analysis Result Display */}
        {aiResult && <AiAnalysisResult analysis={aiResult} />}

        {/* Final Submission Button */}
        {aiResult && (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1.05rem',
                borderRadius: '10px'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Submitting Report to Municipal Registry...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Official Infrastructure Report
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
