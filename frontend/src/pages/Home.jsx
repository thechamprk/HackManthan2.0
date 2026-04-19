import { useEffect, useMemo } from 'react';
import ChatInterface from '../components/ChatInterface';

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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <p className="text-sm text-slate-300">Customer: {customerName}</p>
      <ChatInterface customerId={customerId} />
    </main>
  );
}

export default Home;
