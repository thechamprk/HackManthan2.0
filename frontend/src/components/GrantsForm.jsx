import React, { useState } from 'react';

export default function GrantsForm() {
  const [aiInput, setAiInput] = useState('');

  const onboardingSteps = [
    { name: 'scope_alignment', status: 'done' },
    { name: 'access_setup', status: 'in_progress' },
    { name: 'delivery_rhythm', status: 'pending' },
    { name: 'grant_followthrough', status: 'pending' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#94a3b8';
      default: return '#64748b';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#0f172a' }}>
          AI Search
        </label>
        <input
          type="text"
          placeholder="Search grants..."
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Search Grants
        </button>
        <button
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Continue Onboarding
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Onboarding Steps</h3>
        {onboardingSteps.map((step, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              background: '#f8fafc',
              borderRadius: '6px',
              fontSize: '0.95rem'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getStatusColor(step.status),
                flexShrink: 0
              }}
            />
            <span style={{ color: '#64748b' }}>
              {step.name}: <strong>{step.status}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
