import React from 'react';
import styles from '../styles/ProjectTile.module.css';

export default function ProjectTile({
  title,
  description,
  icon,
  onClick
}) {
  return (
    <div className={styles['project-tile']} onClick={onClick}>
      <div className={styles['tile-icon']}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={styles['tile-action']}>Open →</span>
    </div>
  );
}
