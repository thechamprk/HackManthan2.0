function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function confidenceClass(score = 0) {
  if (score >= 0.75) return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300';
  if (score >= 0.5) return 'border-amber-500/30 bg-amber-500/15 text-amber-200';
  return 'border-rose-500/30 bg-rose-500/15 text-rose-300';
}

function MessageItem({ item, resolved, onQuickReply, onResolve }) {
  return (
    <article
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
          <button type="button" className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10" onClick={() => onQuickReply('Tell me more')}>
            Tell me more
          </button>
          <button type="button" className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10" onClick={() => onQuickReply("That didn't help")}>
            That didn't help
          </button>
          <button
            type="button"
            className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-200 disabled:opacity-50"
            disabled={!item.interactionId || resolved}
            onClick={() => onResolve(item.interactionId)}
          >
            {resolved ? 'Resolved' : 'Mark as resolved'}
          </button>
        </div>
      )}
    </article>
  );
}

export default MessageItem;
