import React from 'react';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <div className={styles['header-logo']}>
          <h1>🤖 Hindsight Expert</h1>
          <p>AI Support Agent with Persistent Memory</p>
        </div>
        <nav className={styles['header-nav']}>
          <a href="/">Chat</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/docs">Documentation</a>
        </nav>
        <div className={styles['header-status']}>
          <span className={styles['status-dot']}>🟢</span>
          <span>Backend Connected</span>
        </div>
      </div>
    </header>
  );
}
