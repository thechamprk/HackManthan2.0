import { useEffect, useMemo, useState } from 'react';
import { analytics, request } from '../utils/api';
import { ANALYTICS_INTERACTIONS_LIMIT } from '../utils/constants';

export function useAnalytics() {
  const [dashboard, setDashboard] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchMetrics() {
      try {
        const [dashboardPayload, metricsPayload, interactionsPayload] = await Promise.all([
          analytics.getDashboard(),
          analytics.getMetrics(),
          request(`/api/analytics/interactions?limit=${ANALYTICS_INTERACTIONS_LIMIT}`)
        ]);

        if (active) {
          setDashboard(dashboardPayload.data);
          setMetrics(metricsPayload.data);
          setInteractions(interactionsPayload.data || []);
          setError('');
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
        if (!item.timestamp) {
          return acc;
        }

        const day = new Date(item.timestamp).toLocaleDateString();
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

  return {
    dashboard,
    metrics,
    interactions,
    chartData,
    isLoading: loading,
    loading,
    error,
    fetchDashboard: async () => {
      const payload = await analytics.getDashboard();
      setDashboard(payload.data);
      return payload.data;
    }
  };
}
