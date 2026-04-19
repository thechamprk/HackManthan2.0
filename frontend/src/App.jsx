import { useCallback, useEffect, useMemo, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';
import Home from './pages/Home';
import Landing from './pages/Landing';
import { ROUTES } from './utils/constants';
import './styles/common.css';

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

  const customerName = useMemo(() => new URLSearchParams(route.search).get('name') || 'Guest', [route.search]);

  const handleLogout = useCallback(() => {
    navigate(ROUTES.LANDING);
  }, [navigate]);

  const screen = useMemo(() => {
    if (route.pathname === ROUTES.HOME) {
      return <Home search={route.search} onNavigate={navigate} />;
    }

    if (route.pathname === ROUTES.DASHBOARD) {
      return <Dashboard />;
    }

    if (route.pathname === ROUTES.DOCS) {
      return <Documentation />;
    }

    return <Landing onNavigate={navigate} />;
  }, [navigate, route.pathname, route.search]);

  return (
    <ErrorBoundary>
      <div className="page-shell min-h-screen bg-app-gradient text-white">
        {route.pathname !== ROUTES.LANDING && (
          <Header customerName={customerName} onNavigate={navigate} onLogout={handleLogout} />
        )}
        <div className="page-main">{screen}</div>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
