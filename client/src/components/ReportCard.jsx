import React from 'react';
import { MapPin, Calendar, Eye, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function ReportCard({ report, onSelectReport }) {
  const {
    id,
    image,
    issueType,
    severity,
    location,
    status,
    createdAt
  } = report;

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'Critical': return 'badge-critical';
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const getStatusClass = (st) => {
    switch (st) {
      case 'Pending': return 'status-pending';
      case 'Under Review': return 'status-review';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      default: return 'status-pending';
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      className="card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.15s, box-shadow 0.15s'
      }}
    >
      {/* Image container */}
      <div style={{ position: 'relative', height: '180px', backgroundColor: '#0f172a', overflow: 'hidden' }}>
        <img
          src={image}
          alt={issueType}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Severity overlay badge */}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className={`badge ${getSeverityBadgeClass(severity)}`} style={{ boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
            {severity === 'Critical' && <ShieldAlert size={12} />}
            {severity}
          </span>
        </div>

        {/* ID tag */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.725rem',
          fontWeight: 600,
          padding: '0.2rem 0.5rem',
          borderRadius: '4px'
        }}>
          {id}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Header row: Issue Type & Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {issueType}
            </h3>
            <span className={`status-pill ${getStatusClass(status)}`} style={{ fontSize: '0.75rem' }}>
              <span className="status-dot" />
              {status}
            </span>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', color: '#64748b', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
            <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: '#0284c7' }} />
            <span style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4
            }}>
              {location}
            </span>
          </div>

          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.775rem', marginBottom: '1rem' }}>
            <Calendar size={13} />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectReport(report)}
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '0.875rem', padding: '0.55rem' }}
        >
          <Eye size={16} /> View Details
        </button>
      </div>
    </div>
  );
}
