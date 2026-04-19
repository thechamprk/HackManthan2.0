import React from 'react';
import '../styles/LoadingSpinner.module.css';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}
