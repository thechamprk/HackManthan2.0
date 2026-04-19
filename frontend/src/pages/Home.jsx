import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import MemoryContext from '../components/MemoryContext';
import Analytics from '../components/Analytics';

function Home() {
  const [memory, setMemory] = useState({ retrieved_cases: [], patterns_applied: [] });

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <section className="mb-4">
        <p className="text-sm text-slate-600">Track support conversations, reference prior cases, and monitor quality metrics.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ChatInterface onMemoryUpdate={(nextMemory) => setMemory(nextMemory || { retrieved_cases: [], patterns_applied: [] })} />
        <MemoryContext memory={memory} />
      </section>

      <section className="mt-6">
        <Analytics />
      </section>
    </main>
  );
}

export default Home;
