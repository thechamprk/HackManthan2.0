import { useEffect, useState } from 'react';
import { analytics } from '../utils/api';

const REFRESH_INTERVAL_MS = 30000;

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const payload = await analytics.getDashboard();
        if (mounted && payload?.success) setData(payload.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      }
    }

    load();
    const id = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!data) return <section className="analytics-card">Loading analytics...</section>;

  return (
    <section className="analytics-card">
      <h3>Analytics</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <small>Total Interactions</small>
          <strong>{data.total_interactions ?? 0}</strong>
        </div>
        <div className="stat-box">
          <small>Avg Effectiveness</small>
          <strong>{Math.round((data.avg_effectiveness ?? 0) * 100)}%</strong>
        </div>
        <div className="stat-box">
          <small>Learning Trend</small>
          <strong>{data.learning_trend ?? 0}%</strong>
        </div>
        <div className="stat-box">
          <small>Top Issue</small>
          <strong>{data.top_issues?.[0]?.issue || 'n/a'}</strong>
        </div>
      </div>
    </section>
  );
}

export default Analytics;
