import { useEffect, useMemo, useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import MemoryContext from '../components/MemoryContext';
import Analytics from '../components/Analytics';

export default function Home({ search, onNavigate }) {
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const customerId = params.get('customerId') || '';
  const customerName = params.get('name') || 'Guest';
  const [memory, setMemory] = useState({ retrieved_cases: [], patterns_applied: [] });

  useEffect(() => {
    if (!customerId) onNavigate('/');
  }, [customerId, onNavigate]);

  if (!customerId) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
        padding: '0 2rem', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'grid', placeItems: 'center', fontSize: 14
          }}>🧠</div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
              HindsightHub
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
              AI Support · Persistent Memory
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{customerName}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--muted)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
            Live
          </span>
          <button onClick={() => onNavigate('/')} style={{
            padding: '5px 14px', borderRadius: 8,
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--muted)', fontSize: '0.8rem', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{
        maxWidth: 1400, margin: '0 auto', padding: '1.5rem',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem'
      }}>
        <ChatInterface
          customerId={customerId}
          onMemoryUpdate={m => setMemory(m || { retrieved_cases: [], patterns_applied: [] })}
        />
        <MemoryContext data={memory} />
      </main>

      {/* Analytics */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <Analytics />
      </section>
    </div>
  );
}