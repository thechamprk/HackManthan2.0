import React, { useState } from 'react';

export default function ProjectHubForm({ onClose }) {
  const [projectName, setProjectName] = useState('');
  const [projectGoal, setProjectGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !projectGoal.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Add API call to create project
      console.log('Creating project:', { projectName, projectGoal });

      // Simulate success
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateProject}>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#0f172a' }}>
          Project Name
        </label>
        <input
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#0f172a' }}>
          Project Goal
        </label>
        <textarea
          placeholder="Enter project goal"
          value={projectGoal}
          onChange={(e) => setProjectGoal(e.target.value)}
          rows="4"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            resize: 'vertical'
          }}
        />
      </div>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Creating...' : 'Create Project'}
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            padding: '0.75rem 1.5rem',
            background: '#d1fae5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Agentic AI
        </button>
      </div>
    </form>
  );
}
