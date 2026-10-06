import React from 'react';
import { Camera, LayoutDashboard, Sparkles, CheckCircle2, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export default function Hero({ onReportClick, onDashboardClick }) {
  return (
    <section style={{
      background: 'radial-gradient(ellipse at 50% 0%, #e0f2fe 0%, #f8fafc 70%)',
      padding: '4.5rem 0 3.5rem',
      borderBottom: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
        {/* Civic Tech Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.9rem',
          borderRadius: '9999px',
          backgroundColor: '#ffffff',
          border: '1px solid #bae6fd',
          boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)',
          marginBottom: '1.5rem'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#0284c7',
            color: '#fff'
          }}>
            <Sparkles size={11} />
          </span>
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0369a1', letterSpacing: '0.02em' }}>
            AI-POWERED CIVIC INFRASTRUCTURE INTELLIGENCE
          </span>
        </div>

        {/* Primary Heading */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#0f172a',
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem'
        }}>
          See it. <span style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Report it.</span> Fix it.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          color: '#475569',
          lineHeight: 1.6,
          maxWidth: '680px',
          margin: '0 auto 2.25rem',
          fontWeight: 450
        }}>
          AI-powered infrastructure monitoring for safer, better-maintained communities.
          Empowering citizens to report potholes, road damage, failing streetlights, and drainage hazards with instant AI severity classification.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <button
            onClick={onReportClick}
            className="btn btn-accent"
            style={{
              padding: '0.85rem 1.85rem',
              fontSize: '1.05rem',
              borderRadius: '12px'
            }}
          >
            <Camera size={20} />
            Report an Issue
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onDashboardClick}
            className="btn btn-secondary"
            style={{
              padding: '0.85rem 1.75rem',
              fontSize: '1.05rem',
              borderRadius: '12px'
            }}
          >
            <LayoutDashboard size={20} color="#0284c7" />
            View Dashboard
          </button>
        </div>

        {/* Trust Badges / Stats Preview Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7'
            }}>
              <Zap size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Instant AI Vision</div>
              <div style={{ fontSize: '0.775rem', color: '#64748b' }}>Identifies defects in &lt; 2 seconds</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#dc2626'
            }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Severity Triaging</div>
              <div style={{ fontSize: '0.775rem', color: '#64748b' }}>Critical vs low triage ranking</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16a34a'
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Direct Municipal Action</div>
              <div style={{ fontSize: '0.775rem', color: '#64748b' }}>Engineered repair advisories</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
