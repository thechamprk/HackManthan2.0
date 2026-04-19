import { useMemo, useRef, useState } from 'react';
import MemoryContext from './MemoryContext';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function confidenceClass(score = 0) {
  if (score >= 0.75) return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300';
  if (score >= 0.5) return 'border-amber-500/30 bg-amber-500/15 text-amber-200';
  return 'border-rose-500/30 bg-rose-500/15 text-rose-300';
}

function ChatInterface({ customerId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastMetadata, setLastMetadata] = useState(null);
  const [resolvedIds, setResolvedIds] = useState({});
  const messageEndRef = useRef(null);

  const conversationContext = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role === 'agent' ? 'assistant' : 'user',
        content: m.content
      })),
    [messages]
  );

  async function sendSupportMessage(content) {
    if (!content.trim() || loading) return;
    const userMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const nextContext = [...conversationContext, { role: 'user', content: userMessage.content }];

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const requestBody = {
        customer_id: customerId,
        customerId,
        message: userMessage.content,
        conversation_context: nextContext,
        conversationContext: nextContext
      };

      const response = await fetch(`${API_URL}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message || 'Failed to send message');
      }

      const data = payload.data;
      const agentMessage = {
        id: data.interaction_id,
        role: 'agent',
        interactionId: data.interaction_id,
        content: data.agent_response || data.agentResponse,
        timestamp: data.timestamp || new Date().toISOString(),
        confidence: Number(data.confidence_score ?? data.confidenceScore ?? 0),
        provider: data.provider || 'agent'
      };

      setMessages((prev) => [...prev, agentMessage]);
      setLastMetadata(data);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'agent',
          content: `I could not complete that request: ${error.message}`,
          timestamp: new Date().toISOString(),
          confidence: 0,
          provider: 'system'
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  async function sendMessage(event) {
    event.preventDefault();
    await sendSupportMessage(message);
  }

  async function markResolved(interactionId) {
    if (!interactionId || resolvedIds[interactionId]) return;

    try {
      const response = await fetch(`${API_URL}/api/support/${interactionId}/effectiveness`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ effectiveness_score: 1.0 })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message || 'Failed to mark as resolved');
      }
      setResolvedIds((prev) => ({ ...prev, [interactionId]: true }));
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `resolve_err_${Date.now()}`,
          role: 'agent',
          content: `Unable to update resolution status: ${error.message}`,
          timestamp: new Date().toISOString(),
          confidence: 0,
          provider: 'system'
        }
      ]);
    }
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
            <article
              key={item.id}
              className={`mb-3 max-w-[85%] rounded-2xl p-3 text-sm animate-fade-up ${
                item.role === 'user'
                  ? 'ml-auto bg-gradient-to-r from-[var(--purple)] to-[#9b8bff] text-white'
                  : 'border border-white/10 bg-[var(--surface)] text-slate-100'
              }`}
            >
              <p>{item.content}</p>
              <footer className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs opacity-90">
                <span>{item.role === 'user' ? 'You' : 'Agent'}</span>
                <div className="flex items-center gap-2">
                  {item.role === 'agent' && typeof item.confidence === 'number' && (
                    <span className={`rounded-full border px-2 py-0.5 ${confidenceClass(item.confidence)}`}>
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                  {item.role === 'agent' && (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-slate-300">
                      {item.provider || 'agent'}
                    </span>
                  )}
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </footer>
              {item.role === 'agent' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
                    onClick={() => sendSupportMessage('Tell me more')}
                  >
                    Tell me more
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
                    onClick={() => sendSupportMessage("That didn't help")}
                  >
                    That didn't help
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200 disabled:opacity-50"
                    disabled={!item.interactionId || resolvedIds[item.interactionId]}
                    onClick={() => markResolved(item.interactionId)}
                  >
                    {resolvedIds[item.interactionId] ? 'Resolved' : 'Mark as resolved'}
                  </button>
                </div>
              )}
            </article>
          ))}

          {loading && (
            <div className="mb-3 flex max-w-[85%] items-center gap-1 rounded-2xl border border-dashed border-white/20 bg-[var(--surface)] p-3 text-sm text-slate-300">
              Agent is typing
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[var(--teal)]" />
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[var(--teal)] [animation-delay:0.15s]" />
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-[var(--teal)] [animation-delay:0.3s]" />
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
