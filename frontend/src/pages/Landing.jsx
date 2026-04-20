import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';

function Landing({ onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <button
            type="button"
            className="landing-link-button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onNavigate('/about');
            }}
          >
            About
          </button>
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
              onNavigate('/login');
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
          Hindsight Expert helps teams resolve customer issues faster using persistent memory, contextual intelligence,
          and elegant workflows.
        </p>
        <div className="cta-row">
          <button className="btn-primary" type="button" onClick={() => onNavigate('/login')}>
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

        <div className="hero-metrics">
          <article className="hero-metric">
            <strong>99.9%</strong>
            <span>API uptime</span>
          </article>
          <article className="hero-metric">
            <strong>40% faster</strong>
            <span>issue triage</span>
          </article>
          <article className="hero-metric">
            <strong>Always on</strong>
            <span>memory continuity</span>
          </article>
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

      <section className="use-cases-section">
        <div className="section-label">Built For Teams</div>
        <div className="section-title">Practical workflows, not gimmicks</div>
        <div className="use-cases-grid">
          <article className="use-case-card">
            <h3>Support Operations</h3>
            <p>Keep every customer thread contextual so agents do not ask the same questions twice.</p>
          </article>
          <article className="use-case-card">
            <h3>Founders & Product Leads</h3>
            <p>Turn support conversations into recurring issue patterns and informed roadmap decisions.</p>
          </article>
          <article className="use-case-card">
            <h3>Growing Teams</h3>
            <p>Onboard new teammates faster with persisted interaction history and clear AI recommendations.</p>
          </article>
        </div>
      </section>

      <footer>© 2026 Hindsight Expert · All rights reserved.</footer>
    </div>
  );
}

export default Landing;