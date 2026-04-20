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
            href="#workflow"
            onClick={(e) => {
              e.preventDefault();
              smoothScrollTo('#workflow');
            }}
          >
            Workflow
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
        <div className="badge">Built for modern support operations</div>
        <h1>
          Better support outcomes, <em>without the chaos</em>
        </h1>
        <p className="hero-sub">
          HindsightHub gives your team structured context, faster handoffs, and clear next steps so every customer
          conversation feels consistent and professional.
        </p>
        <div className="hero-highlights">
          <span>Context-first workflows</span>
          <span>Faster case handling</span>
          <span>Consistent quality</span>
        </div>
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
        <div className="hero-preview">
          <div className="preview-card">
            <p>Live support queue</p>
            <strong>18 active conversations</strong>
            <span>Average first response: 2m 14s</span>
          </div>
          <div className="preview-card">
            <p>Knowledge confidence</p>
            <strong>92%</strong>
            <span>Based on historical resolution quality</span>
          </div>
          <div className="preview-card">
            <p>Escalation health</p>
            <strong>Low risk</strong>
            <span>Only 3 cases need senior review</span>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="trust-strip">
        <p>Designed for teams that need clarity, speed, and reliable customer communication.</p>
        <div className="trust-metrics">
          <div>
            <strong>24/7</strong>
            <span>Operational visibility</span>
          </div>
          <div>
            <strong>Unified</strong>
            <span>Case timeline</span>
          </div>
          <div>
            <strong>Actionable</strong>
            <span>Support insights</span>
          </div>
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="section-label">Workflow</div>
        <div className="section-title">A cleaner way to run support</div>
        <div className="workflow-grid">
          <article className="workflow-step">
            <span>01</span>
            <h3>Capture context once</h3>
            <p>Collect customer background and interaction history in one shared view.</p>
          </article>
          <article className="workflow-step">
            <span>02</span>
            <h3>Respond with confidence</h3>
            <p>Use relevant case memory to deliver answers that stay aligned across the team.</p>
          </article>
          <article className="workflow-step">
            <span>03</span>
            <h3>Improve every cycle</h3>
            <p>Review trends and outcomes to continuously improve response quality and speed.</p>
          </article>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-label">Features</div>
        <div className="section-title">Everything you need</div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>Persistent Memory</h3>
            <p>Bring past interactions into the present so agents never start from zero.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Rapid Guidance</h3>
            <p>Keep replies quick and accurate with contextual prompts tailored to active cases.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Pattern Tracking</h3>
            <p>Spot recurring issues early and standardize high-quality resolution playbooks.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Understand team performance, resolution velocity, and escalation trends in real time.</p>
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
              <p>Rounak</p>
            </div>
            <div className="team-card">
              <h3>Team Member</h3>
              <p>Khushi</p>
            </div>
            <div className="team-card">
              <h3>Team Member</h3>
              <p>Abhinav</p>
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
