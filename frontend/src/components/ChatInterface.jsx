import { useMemo, useRef, useState } from 'react';
import MemoryContext from './MemoryContext';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatInterface() {
  const [customerId, setCustomerId] = useState('cust_demo_001');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastMetadata, setLastMetadata] = useState(null);
  const messageEndRef = useRef(null);

  const conversationContext = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role === 'agent' ? 'assistant' : 'user',
        content: m.content
      })),
    [messages]
  );

  async function sendMessage(event) {
    event.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          message: userMessage.content,
          conversation_context: conversationContext
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message || 'Failed to send message');
      }

      const data = payload.data;
      const agentMessage = {
        id: data.interaction_id,
        role: 'agent',
        content: data.agent_response,
        timestamp: new Date().toISOString(),
        confidence: data.confidence_score
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
          confidence: 0
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft md:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">HindsightHub Support Agent</h1>
            <p className="text-sm text-slate-600">AI support with persistent memory and contextual learning.</p>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700" htmlFor="customer-id">
            Customer ID
            <input
              id="customer-id"
              aria-label="Customer identifier"
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </label>
        </header>

        <div className="h-[52vh] overflow-y-auto rounded-2xl bg-slate-50 p-4" aria-live="polite" aria-label="Messages list">
          {messages.length === 0 && <p className="text-sm text-slate-500">Start by asking a support question.</p>}

          {messages.map((item) => (
            <article
              key={item.id}
              className={`mb-3 max-w-[85%] rounded-2xl p-3 text-sm animate-rise ${
                item.role === 'user'
                  ? 'ml-auto bg-brand-ocean text-white'
                  : 'border border-slate-200 bg-white text-slate-800'
              }`}
            >
              <p>{item.content}</p>
              <footer className="mt-2 flex items-center justify-between text-xs opacity-80">
                <span>{item.role === 'user' ? 'You' : 'Agent'}</span>
                <span>{formatTime(item.timestamp)}</span>
              </footer>
              {item.role === 'agent' && typeof item.confidence === 'number' && (
                <p className="mt-1 text-xs">Confidence: {(item.confidence * 100).toFixed(0)}%</p>
              )}
            </article>
          ))}

          {loading && (
            <div className="mb-3 max-w-[85%] rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
              Agent is thinking...
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
          <input
            aria-label="Support message"
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none ring-brand-ocean transition focus:ring-2"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-brand-mint px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {lastMetadata && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
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
