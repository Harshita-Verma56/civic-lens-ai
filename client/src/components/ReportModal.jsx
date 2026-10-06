import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  ShieldAlert,
  Wrench,
  Info,
  Sparkles,
  CheckCircle,
  Clock,
  Check,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { updateReportStatus } from '../services/api';

const STATUS_OPTIONS = ['Pending', 'Under Review', 'In Progress', 'Resolved'];

export default function ReportModal({ report, onClose, onStatusUpdated }) {
  if (!report) return null;

  const [currentStatus, setCurrentStatus] = useState(report.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

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

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    setStatusMessage('');

    try {
      const updated = await updateReportStatus(report.id, newStatus);
      setCurrentStatus(updated.status);
      setStatusMessage(`Status updated to "${newStatus}"`);
      if (onStatusUpdated) {
        onStatusUpdated(updated);
      }
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const confidencePercent = Math.round((report.confidence || 0.9) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', overflow: 'hidden' }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#0284c7',
              backgroundColor: '#e0f2fe',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px'
            }}>
              {report.id}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {report.issueType}
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              backgroundColor: '#f1f5f9'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.5rem', maxHeight: 'calc(85vh - 75px)', overflowY: 'auto' }}>
          {/* Status update alert toast */}
          {statusMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: statusMessage.startsWith('Error') ? '#fef2f2' : '#f0fdf4',
              color: statusMessage.startsWith('Error') ? '#b91c1c' : '#15803d',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Check size={16} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Top Split: Image & AI Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            {/* Uploaded Image Preview */}
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              height: '260px',
              border: '1px solid #cbd5e1'
            }}>
              <img
                src={report.image}
                alt={report.issueType}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>

            {/* AI Diagnostics Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Severity Card */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  AI Assessed Severity
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className={`badge ${getSeverityBadgeClass(report.severity)}`} style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                    {report.severity === 'Critical' ? <ShieldAlert size={15} /> : <AlertTriangle size={15} />}
                    {report.severity}
                  </span>
                </div>
              </div>

              {/* Confidence Score */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                    Vision Model Confidence
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    {confidencePercent}%
                  </span>
                </div>
                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${confidencePercent}%`,
                      backgroundColor: getSeverityColor(report.severity)
                    }}
                  />
                </div>
              </div>

              {/* Location & Timestamps */}
              <div style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.825rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.5rem', color: '#334155' }}>
                  <MapPin size={15} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>Location: </span>
                    <span>{report.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                  <Calendar size={14} />
                  <span>Reported: {new Date(report.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Citizen Description */}
          {report.description && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Citizen Description
              </div>
              <p style={{ fontSize: '0.925rem', color: '#1e293b', margin: 0, lineHeight: 1.5 }}>
                {report.description}
              </p>
            </div>
          )}

          {/* AI Explanation Box */}
          <div style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0369a1', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Info size={16} />
              <span>AI Severity Explanation</span>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#0c4a6e', lineHeight: 1.6, margin: 0 }}>
              {report.explanation}
            </p>
          </div>

          {/* Recommended Municipal Action */}
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Wrench size={16} />
              <span>Recommended Municipal Action</span>
            </div>
            <p style={{ fontSize: '0.925rem', color: '#14532d', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {report.recommendedAction}
            </p>
          </div>

          {/* Authority / Admin Status Action Panel */}
          <div style={{
            borderTop: '2px dashed #cbd5e1',
            paddingTop: '1.25rem',
            backgroundColor: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <UserCheck size={18} color="#0284c7" />
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Authority / Public Works Management
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem' }}>
              Municipal dispatchers can update the live ticket resolution stage below:
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem'
            }}>
              {STATUS_OPTIONS.map((st) => {
                const isActive = currentStatus === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    disabled={isUpdating}
                    style={{
                      padding: '0.75rem 0.5rem',
                      borderRadius: '8px',
                      border: `1.5px solid ${isActive ? '#0284c7' : '#e2e8f0'}`,
                      backgroundColor: isActive ? '#f0f9ff' : '#ffffff',
                      color: isActive ? '#0284c7' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s'
                    }}
                  >
                    {isActive && <Check size={15} color="#0284c7" />}
                    {st}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
