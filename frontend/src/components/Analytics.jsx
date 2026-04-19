import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Analytics.module.css';
import { analytics } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await analytics.getDashboard();
      setDashboard(response?.data || response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading analytics..." />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!dashboard) return <div>No data available</div>;

  const topIssuesData = dashboard.top_issues?.slice(0, 5) || [];

  return (
    <div className="analytics-container">
      <h2>Analytics Dashboard</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Interactions</h3>
          <p className="metric-value">{dashboard.total_interactions || 0}</p>
        </div>

        <div className="metric-card">
          <h3>Avg Effectiveness</h3>
          <p className="metric-value">{((dashboard.avg_effectiveness || 0) * 100).toFixed(0)}%</p>
        </div>

        <div className="metric-card">
          <h3>Learning Trend</h3>
          <p className="metric-value">{dashboard.learning_trend || '0%'}</p>
        </div>

        <div className="metric-card">
          <h3>Top Issue</h3>
          <p className="metric-value">{topIssuesData[0]?.category || 'N/A'}</p>
        </div>
      </div>

      {topIssuesData.length > 0 && (
        <div className="chart-container">
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

      <div className="action-section">
        <button onClick={fetchDashboard} className="refresh-button">
          🔄 Refresh Analytics
        </button>
      </div>
    </div>
  );
}
