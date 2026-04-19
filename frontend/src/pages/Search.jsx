import { useMemo, useState } from 'react';
import { searchApi } from '../services/api';
import { aiSearchSummary } from '../services/groq';

const FILTERS = ['all', 'projects', 'tasks', 'grants', 'ai'];

function Search() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');

  const recent = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('insights_recent_searches') || '[]');
    } catch (_error) {
      return [];
    }
  }, [results]);

  async function runSearch(value = query, currentType = type) {
    if (!value.trim()) return;
    const data = await searchApi.query(value.trim(), currentType);
    setResults(data);

    const summaryPayload = await aiSearchSummary(value.trim(), data);
    setSummary(summaryPayload.summary || 'No summary available.');

    const nextRecent = [value.trim(), ...recent.filter((item) => item !== value.trim())].slice(0, 5);
    localStorage.setItem('insights_recent_searches', JSON.stringify(nextRecent));
  }

  return (
    <div className="page-wrap">
      <section className="card">
        <div className="search-row">
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, tasks, grants, and insights..."
          />
          <button type="button" className="btn-primary" onClick={() => runSearch()}>
            Search
          </button>
        </div>
        <div className="filter-row">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip${type === item ? ' active' : ''}`}
              onClick={() => {
                setType(item);
                if (query.trim()) runSearch(query, item);
              }}
            >
              {item === 'ai' ? 'AI Insights' : item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>AI Summary</h3>
        <p className="muted">{summary || 'Run a search to generate an AI summary.'}</p>
      </section>

      {results.length === 0 ? (
        <section className="card">
          <h3>Try these prompts</h3>
          <ul className="list-reset muted">
            <li>projects blocked by integrations</li>
            <li>high priority tasks due this week</li>
            <li>grants for education AI startups</li>
          </ul>
        </section>
      ) : (
        <section className="search-results">
          {results.map((item) => (
            <article key={`${item.type}-${item.id}`} className="card">
              <div className="row-between">
                <h3>{item.icon} {item.title}</h3>
                <span className="small muted">{item.type}</span>
              </div>
              <p>{item.snippet}</p>
              <div className="small muted">{item.source} · {new Date(item.timestamp).toLocaleString()}</div>
            </article>
          ))}
        </section>
      )}

      <section className="card">
        <h3>Recent Searches</h3>
        <div className="filter-row">
          {recent.length === 0 && <span className="muted">No recent searches.</span>}
          {recent.map((item) => (
            <button type="button" key={item} className="chip" onClick={() => { setQuery(item); runSearch(item); }}>
              {item}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Search;
