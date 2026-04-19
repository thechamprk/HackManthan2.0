import { useEffect, useState } from 'react';

function MemoryContext({ memory = { retrieved_cases: [], patterns_applied: [] } }) {
  const [expanded, setExpanded] = useState(true);
  const [expandedCases, setExpandedCases] = useState({});
  const [animationKey, setAnimationKey] = useState(0);
  const cases = memory?.retrieved_cases || [];
  const patterns = memory?.patterns_applied || [];
  const memoryActive = cases.length > 0 || patterns.length > 0;

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [cases.length, patterns.length]);

  return (
    <section className="glass-card rounded-2xl p-4 shadow-soft" aria-label="Memory context panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-semibold text-white">Memory Context</h2>
        <span
          className={`rounded-full border px-2 py-1 text-xs ${
            memoryActive
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-slate-500/30 bg-slate-500/10 text-slate-300'
          }`}
        >
          {memoryActive ? 'Memory Active' : 'No Memory Yet'}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {patterns.length ? (
          patterns.map((pattern) => (
            <span
              key={pattern}
              className="rounded-full border border-[var(--purple)]/40 bg-[var(--purple)]/15 px-2.5 py-1 text-xs text-violet-200"
            >
              {pattern}
            </span>
          ))
        ) : (
          <p className="text-xs text-slate-400">No patterns detected yet</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="memory-context-body"
        >
          {expanded ? 'Hide' : 'Show'} Similar Cases
        </button>
      </div>

      {expanded && (
        <div id="memory-context-body" key={animationKey} className="mt-4 space-y-3 animate-fade-up">
          {cases.length === 0 ? (
            <p className="text-sm text-slate-400">No similar historical cases were retrieved for this response.</p>
          ) : (
            cases.map((item, idx) => (
              <div key={`${item.interaction_id || idx}-${idx}`} className="rounded-xl border border-white/10 bg-black/20 p-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setExpandedCases((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                >
                  <h3 className="text-sm font-semibold text-slate-100">Case {idx + 1}: {item.issue_type || 'general_support'}</h3>
                  <span className="text-xs text-slate-400">{expandedCases[idx] ? 'Collapse' : 'Expand'}</span>
                </button>

                {expandedCases[idx] && (
                  <div className="mt-2 animate-fade-up">
                    <p className="text-sm text-slate-300">{item.agent_response || 'No response summary available.'}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      Effectiveness: {typeof item.effectiveness_score === 'number' ? item.effectiveness_score.toFixed(2) : 'n/a'}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default MemoryContext;
