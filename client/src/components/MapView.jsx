import React, { useState } from 'react';
import { MapPin, Eye, ShieldAlert, AlertTriangle, Layers, Navigation } from 'lucide-react';

export default function MapView({ reports, onSelectReport }) {
  const [hoveredReport, setHoveredReport] = useState(null);

  // Deterministic coordinate mapper for reports based on ID or index
  const getCoordinatesForReport = (report, index) => {
    // Generate pseudo-coordinates across city grid bounds (20% to 80% range)
    const seed = (report.id ? report.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) : index * 47) % 1000;
    const x = 15 + ((seed * 73) % 70);
    const y = 18 + ((seed * 41) % 65);
    return { x, y };
  };

  const getPinColor = (sev) => {
    switch (sev) {
      case 'Critical': return '#dc2626';
      case 'High': return '#ea580c';
      case 'Medium': return '#d97706';
      case 'Low': return '#16a34a';
      default: return '#0284c7';
    }
  };

  return (
    <div className="card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#0284c7" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Municipal Infrastructure GIS Map
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            ({reports.length} plotted hazard pins)
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.775rem', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#dc2626' }} /> Critical
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ea580c' }} /> High
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#d97706' }} /> Medium
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#16a34a' }} /> Low
          </span>
        </div>
      </div>

      {/* Interactive Map Visual Surface */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        backgroundColor: '#f1f5f9',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #cbd5e1'
      }}>
        {/* SVG Base Map: Stylized Municipal Grid & Roads */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* River / Waterway */}
          <path
            d="M 0,220 C 200,240 400,180 600,260 C 800,320 1000,280 1200,300"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="32"
            strokeLinecap="round"
          />

          {/* Major Arteries / Avenues */}
          <line x1="0" y1="140" x2="1200" y2="140" stroke="#cbd5e1" strokeWidth="10" />
          <line x1="0" y1="360" x2="1200" y2="360" stroke="#cbd5e1" strokeWidth="8" />
          <line x1="280" y1="0" x2="280" y2="600" stroke="#cbd5e1" strokeWidth="10" />
          <line x1="720" y1="0" x2="720" y2="600" stroke="#cbd5e1" strokeWidth="10" />
          <line x1="960" y1="0" x2="960" y2="600" stroke="#e2e8f0" strokeWidth="6" />

          {/* Secondary streets */}
          <line x1="120" y1="0" x2="120" y2="600" stroke="#e2e8f0" strokeWidth="4" />
          <line x1="500" y1="0" x2="500" y2="600" stroke="#e2e8f0" strokeWidth="4" />
          <line x1="0" y1="260" x2="1200" y2="260" stroke="#e2e8f0" strokeWidth="4" />
          <line x1="0" y1="460" x2="1200" y2="460" stroke="#e2e8f0" strokeWidth="4" />

          {/* District Labels */}
          <text x="60" y="80" fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="2">NORTH METRO DISTRICT</text>
          <text x="320" y="80" fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="2">OAK RIDGE SECTOR</text>
          <text x="750" y="80" fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="2">INDUSTRIAL FREIGHT HUB</text>
          <text x="60" y="420" fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="2">RIVERSIDE PROMENADE</text>
          <text x="750" y="420" fill="#94a3b8" fontSize="13" fontWeight="bold" letterSpacing="2">COMMERCIAL CENTER</text>
        </svg>

        {/* Hazard Pins Plotted */}
        {reports.map((report, idx) => {
          const { x, y } = getCoordinatesForReport(report, idx);
          const color = getPinColor(report.severity);
          const isCritical = report.severity === 'Critical';
          const isHovered = hoveredReport?.id === report.id;

          return (
            <div
              key={report.id}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: isHovered ? 30 : isCritical ? 20 : 10,
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredReport(report)}
              onClick={() => onSelectReport(report)}
            >
              {/* Pulsing ring for critical issues */}
              {isCritical && (
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(220, 38, 38, 0.35)',
                  transform: 'translate(-50%, -50%)',
                  animation: 'pulse 1.8s infinite'
                }} />
              )}

              {/* Pin Icon */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                border: '2px solid #ffffff'
              }}>
                <div style={{ transform: 'rotate(45deg)', display: 'flex' }}>
                  {isCritical ? <ShieldAlert size={14} /> : <AlertTriangle size={14} />}
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Callout Popup for Hovered Pin */}
        {hoveredReport && (
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              padding: '1rem',
              width: '320px',
              zIndex: 40,
              border: '1px solid #cbd5e1'
            }}
          >
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <img
                src={hoveredReport.image}
                alt={hoveredReport.issueType}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: '#0284c7', fontWeight: 700 }}>
                    {hoveredReport.id}
                  </span>
                  <span className={`badge ${hoveredReport.severity === 'Critical' ? 'badge-critical' : hoveredReport.severity === 'High' ? 'badge-high' : 'badge-medium'}`} style={{ fontSize: '0.65rem' }}>
                    {hoveredReport.severity}
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.925rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {hoveredReport.issueType}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.2rem' }}>
                  {hoveredReport.location}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectReport(hoveredReport)}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.45rem', fontSize: '0.8rem' }}
            >
              <Eye size={14} /> Open Full Report
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
          70% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
