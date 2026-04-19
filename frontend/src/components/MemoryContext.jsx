import React, { useState } from 'react';
import styles from '../styles/MemoryContext.module.css';

export default function MemoryContext({ similarCases = [], patterns = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if ((!similarCases || similarCases.length === 0) && (!patterns || patterns.length === 0)) {
    return null;
  }

  return (
    <div className={styles['memory-context']}>
      <button
        className={styles['memory-toggle']}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        💾 Memory Context {isExpanded ? '▼' : '▶'}
      </button>

      {isExpanded && (
        <div className={styles['memory-content']}>
          {patterns && patterns.length > 0 && (
            <div className={styles['patterns-section']}>
              <h4>Applied Patterns</h4>
              <div className={styles['patterns-list']}>
                {patterns.map((pattern, idx) => (
                  <span key={idx} className={styles['pattern-tag']}>{pattern}</span>
                ))}
              </div>
            </div>
          )}

          {similarCases && similarCases.length > 0 && (
            <div className={styles['cases-section']}>
              <h4>Similar Past Cases</h4>
              <div className={styles['cases-list']}>
                {similarCases.map((caseItem, idx) => (
                  <div key={idx} className={styles['case-item']}>
                    <p className={styles['case-text']}>{caseItem.issue}</p>
                    <div className={styles['case-meta']}>
                      <span className={styles.effectiveness}>
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
