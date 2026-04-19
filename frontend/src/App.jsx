import { useCallback, useEffect, useMemo, useState } from 'react';
import Landing from './pages/Landing';
import Home from './pages/Home';

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

  const screen = useMemo(() => {
    if (route.pathname === '/app') return <Home search={route.search} onNavigate={navigate} />;
    return <Landing onNavigate={navigate} />;
  }, [route.pathname, route.search, navigate]);

  return (
    <div>{screen}</div>
  );
}

export default App;
