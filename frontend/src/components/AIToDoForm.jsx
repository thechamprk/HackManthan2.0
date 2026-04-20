import React, { useState } from 'react';

export default function AIToDoForm() {
  const moduleOptions = [
    'Project HUB',
    'AI To-Do Engine',
    'Grants + Onboarding',
    'Deep Search'
  ];

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Finalize sprint plan',
      description: 'Prepare week-wise milestones for project execution.',
      module: 'Project HUB',
      status: 'pending',
      progressNote: ''
    },
    {
      id: 2,
      title: 'Research competitor rollout',
      description: 'Run deep search and collect launch insights.',
      module: 'Deep Search',
      status: 'in_progress',
      progressNote: 'Initial competitor list has been prepared.'
    }
  ]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    module: moduleOptions[0]
  });

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed'
  };

  const counts = tasks.reduce(
    (acc, task) => ({ ...acc, [task.status]: acc[task.status] + 1 }),
    { pending: 0, in_progress: 0, completed: 0 }
  );

  const handleCreateTask = (event) => {
    event.preventDefault();
    const title = newTask.title.trim();
    const description = newTask.description.trim();
    if (!title || !description) return;

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        description,
        module: newTask.module,
        status: 'pending',
        progressNote: ''
      }
    ]);
    setNewTask({
      title: '',
      description: '',
      module: moduleOptions[0]
    });
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  const handleProgressNoteChange = (id, progressNote) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, progressNote } : task)));
  };

  return (
    <div>
      <form onSubmit={handleCreateTask} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Create a task from the four options</h3>
        <div style={{ marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(event) => setNewTask((prev) => ({ ...prev, title: event.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <textarea
            placeholder="Short description"
            value={newTask.description}
            onChange={(event) => setNewTask((prev) => ({ ...prev, description: event.target.value }))}
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <select
            value={newTask.module}
            onChange={(event) => setNewTask((prev) => ({ ...prev, module: event.target.value }))}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              background: '#ffffff'
            }}
          >
            {moduleOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Create Task
        </button>
      </form>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ background: '#f8fafc', borderRadius: '999px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
          Pending: <strong>{counts.pending}</strong>
        </span>
        <span style={{ background: '#eff6ff', borderRadius: '999px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
          In Progress: <strong>{counts.in_progress}</strong>
        </span>
        <span style={{ background: '#f0fdf4', borderRadius: '999px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
          Completed: <strong>{counts.completed}</strong>
        </span>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem', color: '#0f172a' }}>Assigned tasks</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#64748b' }}>No tasks assigned yet.</p>
        ) : tasks.map((task) => (
          <div
            key={task.id}
            style={{
              marginBottom: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              background: '#ffffff'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.75rem'
              }}
            >
              <div>
                <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{task.title}</strong>
                <p style={{ color: '#64748b', marginTop: '0.3rem', fontSize: '0.9rem' }}>{task.description}</p>
                <p style={{ color: '#334155', marginTop: '0.35rem', fontSize: '0.85rem' }}>
                  Option: <strong>{task.module}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteTask(task.id)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Delete
              </button>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', color: '#334155', fontSize: '0.85rem' }}>
                Progress status
              </label>
              <select
                value={task.status}
                onChange={(event) => handleStatusChange(task.id, event.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  background: '#ffffff'
                }}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', color: '#334155', fontSize: '0.85rem' }}>
                Progress note
              </label>
              <textarea
                value={task.progressNote}
                onChange={(event) => handleProgressNoteChange(task.id, event.target.value)}
                rows="2"
                placeholder="Add latest progress update..."
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
