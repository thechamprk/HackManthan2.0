import React, { useState } from 'react';

export default function DeepSearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // TODO: Add API call for deep search
      console.log('Searching:', searchQuery);

      setTimeout(() => {
        setIsSearching(false);
      }, 2000);
    } catch (err) {
      console.error('Search error:', err);
      setIsSearching(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#0f172a' }}>
          Search About AI
        </label>
        <textarea
          placeholder="Enter your search query..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          rows="4"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={isSearching}
        style={{
          width: '100%',
          padding: '0.75rem 1.5rem',
          background: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: isSearching ? 'not-allowed' : 'pointer',
          marginBottom: '2rem',
          opacity: isSearching ? 0.6 : 1
        }}
      >
        {isSearching ? '⏳ Searching...' : 'Run Deep Search'}
      </button>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Summary</h3>
        <div
          style={{
            background: '#f8fafc',
            padding: '1.5rem',
            borderRadius: '8px',
            borderLeft: '4px solid #3b82f6'
          }}
        >
          <p style={{ margin: '0 0 0.75rem 0', fontWeight: '600', color: '#0f172a' }}>
            Dominant issue: general_support
          </p>
          <p style={{ margin: 0, color: '#64748b', lineHeight: '1.5', fontSize: '0.95rem' }}>
            Prioritize experiments around "general_support" and validate against latest support memory.
          </p>
        </div>
      </div>
    </div>
  );
}
