import { useEffect, useRef, useState } from 'react';
import MessageItem from './MessageItem';
import LoadingSpinner from './LoadingSpinner';
import { useChat } from '../hooks/useChat';

function ChatInterface({ customerId = '', onMemoryUpdate }) {
  const [draft, setDraft] = useState('');
  const [localCustomerId, setLocalCustomerId] = useState(customerId);
  const activeCustomerId = customerId || localCustomerId;
  const { messages, sendMessage, clearChat, markInteractionResolved, isLoading, error, memory, resolvedIds } =
    useChat(activeCustomerId);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (onMemoryUpdate) {
      onMemoryUpdate(memory);
    }
  }, [memory, onMemoryUpdate]);

  async function onSubmit(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    await sendMessage(draft);
    setDraft('');
  }

  return (
    <section className="glass rounded-2xl p-4 md:p-6" aria-label="Support chat">
      <div className="mb-4 flex flex-wrap items-end gap-2">
        <label className="text-xs text-slate-300" htmlFor="customer-id-input">
          Customer ID
        </label>
        <input
          id="customer-id-input"
          aria-label="Customer ID"
          value={activeCustomerId}
          onChange={(event) => setLocalCustomerId(event.target.value)}
          disabled={Boolean(customerId)}
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm"
          placeholder="cust_001"
        />
        <button
          type="button"
          onClick={clearChat}
          className="ml-auto rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
        >
          Clear chat
        </button>
      </div>

      <div className="mb-4 max-h-[55vh] overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400">Start by asking a support question.</p>
        ) : (
          messages.map((item) => (
            <MessageItem
              key={item.id}
              item={item}
              resolved={resolvedIds[item.interactionId]}
              onQuickReply={(text) => sendMessage(text)}
              onResolve={markInteractionResolved}
            />
          ))
        )}
        {isLoading && <LoadingSpinner label="Thinking…" />}
        <div ref={bottomRef} />
      </div>

      {error ? <p className="mb-2 text-sm text-rose-300">{error}</p> : null}
      {!activeCustomerId ? <p className="mb-2 text-sm text-amber-300">Enter a customer ID to enable sending.</p> : null}

      <form className="flex gap-2" onSubmit={onSubmit}>
        <textarea
          aria-label="Message input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={2}
          className="min-h-[44px] flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm"
          placeholder="Describe your issue"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !draft.trim() || !activeCustomerId}
          className="rounded-lg bg-[var(--purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </section>
  );
}

export default ChatInterface;
