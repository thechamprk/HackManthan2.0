import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import LoadingSpinner from './LoadingSpinner';

function Analytics() {
  const { dashboard, interactions, chartData, loading, error } = useAnalytics();
  const activeCustomers = useMemo(() => new Set(interactions.map((item) => item.customer_id)).size, [interactions]);
  const topIssue = dashboard?.top_issues?.[0]?.issue || 'n/a';
  const avgConfidence = Number(dashboard?.avg_effectiveness || 0);

  if (loading) {
    return (
      <section className="glass-card rounded-2xl p-5 shadow-soft animate-shimmer">
        <LoadingSpinner label="Loading analytics..." />
      </section>
    );
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
