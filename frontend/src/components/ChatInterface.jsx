import { useEffect, useMemo, useRef, useState } from 'react';
import MemoryContext from './MemoryContext';
import { insights, support } from '../utils/api';

function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const TOPIC_RULES = [
  {
    key: 'billing',
    label: 'Billing & Payments',
    keywords: ['bill', 'billing', 'invoice', 'payment', 'charge', 'subscription', 'refund', 'plan', 'price']
  },
  {
    key: 'account',
    label: 'Account Access',
    keywords: ['login', 'password', 'account', 'signin', 'signup', 'locked', 'verify', 'otp']
  },
  {
    key: 'technical',
    label: 'Technical Issue',
    keywords: ['bug', 'error', 'crash', 'issue', 'not working', 'slow', 'broken', 'failure']
  },
  {
    key: 'orders',
    label: 'Orders & Delivery',
    keywords: ['order', 'shipment', 'shipping', 'delivery', 'tracking', 'dispatch', 'return']
  },
  {
    key: 'feature',
    label: 'Feature Request',
    keywords: ['feature', 'improve', 'enhancement', 'add', 'request', 'roadmap']
  }
];
const MAX_CONVERSATION_TITLE_LENGTH = 48;
const DEFAULT_TOPIC = { key: 'general', label: 'General Support' };

function createConversationId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `c_${crypto.randomUUID()}`;
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const randomHex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `c_${randomHex}`;
  }
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 12)}_${Math.random().toString(36).slice(2, 12)}`;
}

function inferTopic(message) {
  const text = String(message || '').toLowerCase();
  for (const rule of TOPIC_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) {
      return { key: rule.key, label: rule.label };
    }
  }
  return DEFAULT_TOPIC;
}

function createConversation(topic = DEFAULT_TOPIC, title = 'New conversation') {
  return normalizeConversation({
    id: createConversationId(),
    title,
    topicKey: topic.key,
    topicLabel: topic.label,
    messages: [],
    lastMetadata: null,
    updatedAt: new Date().toISOString()
  });
}

function buildConversationTitle(message) {
  const clean = String(message || '').trim().replace(/\s+/g, ' ');
  if (!clean) return 'New conversation';
  return clean.length > MAX_CONVERSATION_TITLE_LENGTH
    ? `${clean.slice(0, MAX_CONVERSATION_TITLE_LENGTH)}…`
    : clean;
}

function toConversationContext(messages = []) {
  return messages.map((m) => ({
    role: m.role === 'agent' ? 'assistant' : 'user',
    content: m.content
  }));
}

function sortByLatest(conversations = []) {
  return [...conversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function normalizeConversation(thread = {}) {
  return {
    id: thread.id || createConversationId(),
    title: thread.title || 'Conversation',
    topicKey: thread.topicKey || DEFAULT_TOPIC.key,
    topicLabel: thread.topicLabel || DEFAULT_TOPIC.label,
    messages: Array.isArray(thread.messages) ? thread.messages : [],
    lastMetadata: thread.lastMetadata || null,
    updatedAt: thread.updatedAt || new Date().toISOString()
  };
}

function resolveTargetConversation(activeThread, allThreads, topic, cleanContent) {
  if (!activeThread) {
    const starter = createConversation(topic, buildConversationTitle(cleanContent));
    return { targetConversation: starter, shouldInsert: true };
  }

  if (activeThread.messages.length > 0 && activeThread.topicKey !== topic.key) {
    const matchingTopicConversation = allThreads.find((thread) => thread.topicKey === topic.key);
    if (matchingTopicConversation) {
      return { targetConversation: matchingTopicConversation, shouldInsert: false };
    }

    const topicThread = createConversation(topic, buildConversationTitle(cleanContent));
    return { targetConversation: topicThread, shouldInsert: true };
  }

  return { targetConversation: activeThread, shouldInsert: false };
}

function isTaskInstruction(text = '') {
  const normalized = String(text).toLowerCase();
  return (
    /^task\s*:/i.test(text) ||
    /^todo\s*:/i.test(text) ||
    /(create|generate|make|build|prepare|plan)\s+.*(task|tasks|todo|to-do|checklist)/i.test(normalized)
  );
}

function ChatInterface({ customerId }) {
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);
  const storageKey = useMemo(() => `hindsight-chat-history-${customerId || 'guest'}`, [customerId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        const starter = createConversation();
        setConversations([starter]);
        setActiveConversationId(starter.id);
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        const starter = createConversation();
        setConversations([starter]);
        setActiveConversationId(starter.id);
        return;
      }

      const normalized = sortByLatest(parsed).map((thread) => normalizeConversation(thread));

      setConversations(normalized);
      setActiveConversationId(normalized[0].id);
    } catch (error) {
      console.warn(
        'Failed to parse chat history from localStorage. Resetting to a new conversation.',
        error
      );
      const starter = createConversation();
      setConversations([starter]);
      setActiveConversationId(starter.id);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!conversations.length) return;
    localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, storageKey]);

  useEffect(() => {
    if (!conversations.length) return;
    const hasValidActive = conversations.some((thread) => thread.id === activeConversationId);
    if (!hasValidActive) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations]);

  const activeConversation = useMemo(
    () => conversations.find((thread) => thread.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );
  const activeMessages = activeConversation?.messages || [];

  function updateConversation(conversationId, updater) {
    setConversations((prev) => {
      const existingThread = prev.find((thread) => thread.id === conversationId);
      if (!existingThread) return prev;
      const updatedThread = updater(existingThread);
      const remaining = prev.filter((thread) => thread.id !== conversationId);
      return [updatedThread, ...remaining];
    });
  }

  function createNewConversation() {
    const thread = createConversation();
    setConversations((prev) => [thread, ...prev]);
    setActiveConversationId(thread.id);
    setMessage('');
  }

  async function sendSupportMessage(content) {
    if (!content?.trim() || loading) return;
    const cleanContent = content.trim();
    const topic = inferTopic(cleanContent);

    const userMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: cleanContent,
      timestamp: new Date().toISOString()
    };

    const { targetConversation, shouldInsert } = resolveTargetConversation(
      activeConversation,
      conversations,
      topic,
      cleanContent
    );
    const targetConversationId = targetConversation.id;

    if (shouldInsert) {
      setConversations((prev) => [targetConversation, ...prev]);
    }

    setActiveConversationId(targetConversationId);
    const nextContext = [
      ...toConversationContext(targetConversation.messages),
      { role: 'user', content: userMessage.content }
    ];

    updateConversation(targetConversationId, (thread) => ({
      ...thread,
      title: thread.messages.length ? thread.title : buildConversationTitle(userMessage.content),
      topicKey: thread.messages.length ? thread.topicKey : topic.key,
      topicLabel: thread.messages.length ? thread.topicLabel : topic.label,
      messages: [...thread.messages, userMessage],
      updatedAt: new Date().toISOString()
    }));

    setMessage('');
    setLoading(true);

    try {
      const payload = await support.sendMessage(customerId, cleanContent, nextContext);
      if (!payload?.success) throw new Error(payload?.error?.message || 'Failed');

      const data = payload.data;
      updateConversation(targetConversationId, (thread) => ({
        ...thread,
        messages: [
          ...thread.messages,
          {
            id: data.interaction_id || `a_${Date.now()}`,
            role: 'agent',
            content: data.agent_response || 'No response',
            timestamp: new Date().toISOString(),
            provider: data.provider || 'agent',
            confidence: Number(data.confidence_score ?? 0)
          }
        ],
        lastMetadata: data,
        updatedAt: new Date().toISOString()
      }));

      if (isTaskInstruction(cleanContent)) {
        try {
          const autoTaskPayload = await insights.createTasksFromInstruction({
            instruction: cleanContent,
            owner: customerId || 'guest'
          });

          if (autoTaskPayload?.success && autoTaskPayload?.data?.tasks?.length) {
            const createdProject = autoTaskPayload.data.project;
            const taskCount = autoTaskPayload.data.tasks.length;

            updateConversation(targetConversationId, (thread) => ({
              ...thread,
              messages: [
                ...thread.messages,
                {
                  id: `insights_${Date.now()}`,
                  role: 'agent',
                  content: `Created ${taskCount} task(s) in Insights under project "${createdProject?.name || 'AI Task Plan'}". Open iNSIGHTS to review and continue.`,
                  timestamp: new Date().toISOString(),
                  provider: 'insights',
                  confidence: 1
                }
              ],
              updatedAt: new Date().toISOString()
            }));
          }
        } catch (_error) {
          // Support response should still succeed even if insights automation fails.
        }
      }
    } catch (error) {
      updateConversation(targetConversationId, (thread) => ({
        ...thread,
        messages: [
          ...thread.messages,
          {
            id: `e_${Date.now()}`,
            role: 'agent',
            content: `Error: ${error.message}`,
            timestamp: new Date().toISOString(),
            provider: 'system',
            confidence: 0
          }
        ],
        updatedAt: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
      setTimeout(() => messageEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }

  return (
    <section className="chat-grid">
      <aside className="history-card">
        <header className="history-header">
          <h3>Chats</h3>
          <button type="button" className="btn-secondary history-new-btn" onClick={createNewConversation}>
            New
          </button>
        </header>

        <div className="history-list">
          {conversations.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className={`history-item ${thread.id === activeConversation?.id ? 'active' : ''}`}
              onClick={() => setActiveConversationId(thread.id)}
            >
              <strong>{thread.title}</strong>
              <small>{thread.topicLabel}</small>
            </button>
          ))}
        </div>
      </aside>

      <div className="chat-card chat-main-card">
        <header className="chat-title">
          <h2>Support Assistant</h2>
          <span className="customer-pill">ID: {customerId}</span>
        </header>
        <div className="chat-meta-row">
          <span className="chat-topic-pill">{activeConversation?.topicLabel || 'General Support'}</span>
          <span className="muted">{activeMessages.length} messages</span>
        </div>

        <div className="chat-body">
          {activeMessages.length === 0 && <p className="muted">Start by asking your support question.</p>}

          {activeMessages.map((m) => (
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

      <MemoryContext memory={activeConversation?.lastMetadata?.hindsight_memory_used} />
    </section>
  );
}

export default ChatInterface;
