import React, { useState } from 'react';
import { Shield, Sparkles, PlusCircle, LayoutDashboard, Menu, X, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, aiConfig, onOpenAiModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <div
          onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                CivicLens
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0284c7',
                backgroundColor: '#e0f2fe',
                padding: '0.15rem 0.45rem',
                borderRadius: '6px'
              }}>
                AI
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, margin: 0, lineHeight: 1 }}>
              Municipal Vision Intelligence
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <button
            onClick={() => setActiveTab('home')}
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: activeTab === 'home' ? '#0284c7' : '#475569',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'home' ? '#f0f9ff' : 'transparent',
              transition: 'all 0.15s'
            }}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('report')}
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: activeTab === 'report' ? '#0284c7' : '#475569',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'report' ? '#f0f9ff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s'
            }}
          >
            <PlusCircle size={18} />
            Report Issue
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              fontWeight: 600,
              fontSize: '0.925rem',
              color: activeTab === 'dashboard' ? '#0284c7' : '#475569',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'dashboard' ? '#f0f9ff' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s'
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          {/* AI Mode Indicator / Switcher */}
          <button
            onClick={onOpenAiModal}
            title="Configure AI Vision Engine"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.775rem',
              fontWeight: 700,
              backgroundColor: aiConfig?.mode === 'live' ? '#ecfdf5' : '#f8fafc',
              color: aiConfig?.mode === 'live' ? '#065f46' : '#334155',
              border: `1px solid ${aiConfig?.mode === 'live' ? '#a7f3d0' : '#cbd5e1'}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
            }}
          >
            <Cpu size={14} color={aiConfig?.mode === 'live' ? '#059669' : '#64748b'} />
            <span>
              {aiConfig?.mode === 'live' ? 'Live Gemini AI' : 'Mock AI Mode'}
            </span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: aiConfig?.mode === 'live' ? '#10b981' : '#f59e0b'
            }} />
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <div style={{ display: 'none' }} className="mobile-toggle">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.5rem', color: '#334155' }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              fontWeight: 600,
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'home' ? '#f0f9ff' : 'transparent',
              color: activeTab === 'home' ? '#0284c7' : '#334155'
            }}
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('report'); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              fontWeight: 600,
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'report' ? '#f0f9ff' : 'transparent',
              color: activeTab === 'report' ? '#0284c7' : '#334155'
            }}
          >
            Report an Issue
          </button>
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              fontWeight: 600,
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: activeTab === 'dashboard' ? '#f0f9ff' : 'transparent',
              color: activeTab === 'dashboard' ? '#0284c7' : '#334155'
            }}
          >
            View Dashboard
          </button>
          <button
            onClick={() => { onOpenAiModal(); setMobileMenuOpen(false); }}
            style={{
              textAlign: 'left',
              fontWeight: 600,
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Cpu size={16} />
            <span>AI Mode: {aiConfig?.mode === 'live' ? 'Live Gemini AI' : 'Mock AI Mode'}</span>
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
