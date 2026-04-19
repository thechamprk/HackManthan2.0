import React from 'react';
import '../styles/Header.module.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>🤖 Hindsight Expert</h1>
          <p>AI Support Agent with Persistent Memory</p>
        </div>
        <nav className="header-nav">
          <a href="/">Chat</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/docs">Documentation</a>
        </nav>
        <div className="header-status">
          <span className="status-dot">🟢</span>
          <span>Backend Connected</span>
        </div>
      </div>
    </header>
  );
}
