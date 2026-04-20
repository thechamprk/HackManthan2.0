import React, { useState } from 'react';

export default function AIToDoForm() {
  const [expandedItem, setExpandedItem] = useState(null);

  const items = [
    {
      id: 1,
      title: 'Generate an image',
      description: 'Generate visual representation of project'
    },
    {
      id: 2,
      title: 'Structure AI task map',
      description: 'Convert input context into categorized tasks: Generate an image'
    },
    {
      id: 3,
      title: 'Prepare grant continuity checklist',
      description: 'Document grant-readiness artifacts for 4 week timeline.'
    },
    {
      id: 4,
      title: 'Run deep search synthesis',
      description: 'Summarize prior support trends: latest dominant issue type is'
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <button
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Generate To-Dos
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Structure AI task map</h3>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              marginBottom: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
              style={{
                width: '100%',
                padding: '1rem',
                background: expandedItem === item.id ? '#f0f9ff' : '#ffffff',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: '600',
                color: '#0f172a',
                fontSize: '0.95rem'
              }}
            >
              <span>{item.title}</span>
              <span>{expandedItem === item.id ? '▼' : '▶'}</span>
            </button>
            {expandedItem === item.id && (
              <div
                style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '0.95rem',
                  lineHeight: '1.5'
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
