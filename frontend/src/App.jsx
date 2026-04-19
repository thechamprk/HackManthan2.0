import { useCallback, useEffect, useMemo, useState, Component } from 'react';
import Landing from './pages/Landing';
import Home from './pages/Home';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          margin: '3rem auto', maxWidth: 480, padding: '2rem',
          background: 'var(--surface)', border: '1px solid #f87171',
          borderRadius: 12, color: '#fca5a5'
        }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, fontSize: '0.875rem' }}>{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [route, setRoute] = useState({
    pathname: window.location.pathname,
    search: window.location.search
  });

  useEffect(() => {
    const syncRoute = () => setRoute({
      pathname: window.location.pathname,
      search: window.location.search
    });
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('routechange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('routechange', syncRoute);
    };
  }, []);

  const navigate = useCallback((path) => {
    if (`${window.location.pathname}${window.location.search}` === path) return;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('routechange'));
  }, []);

  const screen = useMemo(() => {
    if (route.pathname === '/app') {
      return <Home search={route.search} onNavigate={navigate} />;
    }
    return <Landing onNavigate={navigate} />;
  }, [route.pathname, route.search, navigate]);

  return (
    <ErrorBoundary>
      <div style={{ minHeight: '100vh' }}>{screen}</div>
    </ErrorBoundary>
  );
}

export default App;