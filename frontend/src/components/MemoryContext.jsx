import React, { useState } from 'react';
import '../styles/MemoryContext.module.css';

export default function MemoryContext({ similarCases = [], patterns = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if ((!similarCases || similarCases.length === 0) && (!patterns || patterns.length === 0)) {
    return null;
  }

  return (
    <div className="memory-context">
      <button
        className="memory-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        💾 Memory Context {isExpanded ? '▼' : '▶'}
      </button>

      {isExpanded && (
        <div className="memory-content">
          {patterns && patterns.length > 0 && (
            <div className="patterns-section">
              <h4>Applied Patterns</h4>
              <div className="patterns-list">
                {patterns.map((pattern, idx) => (
                  <span key={idx} className="pattern-tag">{pattern}</span>
                ))}
              </div>
            </div>
          )}

          {similarCases && similarCases.length > 0 && (
            <div className="cases-section">
              <h4>Similar Past Cases</h4>
              <div className="cases-list">
                {similarCases.map((caseItem, idx) => (
                  <div key={idx} className="case-item">
                    <p className="case-text">{caseItem.issue}</p>
                    <div className="case-meta">
                      <span className="effectiveness">
                        ⭐ {(caseItem.effectiveness * 100).toFixed(0)}% effective
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
