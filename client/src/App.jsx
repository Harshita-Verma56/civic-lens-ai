import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';
import AiModeModal from './components/AiModeModal';
import { getAiStatus } from './services/api';
import { Shield, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'report' | 'dashboard'
  const [aiConfig, setAiConfig] = useState({ mode: 'mock', hasApiKey: false });
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Fetch AI engine configuration on mount
  useEffect(() => {
    getAiStatus()
      .then(config => setAiConfig(config))
      .catch(err => console.warn('Could not fetch AI config:', err.message));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aiConfig={aiConfig}
        onOpenAiModal={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <>
            <Hero
              onReportClick={() => setActiveTab('report')}
              onDashboardClick={() => setActiveTab('dashboard')}
            />
            <HowItWorks onGetStarted={() => setActiveTab('report')} />
          </>
        )}

        {activeTab === 'report' && (
          <ReportForm
            onReportSubmitted={() => {}}
            onViewDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateToReport={() => setActiveTab('report')}
          />
        )}
      </main>

      {/* AI Mode Switcher Modal */}
      <AiModeModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentConfig={aiConfig}
        onConfigUpdated={(updated) => setAiConfig(updated)}
      />

      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '2.5rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>CivicLens AI</span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem' }}>
                AI-Powered Public Infrastructure Monitoring MVP
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
            <button
              onClick={() => setIsAiModalOpen(true)}
              style={{
                color: '#0284c7',
                fontWeight: 600,
                textDecoration: 'underline',
                fontSize: '0.825rem'
              }}
            >
              Engine: {aiConfig.mode === 'live' ? 'Live Gemini AI' : 'Mock AI Mode'}
            </button>
            <span>•</span>
            <span>Built for Municipal Hackathon 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
