import React from 'react';
import '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section footer-branding">
          <h3 className="footer-logo">🤖 Hindsight Expert</h3>
          <p className="footer-tagline">AI Support Agent That Learns & Improves</p>
          <p className="footer-description">Building the future of customer support with persistent memory and continuous learning.</p>
        </div>

        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/docs">Documentation</a></li>
          </ul>
        </div>

        <div className="footer-section footer-resources">
          <h4>Resources</h4>
          <ul>
            <li><a href="https://hindsight.vectorize.io" target="_blank" rel="noopener noreferrer">Hindsight Docs</a></li>
            <li><a href="https://groq.com" target="_blank" rel="noopener noreferrer">Groq API</a></li>
            <li><a href="https://github.com/thechamprk/HackManthan2.0" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:support@hindsightexpert.com">Email Support</a></li>
            <li><a href="https://github.com/thechamprk" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p>&copy; {currentYear} Hindsight Expert. All rights reserved.</p>
          <span className="footer-divider">•</span>
          <a href="/privacy">Privacy Policy</a>
        </div>

        <div className="footer-bottom-right">
          <span className="footer-build">Built with ❤️ for the Hindsight Hackathon</span>
        </div>
      </div>
    </footer>
  );
}
