import { useEffect, useMemo, useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import MemoryContext from '../components/MemoryContext';

function Home({ search, onNavigate }) {
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const customerId = params.get('customerId') || '';
  const [memory, setMemory] = useState({ retrieved_cases: [], patterns_applied: [] });

  useEffect(() => {
    if (!customerId) {
      onNavigate('/');
    }
  }, [customerId, onNavigate]);

  if (!customerId) return null;

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 md:grid-cols-[1fr_320px] md:px-6 lg:px-8">
      <ChatInterface customerId={customerId} onMemoryUpdate={setMemory} />
      <MemoryContext memory={memory} />
    </div>
  );
}

export default Home;
