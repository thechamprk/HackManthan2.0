import { useEffect, useMemo } from 'react';
import ChatInterface from '../components/ChatInterface';
import Analytics from '../components/Analytics';

function Home({ search, onNavigate }) {
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const customerId = params.get('customerId') || '';
  const customerName = params.get('name') || 'Guest';

  useEffect(() => {
    if (!customerId) {
      onNavigate('/');
    }
  }, [customerId, onNavigate]);

  if (!customerId) {
    return null;
  }

  function handleLogout() {
    onNavigate('/');
  }

  return (
    <div>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[rgba(10,10,15,0.75)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <div>
            <h1 className="font-heading text-2xl font-extrabold">HindsightHub</h1>
            <p className="text-xs text-slate-400">AI Support with Persistent Memory</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-200">Customer: {customerName}</p>
            <span className="flex items-center gap-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              Live
            </span>
            <button
              type="button"
              className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <ChatInterface customerId={customerId} />
        <Analytics />
      </main>
    </div>
  );
}

export default Home;
