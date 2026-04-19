import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Documentation from './pages/Documentation';
import { ROUTES } from './utils/constants';

function App() {
  const [route, setRoute] = useState({
    pathname: window.location.pathname,
    search: window.location.search
  });

  useEffect(() => {
    const syncRoute = () =>
      setRoute({
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

  const params = useMemo(() => new URLSearchParams(route.search), [route.search]);
  const customerName = params.get('name') || 'Guest';

  const page = useMemo(() => {
    if (route.pathname === ROUTES.HOME) return <Home search={route.search} onNavigate={navigate} />;
    if (route.pathname === ROUTES.DASHBOARD) return <Dashboard />;
    if (route.pathname === ROUTES.DOCS) return <Documentation />;
    return <Landing onNavigate={navigate} />;
  }, [route.pathname, route.search, navigate]);

  const showShell = route.pathname !== ROUTES.LANDING;

  return (
    <ErrorBoundary>
      <div className="page-shell">
        {showShell ? (
          <Header customerName={customerName} onNavigate={navigate} onLogout={() => navigate(ROUTES.LANDING)} />
        ) : null}
        <main className="page-main">{page}</main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
