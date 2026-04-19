import React from 'react';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles['footer-container']}>
      <div className={styles['footer-content']}>
        <div className={`${styles['footer-section']} ${styles['footer-branding']}`}>
          <h3 className={styles['footer-logo']}>🤖 Hindsight Expert</h3>
          <p className={styles['footer-tagline']}>AI Support Agent That Learns & Improves</p>
          <p className={styles['footer-description']}>Building the future of customer support with persistent memory and continuous learning.</p>
        </div>

        <div className={`${styles['footer-section']} ${styles['footer-links']}`}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/docs">Documentation</a></li>
          </ul>
        </div>

        <div className={`${styles['footer-section']} ${styles['footer-resources']}`}>
          <h4>Resources</h4>
          <ul>
            <li><a href="https://hindsight.vectorize.io" target="_blank" rel="noopener noreferrer">Hindsight Docs</a></li>
            <li><a href="https://groq.com" target="_blank" rel="noopener noreferrer">Groq API</a></li>
            <li><a href="https://github.com/thechamprk/HackManthan2.0" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>

        <div className={`${styles['footer-section']} ${styles['footer-contact']}`}>
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:support@hindsightexpert.com">Email Support</a></li>
            <li><a href="https://github.com/thechamprk" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className={styles['footer-bottom']}>
        <div className={styles['footer-bottom-left']}>
          <p>&copy; {currentYear} Hindsight Expert. All rights reserved.</p>
          <span className={styles['footer-divider']}>•</span>
          <a href="/privacy">Privacy Policy</a>
        </div>

        <div className={styles['footer-bottom-right']}>
          <span className={styles['footer-build']}>Built with ❤️ for the Hindsight Hackathon</span>
        </div>
      </div>
    </footer>
  );
}
