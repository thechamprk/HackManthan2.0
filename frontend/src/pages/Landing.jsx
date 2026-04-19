import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!customerId.trim()) return;

    const params = new URLSearchParams({ customerId: customerId.trim() });
    if (name.trim()) params.set('name', name.trim());

    navigate(`/app?${params.toString()}`);
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <h1>iNSIGHTS AI Life OS</h1>
        <p>Run projects, tasks, grants, and discovery workflows from one dark workspace.</p>
        <button type="button" className="btn-primary" onClick={() => setShowModal(true)}>
          Enter Workspace
        </button>
      </header>

      <section className="landing-grid">
        <article className="card">
          <h3>Project Hub</h3>
          <p>Track progress, blockers, and milestones in real time.</p>
        </article>
        <article className="card">
          <h3>AI To-Do Engine</h3>
          <p>Break goals into actionable subtasks with priorities and time estimates.</p>
        </article>
        <article className="card">
          <h3>Grant + Onboarding</h3>
          <p>Discover relevant grants and complete onboarding with progress tracking.</p>
        </article>
        <article className="card">
          <h3>Deep Search</h3>
          <p>Search projects, tasks, grants, and AI insights with instant summaries.</p>
        </article>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form className="modal-card" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <h2>Access your workspace</h2>
            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </label>
            <label>
              Customer ID
              <input
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="cust_001"
                required
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Landing;
