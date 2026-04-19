import { useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import LoadingSpinner from './LoadingSpinner';
import MemoryContext from './MemoryContext';
import MessageItem from './MessageItem';

function ChatInterface({ customerId }) {
  const [message, setMessage] = useState('');
  const { messages, loading, lastMetadata, resolvedIds, sendSupportMessage, markInteractionResolved } = useChat(customerId);
  const messageEndRef = useRef(null);

  async function sendMessage(event) {
    event.preventDefault();
    await sendSupportMessage(message);
    setMessage('');
    setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="glass-card rounded-3xl p-4 shadow-soft md:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">HindsightHub Support Agent</h1>
            <p className="text-sm text-slate-300">AI support with persistent memory and contextual learning.</p>
          </div>
          <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">ID: {customerId}</p>
        </header>

        <div className="h-[52vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/20 p-4" aria-live="polite" aria-label="Messages list">
          {messages.length === 0 && <p className="text-sm text-slate-400">Start by asking a support question.</p>}

          {messages.map((item) => (
            <MessageItem
              key={item.id}
              item={item}
              resolved={Boolean(resolvedIds[item.interactionId])}
              onQuickReply={sendSupportMessage}
              onResolve={markInteractionResolved}
            />
          ))}

          {loading && (
            <div className="mb-3 max-w-[85%] rounded-2xl border border-dashed border-white/20 bg-[var(--surface)] p-3">
              <LoadingSpinner label="Agent is typing" />
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
          <input
            aria-label="Support message"
            className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:ring-2 focus:ring-[var(--teal)]"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--teal)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {lastMetadata && (
          <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-sm text-amber-100">
            <p>Similar past cases used: {lastMetadata.similar_past_cases}</p>
            <p>Average effectiveness of matched cases: {(lastMetadata.avg_effectiveness * 100).toFixed(0)}%</p>
          </div>
        )}
      </div>

      <MemoryContext memory={lastMetadata?.hindsight_memory_used} />
    </section>
  );
}

export default ChatInterface;
