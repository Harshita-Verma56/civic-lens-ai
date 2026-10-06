import React from 'react';
import { Camera, Cpu, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onGetStarted }) {
  const steps = [
    {
      step: '01',
      icon: <Camera size={26} color="#0284c7" />,
      title: 'Citizen Capture',
      desc: 'Spot a hazardous pothole, flooded drain, or broken streetlight? Take a quick photo on your mobile phone or upload from desktop.'
    },
    {
      step: '02',
      icon: <Cpu size={26} color="#6366f1" />,
      title: 'AI Vision Analysis',
      desc: 'Our multimodal AI model instantly inspects the image, categorizes the defect type, and calculates confidence score.'
    },
    {
      step: '03',
      icon: <AlertTriangle size={26} color="#f59e0b" />,
      title: 'Severity Scoring',
      desc: 'AI assigns Low, Medium, High, or Critical severity with a civil engineering explanation and immediate repair recommendation.'
    },
    {
      step: '04',
      icon: <CheckCircle size={26} color="#10b981" />,
      title: 'Authority Dispatch',
      desc: 'City public works access a unified live dashboard to prioritize critical emergencies and track repairs through to resolution.'
    }
  ];

  return (
    <section style={{ padding: '4rem 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0284c7',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem'
          }}>
            Streamlined Civic Workflow
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            How CivicLens AI Works
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
            Bridging the gap between observant citizens and municipal maintenance crews with automated computer vision.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {steps.map((s, idx) => (
            <div
              key={s.step}
              className="card"
              style={{
                padding: '1.75rem 1.5rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {s.icon}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#cbd5e1'
                  }}>
                    {s.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                  Next step <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
