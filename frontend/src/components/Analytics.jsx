import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../styles/Analytics.module.css';
import LoadingSpinner from './LoadingSpinner';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Analytics() {
  const { dashboard, isLoading, error, fetchDashboard } = useAnalytics();

  if (isLoading) return <LoadingSpinner message="Loading analytics..." />;
  if (error) return <div className={styles['error-message']}>Error: {error}</div>;
  if (!dashboard) return <div>No data available</div>;

  const topIssuesData = dashboard.top_issues?.slice(0, 5) || [];

  return (
    <div className={styles['analytics-container']}>
      <h2>Analytics Dashboard</h2>

      <div className={styles['metrics-grid']}>
        <div className={styles['metric-card']}>
          <h3>Total Interactions</h3>
          <p className={styles['metric-value']}>{dashboard.total_interactions || 0}</p>
        </div>

        <div className={styles['metric-card']}>
          <h3>Avg Effectiveness</h3>
          <p className={styles['metric-value']}>{((dashboard.avg_effectiveness || 0) * 100).toFixed(0)}%</p>
        </div>

        <div className={styles['metric-card']}>
          <h3>Learning Trend</h3>
          <p className={styles['metric-value']}>{dashboard.learning_trend || '0%'}</p>
        </div>

        <div className={styles['metric-card']}>
          <h3>Top Issue</h3>
          <p className={styles['metric-value']}>{topIssuesData[0]?.category || 'N/A'}</p>
        </div>
      </div>

      {topIssuesData.length > 0 && (
        <div className={styles['chart-container']}>
          <h3>Top Issues by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topIssuesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={styles['action-section']}>
        <button onClick={fetchDashboard} className={styles['refresh-button']}>
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}
