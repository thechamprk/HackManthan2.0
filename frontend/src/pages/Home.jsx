import { useEffect, useMemo } from 'react';
import ChatInterface from '../components/ChatInterface';
import Analytics from '../components/Analytics';
import ThemeToggle from '../components/ThemeToggle';

function Home({ search, onNavigate }) {
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const customerId = params.get('customerId') || '';
  const customerName = params.get('name') || 'Guest';

  useEffect(() => {
    if (!customerId) onNavigate('/');
  }, [customerId, onNavigate]);

  if (!customerId) return null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Hindsight Expert</h1>
          <p>AI Support with Persistent Memory</p>
        </div>
        <div className="app-header-right">
          <span>Customer: {customerName}</span>
          <span className="live-dot-wrap">
            <span className="live-dot" />
            Live
          </span>
          <ThemeToggle />
          <button className="btn-secondary" onClick={() => onNavigate(`/insights${search || ''}`)}>
            iNSIGHTS
          </button>
          <button className="btn-secondary" onClick={() => onNavigate('/')}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        <ChatInterface customerId={customerId} />
        <Analytics />
      </main>
    </div>
  );
}

export default Home;