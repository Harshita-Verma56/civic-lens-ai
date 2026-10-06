import React from 'react';
import { BarChart3, AlertOctagon, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const { total = 0, critical = 0, pending = 0, resolved = 0, resolutionRate = 0 } = stats;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {/* Total Reports */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: '#e0f2fe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0284c7'
        }}>
          <BarChart3 size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Reports
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            {total}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: '0.2rem' }}>
            Across all municipal sectors
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      <div className="card" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        borderLeft: '4px solid #dc2626'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626'
        }}>
          <AlertOctagon size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Critical Issues
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#dc2626', lineHeight: 1.1 }}>
            {critical}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600, marginTop: '0.2rem' }}>
            Immediate dispatch required
          </div>
        </div>
      </div>

      {/* Pending Reports */}
      <div className="card" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        borderLeft: '4px solid #f59e0b'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: '#fef3c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#d97706'
        }}>
          <Clock size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pending Reports
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#d97706', lineHeight: 1.1 }}>
            {pending}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.2rem' }}>
            Awaiting triage review
          </div>
        </div>
      </div>

      {/* Resolved Reports */}
      <div className="card" style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        borderLeft: '4px solid #10b981'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          backgroundColor: '#d1fae5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669'
        }}>
          <CheckCircle2 size={28} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Resolved
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>
            {resolved}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, marginTop: '0.2rem' }}>
            {resolutionRate}% resolution rate
          </div>
        </div>
      </div>
    </div>
  );
}
