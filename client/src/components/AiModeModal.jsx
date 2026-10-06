import React, { useState } from 'react';
import { X, Cpu, Check, Shield, AlertCircle, Sparkles, Key } from 'lucide-react';
import { updateAiConfig } from '../services/api';

export default function AiModeModal({ isOpen, onClose, currentConfig, onConfigUpdated }) {
  if (!isOpen) return null;

  const [selectedMode, setSelectedMode] = useState(currentConfig?.mode || 'mock');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = { mode: selectedMode };
      if (apiKeyInput.trim()) {
        payload.apiKey = apiKeyInput.trim();
      }
      const updated = await updateAiConfig(payload);
      onConfigUpdated(updated);
      setSuccessMsg('AI Configuration updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update AI configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0284c7'
            }}>
              <Cpu size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                AI Vision Engine Configuration
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Toggle between offline mock mode and live Gemini API
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: '0.25rem', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#b91c1c',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            color: '#15803d',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Check size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {/* Mock Mode Card */}
          <div
            onClick={() => setSelectedMode('mock')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: `2px solid ${selectedMode === 'mock' ? '#0284c7' : '#e2e8f0'}`,
              backgroundColor: selectedMode === 'mock' ? '#f0f9ff' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              transition: 'all 0.15s'
            }}
          >
            <input
              type="radio"
              checked={selectedMode === 'mock'}
              onChange={() => setSelectedMode('mock')}
              style={{ marginTop: '0.25rem', accentColor: '#0284c7' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  Mock AI Vision Engine (Hackathon Demo Mode)
                </span>
                <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                  Default & Offline
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Zero setup needed. Generates realistic civic infrastructure classifications, severity estimations, and engineering repair actions instantly without any external API calls.
              </p>
            </div>
          </div>

          {/* Live Gemini AI Card */}
          <div
            onClick={() => setSelectedMode('live')}
            style={{
              padding: '1.2rem',
              borderRadius: '12px',
              border: `2px solid ${selectedMode === 'live' ? '#0284c7' : '#e2e8f0'}`,
              backgroundColor: selectedMode === 'live' ? '#f0f9ff' : '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              transition: 'all 0.15s'
            }}
          >
            <input
              type="radio"
              checked={selectedMode === 'live'}
              onChange={() => setSelectedMode('live')}
              style={{ marginTop: '0.25rem', accentColor: '#0284c7' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                  Real AI Vision (Google Gemini 1.5 Flash)
                </span>
                {currentConfig?.hasApiKey ? (
                  <span className="badge badge-low" style={{ fontSize: '0.65rem' }}>
                    Key Configured
                  </span>
                ) : (
                  <span className="badge badge-high" style={{ fontSize: '0.65rem' }}>
                    Requires Key
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Connects securely to Google Gemini Vision API on the backend to inspect uploaded photographs in real-time.
              </p>

              {selectedMode === 'live' && (
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e0f2fe' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Key size={14} /> Optional Runtime Gemini API Key:
                  </label>
                  <input
                    type="password"
                    placeholder={currentConfig?.hasApiKey ? "•••••••••••••••• (Key loaded from server .env)" : "Enter AI Studio API Key (AIzaSy...)"}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                  />
                  <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '0.35rem' }}>
                    Or define <code>GEMINI_API_KEY</code> in <code>server/.env</code>. Keys are kept securely on the backend.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Apply Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
