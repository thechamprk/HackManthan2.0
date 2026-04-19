import { useEffect, useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchMetrics() {
      try {
        const [dashboardResponse, interactionsResponse] = await Promise.all([
          fetch(`${API_URL}/api/analytics/dashboard`),
          fetch(`${API_URL}/api/analytics/interactions?limit=300`)
        ]);

        const [dashboardPayload, interactionsPayload] = await Promise.all([
          dashboardResponse.json(),
          interactionsResponse.json()
        ]);

        if (!dashboardResponse.ok || !dashboardPayload.success) {
          throw new Error(dashboardPayload?.error?.message || 'Failed to load analytics');
        }
        if (!interactionsResponse.ok || !interactionsPayload.success) {
          throw new Error(interactionsPayload?.error?.message || 'Failed to load interactions');
        }

        if (active) {
          setDashboard(dashboardPayload.data);
          setInteractions(interactionsPayload.data || []);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const chartData = useMemo(
    () =>
      interactions.reduce((acc, item) => {
        const day = new Date(item.timestamp || Date.now()).toLocaleDateString();
        const existing = acc.find((entry) => entry.day === day);
        if (existing) {
          existing.interactions += 1;
        } else {
          acc.push({ day, interactions: 1 });
        }
        return acc;
      }, []),
    [interactions]
  );

  const activeCustomers = useMemo(() => new Set(interactions.map((item) => item.customer_id)).size, [interactions]);
  const topIssue = dashboard?.top_issues?.[0]?.issue || 'n/a';
  const avgConfidence = Number(dashboard?.avg_effectiveness || 0);

  if (loading) {
    return <section className="glass-card rounded-2xl p-5 shadow-soft animate-shimmer">Loading analytics...</section>;
  }

  if (error) {
    return <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200">{error}</section>;
  }

  return (
    <section className="glass-card rounded-2xl p-5 shadow-soft" aria-label="Analytics dashboard">
      <h2 className="font-heading text-xl font-bold text-white">Memory Analytics Dashboard</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Interactions</p>
          <p className="gradient-text text-2xl font-bold">{dashboard.total_interactions}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Avg Confidence</p>
          <p className="gradient-text text-2xl font-bold">{(avgConfidence * 100).toFixed(0)}%</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Top Issue Type</p>
          <p className="gradient-text text-2xl font-bold">{topIssue}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Active Customers</p>
          <p className="gradient-text text-2xl font-bold">{activeCustomers}</p>
        </article>
      </div>

      <div className="mt-5 h-64 rounded-xl border border-white/10 bg-black/20 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#cbd5e1' }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#cbd5e1' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111118',
                border: '1px solid #2a2a3a',
                borderRadius: '10px',
                color: '#fff'
              }}
            />
            <Line type="monotone" dataKey="interactions" stroke="#7c6af7" strokeWidth={2.5} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default Analytics;
