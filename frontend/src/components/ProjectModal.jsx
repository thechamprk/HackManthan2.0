import React from 'react';
import styles from '../styles/ProjectModal.module.css';

export default function ProjectModal({
  title,
  isOpen,
  onClose,
  children
}) {
  if (!isOpen) return null;

  return (
    <div
      className={styles['modal-overlay']}
      onClick={onClose}
    >
      <div
        className={styles['modal-content']}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['modal-header']}>
          <h2>{title}</h2>
          <button
            className={styles['close-btn']}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className={styles['modal-body']}>
          {children}
        </div>
      </div>
    </div>
  );
}
