import { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`${API}/api/analytics/dashboard`);
        const payload = await res.json();
        if (mounted && payload?.success) setData(payload.data);
      } catch {
        // silent fail
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const stats = [
    { label: 'Total Interactions', value: data?.total_interactions ?? 0 },
    { label: 'Avg Effectiveness', value: `${Math.round((data?.avg_effectiveness ?? 0) * 100)}%` },
    { label: 'Learning Trend', value: `${data?.learning_trend ?? 0}%` },
    { label: 'Top Issue', value: data?.top_issues?.[0]?.issue?.replace(/_/g, ' ') || 'n/a' },
  ];

  return (
    <div className="glass" style={{ borderRadius: 16, padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <span style={{ fontSize: 16 }}>📊</span>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>
          Memory Analytics
        </h3>
        {!loading && (
          <span style={{
            marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--success)',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            Live
          </span>
        )}
      </div>

      <div className="accent-bar" style={{ marginBottom: '1.25rem' }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
          Loading analytics...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: '1rem', borderRadius: 12,
              background: 'var(--surface2)', border: '1px solid var(--border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '1.6rem', letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textTransform: 'capitalize'
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}