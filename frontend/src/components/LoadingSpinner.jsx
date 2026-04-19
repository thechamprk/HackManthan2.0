import React from 'react';
import styles from '../styles/LoadingSpinner.module.css';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className={styles['spinner-overlay']}>
      <div className={styles['spinner-container']}>
        <div className={styles.spinner}></div>
        <p>{message}</p>
      </div>
    </div>
  );
}
