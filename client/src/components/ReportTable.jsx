import React from 'react';
import { Eye, ShieldAlert, MapPin, Calendar } from 'lucide-react';

export default function ReportTable({ reports, onSelectReport }) {
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
        day: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Image</th>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>ID & Type</th>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Severity</th>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Location</th>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
            <th style={{ padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              style={{
                borderBottom: '1px solid #f1f5f9',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Thumbnail */}
              <td style={{ padding: '0.85rem 1rem', width: '70px' }}>
                <img
                  src={report.image}
                  alt={report.issueType}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </td>

              {/* ID & Issue Type */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#0284c7', fontWeight: 700 }}>
                  {report.id}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                  {report.issueType}
                </div>
              </td>

              {/* Severity */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span className={`badge ${getSeverityBadgeClass(report.severity)}`}>
                  {report.severity === 'Critical' && <ShieldAlert size={12} />}
                  {report.severity}
                </span>
              </td>

              {/* Location */}
              <td style={{ padding: '0.85rem 1rem', maxWidth: '220px' }}>
                <div style={{
                  fontSize: '0.825rem',
                  color: '#475569',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {report.location}
                </div>
              </td>

              {/* Status */}
              <td style={{ padding: '0.85rem 1rem' }}>
                <span className={`status-pill ${getStatusClass(report.status)}`} style={{ fontSize: '0.75rem' }}>
                  <span className="status-dot" />
                  {report.status}
                </span>
              </td>

              {/* Date */}
              <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                {formatDate(report.createdAt)}
              </td>

              {/* View Action */}
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                <button
                  onClick={() => onSelectReport(report)}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Eye size={14} /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
