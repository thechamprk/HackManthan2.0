import { useMemo, useRef, useState } from 'react';
import MemoryContext from './MemoryContext';
import { API_URL } from '../utils/constants';

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatInterface({ customerId }) {
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
      const response = await fetch(`${API_URL}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          customerId,
          message: userMessage.content,
          conversation_context: nextContext,
          conversationContext: nextContext
        })
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message || 'Failed to send support message');
      }

      const data = payload.data;
      setMessages((prev) => [
        ...prev,
        {
          id: data.interaction_id || `a_${Date.now()}`,
          role: 'agent',
          content: data.agent_response || 'No response',
          timestamp: new Date().toISOString(),
          provider: data.provider || 'agent',
          confidence: Number(data.confidence_score ?? 0)
        }
      ]);
      setLastMetadata(data);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e_${Date.now()}`,
          role: 'agent',
          content: `Error: ${error.message}`,
          timestamp: new Date().toISOString(),
          provider: 'system',
          confidence: 0
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  return (
    <section className="chat-grid">
      <div className="chat-card">
        <header className="chat-title">
          <h2>Support Assistant</h2>
          <span className="customer-pill">ID: {customerId}</span>
        </header>

        <div className="chat-body">
          {messages.length === 0 && <p className="muted">Start by asking your support question.</p>}

          {messages.map((m) => (
            <article key={m.id} className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-agent'}`}>
              <p>{m.content}</p>
              <small>
                {m.role === 'user' ? 'You' : 'Agent'} · {formatTime(m.timestamp)}
              </small>
            </article>
          ))}

          {loading && (
            <div className="bubble bubble-agent">
              Agent is typing<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>

        <form
          className="chat-input-row"
          onSubmit={(e) => {
            e.preventDefault();
            sendSupportMessage(message);
          }}
        >
          <input
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn-primary" type="submit" disabled={loading}>
            Send
          </button>
        </form>
      </div>

      <MemoryContext memory={lastMetadata?.hindsight_memory_used} />
    </section>
  );
}

export default ChatInterface;
