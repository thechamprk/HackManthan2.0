import { useState, useRef, useEffect, useMemo } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function confColor(score = 0) {
  if (score >= 0.75) return { bg: 'rgba(72,187,120,0.15)', border: 'rgba(72,187,120,0.3)', text: '#68d391' };
  if (score >= 0.5)  return { bg: 'rgba(246,173,85,0.15)',  border: 'rgba(246,173,85,0.3)',  text: '#f6ad55' };
  return               { bg: 'rgba(252,129,129,0.15)', border: 'rgba(252,129,129,0.3)', text: '#fc8181' };
}

export default function ChatInterface({ customerId, onMemoryUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resolvedIds, setResolvedIds] = useState({});
  const bottomRef = useRef(null);

  const conversationContext = useMemo(() =>
    messages.map(m => ({
      role: m.role === 'agent' ? 'assistant' : 'user',
      content: m.content
    })), [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setMessages(prev => [...prev, {
      id: `u_${Date.now()}`, role: 'user',
      content: msg, timestamp: new Date().toISOString()
    }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId, customerId,
          message: msg,
          conversation_context: conversationContext,
          conversationContext
        })
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error?.message || 'Request failed');
      const d = json.data || json;

      setMessages(prev => [...prev, {
        id: d.interaction_id || `a_${Date.now()}`,
        role: 'agent',
        interactionId: d.interaction_id,
        content: d.agent_response,
        confidence: Number(d.confidence_score ?? 0),
        cases: d.similar_past_cases,
        provider: d.provider,
        timestamp: new Date().toISOString()
      }]);
      if (onMemoryUpdate) onMemoryUpdate(d.hindsight_memory_used);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: `e_${Date.now()}`, role: 'agent',
        content: `Error: ${e.message}`,
        timestamp: new Date().toISOString(), confidence: 0
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function markResolved(interactionId) {
    if (!interactionId || resolvedIds[interactionId]) return;
    try {
      await fetch(`${API}/api/support/${interactionId}/effectiveness`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ effectiveness_score: 1.0 })
      });
      setResolvedIds(prev => ({ ...prev, [interactionId]: true }));
    } catch (e) {
      console.warn('Failed to mark resolved', e.message);
    }
  }

  return (
    <div className="glass" style={{
      borderRadius: 16, display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 160px)', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
            Support Agent
          </h2>
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
            AI-powered · learns from every interaction
          </p>
        </div>
        <span style={{
          padding: '4px 12px', borderRadius: 20,
          background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.25)',
          fontSize: '0.7rem', color: 'var(--accent)'
        }}>
          {customerId}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5, gap: 10 }}>
            <div style={{ fontSize: 36 }}>🧠</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center' }}>
              Ask a support question to get started.
            </p>
          </div>
        )}

        {messages.map((m) => {
          const conf = confColor(m.confidence);
          return (
            <div key={m.id} className="fade-up" style={{
              display: 'flex', flexDirection: 'column',
              alignItems: m.role === 'user' ? 'flex-end' : 'flex-start'
            }}>
              {m.role === 'user' ? (
                <div style={{
                  background: 'linear-gradient(135deg, var(--accent), #6b5ce7)',
                  color: '#fff', padding: '10px 16px',
                  borderRadius: '16px 16px 4px 16px',
                  maxWidth: '75%', fontSize: '0.875rem', lineHeight: 1.5,
                  boxShadow: '0 4px 20px rgba(124,106,247,0.25)'
                }}>
                  <p>{m.content}</p>
                  <p style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                    {formatTime(m.timestamp)}
                  </p>
                </div>
              ) : (
                <div style={{ maxWidth: '82%' }}>
                  <div style={{
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    padding: '12px 16px', borderRadius: '4px 16px 16px 16px',
                    fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text)'
                  }}>
                    {m.content}
                  </div>

                  {/* Metadata */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, paddingLeft: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                    {m.confidence > 0 && (
                      <span style={{
                        padding: '2px 8px', borderRadius: 12,
                        background: conf.bg, border: `1px solid ${conf.border}`,
                        fontSize: '0.65rem', color: conf.text
                      }}>
                        {Math.round(m.confidence * 100)}% confidence
                      </span>
                    )}
                    {m.cases !== undefined && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>{m.cases} cases</span>
                    )}
                    {m.provider && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>via {m.provider}</span>
                    )}
                    <span style={{ fontSize: '0.65rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                      {formatTime(m.timestamp)}
                    </span>
                  </div>

                  {/* Quick replies */}
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingLeft: 4, flexWrap: 'wrap' }}>
                    {['Tell me more', "That didn't help"].map(label => (
                      <button key={label} onClick={() => send(label)} style={{
                        padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                        border: '1px solid var(--border)', background: 'transparent',
                        fontSize: '0.7rem', color: 'var(--muted)',
                        fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s'
                      }}>
                        {label}
                      </button>
                    ))}
                    <button
                      onClick={() => markResolved(m.interactionId)}
                      disabled={!m.interactionId || resolvedIds[m.interactionId]}
                      style={{
                        padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
                        border: '1px solid rgba(72,187,120,0.3)',
                        background: resolvedIds[m.interactionId] ? 'rgba(72,187,120,0.15)' : 'transparent',
                        fontSize: '0.7rem',
                        color: resolvedIds[m.interactionId] ? '#68d391' : 'var(--muted)',
                        fontFamily: 'DM Sans, sans-serif',
                        opacity: !m.interactionId ? 0.4 : 1
                      }}
                    >
                      {resolvedIds[m.interactionId] ? '✓ Resolved' : 'Mark resolved'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="fade-up" style={{ display: 'flex' }}>
            <div style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
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
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Describe your issue… (Enter to send)"
          rows={1}
          style={{ flex: 1, padding: '10px 14px', resize: 'none', fontSize: '0.875rem', lineHeight: 1.5 }}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            padding: