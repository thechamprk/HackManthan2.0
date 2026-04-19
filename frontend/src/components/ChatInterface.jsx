import { useState, useRef, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:3000';

export default function ChatInterface({ onMemoryUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [customerId, setCustomerId] = useState('cust_demo_001');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          message: text,
          conversation_context: messages.slice(-6)
        })
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message || 'Support request failed');
      }
      const d = json.data || json;

      const agentMsg = {
        role: 'agent',
        content: d.agent_response,
        confidence: d.confidence_score,
        cases: d.similar_past_cases,
        provider: d.provider,
        ts: Date.now()
      };
      setMessages(prev => [...prev, agentMsg]);
      if (onMemoryUpdate) onMemoryUpdate(d.hindsight_memory_used);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'agent',
        content: `Something went wrong: ${e.message || 'Please try again.'}`,
        ts: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const confColor = (c) => {
    if (!c) return 'var(--muted)';
    if (c >= 0.75) return 'var(--success)';
    if (c >= 0.5) return 'var(--accent3)';
    return '#fc8181';
  };

  return (
    <div className="glass" style={{
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 220px)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em'
          }}>Customer Conversation</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>
            Structured responses informed by historical cases
          </p>
        </div>

        {/* Customer ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ID</span>
          <input
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              width: 130
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            opacity: 0.75, gap: 12
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: '1px solid var(--border)',
              background: 'var(--surface2)',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--accent)',
              fontWeight: 700
            }}>S</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center' }}>
              Start a support conversation to see suggested responses and context.
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className="fade-up" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: m.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            {m.role === 'user' ? (
              <div style={{
                background: 'var(--accent)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '16px 16px 4px 16px',
                maxWidth: '75%',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                boxShadow: '0 6px 16px rgba(31,111,235,0.2)'
              }}>
                {m.content}
              </div>
            ) : (
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  padding: '12px 16px',
                  borderRadius: '4px 16px 16px 16px',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text)'
                }}>
                  {m.content}
                </div>
                {/* Metadata */}
                {(m.confidence || m.cases !== undefined) && (
                  <div style={{
                    display: 'flex', gap: 12, marginTop: 6,
                    paddingLeft: 4, flexWrap: 'wrap'
                  }}>
                    {m.confidence && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: confColor(m.confidence),
                        display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: confColor(m.confidence),
                          display: 'inline-block'
                        }}/>
                        {Math.round(m.confidence * 100)}% confidence
                      </span>
                    )}
                    {m.cases !== undefined && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                        {m.cases} similar cases
                      </span>
                    )}
                    {m.provider && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                        via {m.provider}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              padding: '14px 18px',
              borderRadius: '4px 16px 16px 16px',
              display: 'flex', gap: 6, alignItems: 'center'
            }}>
              <div className="thinking-dot" />
              <div className="thinking-dot" />
              <div className="thinking-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 10
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your issue… (Enter to send)"
          rows={1}
          style={{
            flex: 1, padding: '10px 14px',
            resize: 'none', fontSize: '0.875rem',
            lineHeight: 1.5
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            background: loading || !input.trim()
              ? 'var(--border)'
              : 'var(--accent)',
            color: loading || !input.trim() ? 'var(--muted)' : '#fff',
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'Manrope, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}