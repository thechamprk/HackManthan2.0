import { useEffect, useState } from 'react';
import { insights } from '../utils/api';
import ThemeToggle from '../components/ThemeToggle';

function Insights({ search, onNavigate }) {
  const params = new URLSearchParams(search);
  const customerId = params.get('customerId') || '';
  const customerName = params.get('name') || 'Guest';

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [todoContext, setTodoContext] = useState('');
  const [todoResult, setTodoResult] = useState(null);
  const [grantQuery, setGrantQuery] = useState('');
  const [grants, setGrants] = useState([]);
  const [onboarding, setOnboarding] = useState(null);
  const [deepQuery, setDeepQuery] = useState('');
  const [deepSummary, setDeepSummary] = useState(null);
  const [error, setError] = useState('');

  const totalProjects = projects.length;
  const totalTodos = todoResult?.tasks?.length || 0;
  const totalGrants = grants.length;
  const hasDeepSummary = Boolean(deepSummary?.summary);

  useEffect(() => {
    let mounted = true;
    async function loadProjects() {
      try {
        const payload = await insights.listProjects();
        if (mounted && payload?.success) {
          setProjects(payload.data || []);
          setSelectedProjectId((prev) => prev || payload.data?.[0]?.project_id || '');
        }
      } catch (err) {
        if (mounted) setError(err.message);
      }
    }
    loadProjects();
    return () => {
      mounted = false;
    };
  }, []);

  async function createNewProject(event) {
    event.preventDefault();
    setError('');
    try {
      const payload = await insights.createProject({
        name: projectName,
        goal: projectGoal,
        owner: customerName
      });
      if (!payload?.success) throw new Error('Failed to create project');
      const next = [payload.data, ...projects];
      setProjects(next);
      setSelectedProjectId(payload.data.project_id);
      setProjectName('');
      setProjectGoal('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function generateTodos() {
    if (!selectedProjectId) return;
    setError('');
    try {
      const payload = await insights.generateTodos(selectedProjectId, todoContext);
      if (!payload?.success) throw new Error('Failed to generate tasks');
      setTodoResult(payload.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function runGrantSearch() {
    setError('');
    try {
      const payload = await insights.searchGrants({ query: grantQuery });
      if (!payload?.success) throw new Error('Failed to search grants');
      setGrants(payload.data || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function runOnboarding() {
    setError('');
    try {
      const payload = await insights.continueOnboarding({
        project_id: selectedProjectId || undefined,
        current_step: 'access_setup',
        team_size: 3
      });
      if (!payload?.success) throw new Error('Failed to build onboarding continuation');
      setOnboarding(payload.data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function runDeepSearch() {
    if (!deepQuery.trim()) return;
    setError('');
    try {
      const payload = await insights.deepSearchSummary({ query: deepQuery.trim(), limit: 5 });
      if (!payload?.success) throw new Error('Failed to run deep search');
      setDeepSummary(payload.data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>iNSIGHTS</h1>
          <p>Project execution + intelligence modules</p>
        </div>
        <div className="app-header-right">
          <span>Customer: {customerName}</span>
          <ThemeToggle />
          <button
            className="btn-secondary"
            onClick={() => onNavigate(customerId ? `/app?${params.toString()}` : '/')}
          >
            Back
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="insights-overview">
          <div>
            <p className="workspace-kicker">Execution Intelligence</p>
            <h2>Keep projects, tasks, and research aligned in one flow</h2>
            <p>
              Build projects, generate structured to-dos, continue onboarding, and run deep search from a single
              workspace.
            </p>
          </div>
          <div className="insights-overview-meta">
            <span className="insight-chip">Projects: {totalProjects}</span>
            <span className="insight-chip">AI Tasks: {totalTodos}</span>
            <span className="insight-chip">Grants: {totalGrants}</span>
            <span className="insight-chip">Deep Search: {hasDeepSummary ? 'Ready' : 'Pending'}</span>
          </div>
        </section>

        {error ? <p className="muted">Error: {error}</p> : null}

        <section className="insights-grid">
          <article className="insights-card">
            <h3>1) Project HUB</h3>
            <p className="insights-sub">Create and manage execution-focused projects.</p>
            <form onSubmit={createNewProject} className="insights-form">
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
                required
              />
              <input
                value={projectGoal}
                onChange={(e) => setProjectGoal(e.target.value)}
                placeholder="Project goal"
                required
              />
              <button className="btn-primary" type="submit">Create Project</button>
            </form>
            <div className="insights-list">
              {projects.length ? projects.map((project) => (
                <button
                  type="button"
                  key={project.project_id}
                  className={`insights-list-item ${selectedProjectId === project.project_id ? 'active' : ''}`}
                  onClick={() => setSelectedProjectId(project.project_id)}
                >
                  {project.name}
                </button>
              )) : <p className="muted">No projects yet.</p>}
            </div>
          </article>

          <article className="insights-card">
            <h3>2) AI To-Do Engine</h3>
            <p className="insights-sub">Generate clear, actionable tasks for selected projects.</p>
            <div className="insights-form">
              <input
                value={todoContext}
                onChange={(e) => setTodoContext(e.target.value)}
                placeholder="Context for AI tasks"
              />
              <button className="btn-primary" type="button" onClick={generateTodos} disabled={!selectedProjectId}>
                Generate To-Dos
              </button>
            </div>
            <div className="insights-list">
              {todoResult?.tasks?.length ? todoResult.tasks.map((task) => (
                <div className="case-card" key={task.id}>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </div>
              )) : <p className="muted">No AI to-do output yet.</p>}
            </div>
          </article>

          <article className="insights-card">
            <h3>3) Grants + Onboarding</h3>
            <p className="insights-sub">Explore funding and continue onboarding without context loss.</p>
            <div className="insights-form">
              <input
                value={grantQuery}
                onChange={(e) => setGrantQuery(e.target.value)}
                placeholder="Grant search keywords"
              />
              <div className="insights-actions">
                <button className="btn-secondary" type="button" onClick={runGrantSearch}>Search Grants</button>
                <button className="btn-primary" type="button" onClick={runOnboarding}>Continue Onboarding</button>
              </div>
            </div>
            <div className="insights-list">
              {grants.map((grant) => (
                <div className="case-card" key={grant.id}>
                  <strong>{grant.title}</strong>
                  <p>{grant.provider} · ${grant.amount_usd}</p>
                </div>
              ))}
              {onboarding?.steps?.length ? (
                <div className="case-card">
                  <strong>Onboarding Steps</strong>
                  <ul className="steps-list">
                    {onboarding.steps.map((step) => (
                      <li key={step.step}>
                        {step.step}: {step.status}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {!grants.length && !onboarding ? <p className="muted">No grant/onboarding output yet.</p> : null}
            </div>
          </article>

          <article className="insights-card">
            <h3>4) Deep Search</h3>
            <p className="insights-sub">Run focused product research and summarize recommendations.</p>
            <div className="insights-form">
              <input
                value={deepQuery}
                onChange={(e) => setDeepQuery(e.target.value)}
                placeholder="Ask product/search question"
              />
              <button className="btn-primary" type="button" onClick={runDeepSearch}>Run Deep Search</button>
            </div>
            <div className="insights-list">
              {deepSummary?.summary ? (
                <div className="case-card">
                  <strong>Summary</strong>
                  <p>Dominant issue: {deepSummary.summary.dominant_issue}</p>
                  <p>{deepSummary.summary.recommendation}</p>
                </div>
              ) : <p className="muted">No search summary yet.</p>}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Insights;
