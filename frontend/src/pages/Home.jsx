import { useEffect, useMemo, useState } from 'react';
import { projectsApi, tasksApi } from '../services/api';

const STATUS_COLORS = {
  active: 'var(--green)',
  review: 'var(--amber)',
  planning: 'var(--accent2)',
  blocked: 'var(--red)'
};

function Home() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      const [projectPayload, taskPayload] = await Promise.all([projectsApi.getAll(), tasksApi.getAll()]);
      setProjects(projectPayload.projects || []);
      setTasks(taskPayload || []);
    }

    load().catch((error) => console.error(error));
  }, []);

  const stats = useMemo(() => {
    const inProgress = projects.filter((item) => item.status === 'active').length;
    const blocked = projects.filter((item) => item.status === 'blocked').length;
    const doneTasks = tasks.filter((item) => item.done).length;
    return {
      totalProjects: projects.length,
      inProgress,
      tasksDone: doneTasks,
      blocked
    };
  }, [projects, tasks]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks.filter((item) => String(item.dueDate || '').slice(0, 10) === today).slice(0, 6);

  async function toggleTask(taskId, currentDone) {
    const updated = await tasksApi.update(taskId, { done: !currentDone });
    setTasks((prev) => prev.map((item) => (item.id === taskId ? updated : item)));
  }

  return (
    <div className="page-wrap">
      <section className="stats-grid-4">
        <div className="card stat-card"><span>Total Projects</span><strong>{stats.totalProjects}</strong></div>
        <div className="card stat-card"><span>In Progress</span><strong>{stats.inProgress}</strong></div>
        <div className="card stat-card"><span>Tasks Done</span><strong>{stats.tasksDone}</strong></div>
        <div className="card stat-card"><span>Blocked</span><strong>{stats.blocked}</strong></div>
      </section>

      <section className="hub-layout">
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="card project-card" key={project.id} style={{ borderTopColor: STATUS_COLORS[project.status] }}>
              <div className="row-between">
                <h3>{project.name}</h3>
                <span className={`status-pill ${project.status}`}>{project.status}</span>
              </div>
              <div className="muted small">ID: {project.id}</div>
              <p>{project.description}</p>
              <div className="progress-track"><div style={{ width: `${project.progress}%` }} /></div>
              <div className="row-between small muted">
                <span>{project.progress}% complete</span>
                <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="avatar-row">
                {(project.team || []).map((member) => (
                  <span className="avatar" key={member}>{member}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className="card tasks-panel">
          <h3>Today's Tasks</h3>
          {todaysTasks.length === 0 && <p className="muted">No tasks due today.</p>}
          {todaysTasks.map((task) => (
            <label key={task.id} className="task-line">
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id, task.done)} />
              <div>
                <div className={task.done ? 'line-through' : ''}>{task.text}</div>
                <div className="small muted">
                  <span className="tag-badge">{task.tag}</span> Due {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            </label>
          ))}
        </aside>
      </section>

      <section className="bottom-grid">
        <article className="card">
          <h3>Recent Activity</h3>
          <ul className="list-reset">
            {tasks.slice(0, 5).map((item) => (
              <li key={item.id} className="list-row">{item.done ? '✅' : '•'} {item.text}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Upcoming Milestones</h3>
          <ul className="list-reset">
            {projects.slice(0, 5).map((item) => (
              <li key={item.id} className="list-row">{item.name} · {new Date(item.dueDate).toLocaleDateString()}</li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

export default Home;
