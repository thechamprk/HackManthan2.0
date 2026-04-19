function MemoryContext({ memory }) {
  const source = memory || { retrieved_cases: [], patterns_applied: [] };
  const cases = source?.retrieved_cases || [];
  const patterns = source?.patterns_applied || [];

  return (
    <aside className="memory-card">
      <h3>Memory Context</h3>
      <p className="muted">{cases.length || patterns.length ? 'Memory Active' : 'No Memory Yet'}</p>

      <div className="pill-wrap">
        {patterns.length ? (
          patterns.map((p) => (
            <span key={p} className="pill">
              {p}
            </span>
          ))
        ) : (
          <span className="muted">No patterns yet</span>
        )}
      </div>

      <div className="case-list">
        {cases.length ? (
          cases.map((c, i) => (
            <div key={`${c.interaction_id || i}_${i}`} className="case-card">
              <strong>Case {i + 1}</strong>
              <p>{c.agent_response || 'No summary available'}</p>
              {typeof c.effectiveness_score === 'number' ? (
                <small>Effectiveness: {(c.effectiveness_score * 100).toFixed(0)}%</small>
              ) : null}
            </div>
          ))
        ) : (
          <p className="muted">No similar cases retrieved yet.</p>
        )}
      </div>
    </aside>
  );
}

export default MemoryContext;
