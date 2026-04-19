import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiGrants } from '../services/groq';
import { onboardingApi } from '../services/api';

function Grants() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const [description, setDescription] = useState('AI tools for community impact');
  const [grants, setGrants] = useState([]);
  const [onboarding, setOnboarding] = useState([]);

  useEffect(() => {
    if (!customerId) return;
    onboardingApi.get(customerId).then(setOnboarding).catch((error) => console.error(error));
  }, [customerId]);

  const completion = useMemo(() => {
    if (!onboarding.length) return 0;
    return Math.round((onboarding.filter((item) => item.done).length / onboarding.length) * 100);
  }, [onboarding]);

  const groups = useMemo(() => {
    return onboarding.reduce((acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    }, {});
  }, [onboarding]);

  async function findGrants(event) {
    event.preventDefault();
    const data = await aiGrants(description);
    setGrants(data);
  }

  async function toggleItem(item) {
    const updated = await onboardingApi.toggle(customerId, item.id, !item.done);
    setOnboarding((prev) => prev.map((entry) => (entry.id === item.id ? updated : entry)));
  }

  return (
    <div className="page-wrap grants-layout">
      <section className="card">
        <form className="todo-form" onSubmit={findGrants}>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your startup, mission, or need"
          />
          <button type="submit" className="btn-primary">Find Grants</button>
        </form>
        <div className="column-gap">
          {grants.map((item, index) => (
            <article key={`${item.name}-${index}`} className="card grant-card">
              <div className="row-between">
                <h3>{item.name}</h3>
                <span className="match-badge">{item.matchPercent}% match</span>
              </div>
              <p className="muted">{item.organization}</p>
              <p>{item.description}</p>
              <div className="row-between small muted">
                <span>{item.amount}</span>
                <span>Deadline: {item.deadline}</span>
              </div>
              <button type="button" className="btn-secondary">Apply</button>
            </article>
          ))}
        </div>
      </section>

      <aside className="card">
        <h3>Onboarding Checklist</h3>
        <div className="progress-track"><div style={{ width: `${completion}%` }} /></div>
        <p className="small muted">{completion}% complete</p>

        {Object.entries(groups).map(([section, items]) => (
          <div key={section} className="checklist-group">
            <h4>{section}</h4>
            {items.map((item) => (
              <label className="task-line" key={item.id}>
                <input type="checkbox" checked={item.done} onChange={() => toggleItem(item)} />
                <div>
                  <div className={item.done ? 'line-through' : ''}>{item.title}</div>
                  <div className="small muted">{item.description}</div>
                </div>
              </label>
            ))}
          </div>
        ))}
      </aside>
    </div>
  );
}

export default Grants;
