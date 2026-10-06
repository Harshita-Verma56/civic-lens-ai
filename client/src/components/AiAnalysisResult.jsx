import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle, ShieldAlert, Wrench, Info, Zap } from 'lucide-react';

export default function AiAnalysisResult({ analysis }) {
  if (!analysis) return null;

  const { issueType, severity, confidence, explanation, recommendedAction, aiModel, warning } = analysis;

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#16a34a';
      default: return '#0284c7';
    }
  };

  const confidencePercent = Math.round((confidence || 0.9) * 100);

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      borderRadius: '14px',
      border: '1px solid #cbd5e1',
      padding: '1.5rem',
      marginTop: '1.5rem',
      position: 'relative'
    }}>
      {/* Header banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            color: 'white'
          }}>
            <Sparkles size={14} />
          </span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
            AI Vision Inspection Completed
          </span>
        </div>

        <span style={{
          fontSize: '0.75rem',
          color: '#64748b',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '0.2rem 0.6rem',
          borderRadius: '9999px',
          fontWeight: 600
        }}>
          {aiModel || 'CivicLens AI Vision'}
        </span>
      </div>

      {warning && (
        <div style={{
          padding: '0.5rem 0.75rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '8px',
          color: '#92400e',
          fontSize: '0.75rem',
          marginBottom: '1rem'
        }}>
          {warning}
        </div>
      )}

      {/* Main Grid: Classification & Severity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem'
      }}>
        {/* Issue Type */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Detected Issue
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
            {issueType}
          </div>
        </div>

        {/* Severity */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            Estimated Severity
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${getSeverityBadgeClass(severity)}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
              {severity === 'Critical' ? <ShieldAlert size={14} /> : <AlertTriangle size={14} />}
              {severity}
            </span>
          </div>
        </div>

        {/* Confidence Meter */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Confidence Score
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              {confidencePercent}%
            </span>
          </div>
          <div className="confidence-track">
            <div
              className="confidence-fill"
              style={{
                width: `${confidencePercent}%`,
                backgroundColor: getSeverityColor(severity)
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Explanation Box */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        padding: '1rem 1.15rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369a1', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <Info size={16} />
          <span>AI Engineering Explanation</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
          {explanation}
        </p>
      </div>

      {/* Recommended Action Box */}
      <div style={{
        backgroundColor: '#f0fdf4',
        borderRadius: '10px',
        border: '1px solid #bbf7d0',
        padding: '1rem 1.15rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          <Wrench size={16} />
          <span>Recommended Municipal Action</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#14532d', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
          {recommendedAction}
        </p>
      </div>
    </div>
  );
}
