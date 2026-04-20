import React, { useEffect } from 'react';
import styles from '../styles/ProjectModal.module.css';

export default function ProjectModal({
  title,
  isOpen,
  onClose,
  children
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

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
            aria-label="Close modal"
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
