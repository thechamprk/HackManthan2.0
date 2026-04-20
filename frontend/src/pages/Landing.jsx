import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

function Landing({ onNavigate }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!customerId.trim()) return;

    const params = new URLSearchParams({ customerId: customerId.trim() });
    if (name.trim()) params.set('name', name.trim());

    onNavigate(`/app?${params.toString()}`);
  }

  function smoothScrollTo(selector) {
    const target = document.querySelector(selector);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="nova-page">
      <nav className="nova-nav">
        <a
          className="nova-logo"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          hindsight<span>.</span>
        </a>

        <button
          type="button"
          className="nova-menu-toggle"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="landing-navigation-links"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          id="landing-navigation-links"
          className={`nova-nav-links ${isMobileMenuOpen ? 'open' : ''}`}
        >
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('#about');
            }}
          >
            About
          </a>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('#features');
            }}
          >
            Features
          </a>
          <ThemeToggle />
          <button
            type="button"
            className="btn-login"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setShowModal(true);
            }}
          >
            Login
          </button>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">Now in public beta</div>
        <h1>
          AI support, <em>with memory</em>
        </h1>
        <p className="hero-sub">
          HindsightHub helps teams resolve customer issues faster using persistent memory, contextual intelligence,
          and elegant workflows.
        </p>
        <div className="cta-row">
          <button className="btn-primary" type="button" onClick={() => setShowModal(true)}>
            Get started free
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => smoothScrollTo('#features')}
          >
            See features →
          </button>
        </div>
      </section>

      <div className="divider" />

      <section className="features-section" id="features">
        <div className="section-label">Features</div>
        <div className="section-title">Everything you need</div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Persistent Memory</h3>
            <p>Store and recall past support interactions to deliver context-aware responses every time.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast AI Responses</h3>
            <p>Powered by modern LLMs for fast, reliable and human-like support conversations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Pattern Learning</h3>
            <p>Detect repeated issue patterns and improve guidance quality continuously.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Visualize interaction trends, confidence and outcomes with real-time metrics.</p>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-text">
          <div className="section-label">About Us</div>
          <h2>Built for modern support teams</h2>
          <p>
            HindsightHub combines memory + AI to reduce repetitive handling, improve resolution quality, and help
            agents respond with confidence.
          </p>
        </div>

        <div className="about-content">
          <div className="about-stats">
            <div className="stat">
              <div className="stat-num">24/7</div>
              <div className="stat-label">AI Assistance</div>
            </div>
            <div className="stat">
              <div className="stat-num">Fast</div>
              <div className="stat-label">Response Time</div>
            </div>
            <div className="stat">
              <div className="stat-num">Smart</div>
              <div className="stat-label">Memory Recall</div>
            </div>
          </div>

          <div className="about-team">
            <div className="team-card">
              <h3>Team Leader</h3>
              <p>rounak</p>
            </div>
            <div className="team-card">
              <h3>Team Member</h3>
              <p>khushi</p>
            </div>
            <div className="team-card">
              <h3>Team Member</h3>
              <p>abhinav</p>
            </div>
          </div>
        </div>
      </section>

      <footer>© 2026 hindsight.expert · All rights reserved.</footer>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form
            className="modal-card"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Welcome to HindsightHub</h2>
            <p>Enter your details to continue</p>

            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Customer ID
              <input
                type="text"
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
