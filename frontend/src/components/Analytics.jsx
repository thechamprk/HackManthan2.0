import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

function Analytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchMetrics() {
      try {
        const response = await fetch(`${API_URL}/api/analytics/metrics`);
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload?.error?.message || 'Failed to load analytics');
        }

        if (active) setMetrics(payload.data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchMetrics();
    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(() => {
    if (!metrics?.top_issues) return [];
    return metrics.top_issues.map((item) => ({
      issue: item.issue,
      count: item.count
    }));
  }, [metrics]);

  if (loading) {
    return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">Loading analytics...</section>;
  }

  if (error) {
    return <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</section>;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-label="Analytics dashboard">
      <h2 className="text-xl font-bold text-slate-900">Memory Analytics Dashboard</h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total Interactions</p>
          <p className="text-2xl font-bold text-slate-900">{metrics.total_interactions}</p>
        </article>
        <article className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Avg Effectiveness</p>
          <p className="text-2xl font-bold text-slate-900">{(metrics.avg_effectiveness * 100).toFixed(0)}%</p>
        </article>
        <article className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Week-over-week</p>
          <p className="text-2xl font-bold text-slate-900">{metrics.week_over_week_improvement}%</p>
        </article>
        <article className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500">Resolution Time</p>
          <p className="text-2xl font-bold text-slate-900">{metrics.resolution_time_metrics?.avg_resolution_minutes || 0}m</p>
        </article>
      </div>

      <div className="mt-5 h-64 rounded-xl border border-slate-100 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="issue" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article>
          <h3 className="text-sm font-semibold text-slate-800">Most Effective Solutions</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {(metrics.most_effective_solutions || []).map((item) => (
              <li key={item.interaction_id} className="rounded-lg bg-slate-50 p-2">
                <p className="font-medium">{item.issue_type}</p>
                <p className="text-xs text-slate-500">Score: {((item.effectiveness_score || 0) * 100).toFixed(0)}%</p>
                <p className="line-clamp-2 text-xs">{item.response_preview}</p>
              </li>
            ))}
          </ul>
        </article>

        <article>
          <h3 className="text-sm font-semibold text-slate-800">Customer Satisfaction</h3>
          <div className="mt-2 rounded-lg bg-emerald-50 p-3">
            <p className="text-2xl font-bold text-emerald-700">{metrics.customer_satisfaction_trending?.score_percent || 0}%</p>
            <p className="text-sm text-emerald-800">{metrics.customer_satisfaction_trending?.label || 'n/a'}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Analytics;
