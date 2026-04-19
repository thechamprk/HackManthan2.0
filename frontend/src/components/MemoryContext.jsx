import { useState } from 'react';

function MemoryContext({ memory = { retrieved_cases: [], patterns_applied: [] } }) {
  const [expanded, setExpanded] = useState(false);
  const cases = memory?.retrieved_cases || [];
  const patterns = memory?.patterns_applied || [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft" aria-label="Memory context panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">Memory Context</h2>
        <button
          type="button"
          className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="memory-context-body"
        >
          {expanded ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Patterns applied: {patterns.length ? patterns.join(', ') : 'No patterns detected yet'}
      </p>

      {expanded && (
        <div id="memory-context-body" className="mt-4 space-y-3">
          {cases.length === 0 ? (
            <p className="text-sm text-slate-500">No similar historical cases were retrieved for this response.</p>
          ) : (
            cases.map((item, idx) => (
              <article key={`${item.interaction_id || idx}-${idx}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-sm font-semibold text-slate-800">Case {idx + 1}: {item.issue_type || 'general_support'}</h3>
                <p className="mt-1 text-sm text-slate-700">{item.agent_response || 'No response summary available.'}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Effectiveness: {typeof item.effectiveness_score === 'number' ? item.effectiveness_score.toFixed(2) : 'n/a'}
                </p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default MemoryContext;
