import { Component, useCallback, useEffect, useMemo, useState } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown UI error' };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] UI crash', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto mt-12 max-w-xl rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm">{this.state.message}</p>
        </main>
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
    function syncRoute() {
      setRoute({
        pathname: window.location.pathname,
        search: window.location.search
      });
    }

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
  }, [navigate, route.pathname, route.search]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-app-gradient text-white">{screen}</div>
    </ErrorBoundary>
  );
}

export default App;
