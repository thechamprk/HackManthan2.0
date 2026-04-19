import { useState, useEffect } from 'react';
import { analytics } from '../utils/api';

export const useAnalytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await analytics.getDashboard();
      setDashboard(response?.data || response);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await analytics.getMetrics();
      setMetrics(response?.data || response);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    metrics,
    isLoading,
    error,
    fetchDashboard,
    fetchMetrics
  };
};

export default useAnalytics;
