import React from 'react';
import styles from '../styles/ProjectTile.module.css';

export default function ProjectTile({
  title,
  description,
  icon,
  onClick
}) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={styles['project-tile']}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles['tile-icon']}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={styles['tile-action']}>Open →</span>
    </div>
  );
}
