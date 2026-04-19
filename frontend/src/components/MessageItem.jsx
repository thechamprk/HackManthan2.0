import React from 'react';
import styles from '../styles/MessageItem.module.css';

export default function MessageItem({ message, isUser }) {
  return (
    <div className={`${styles['message-item']} ${isUser ? styles['user-message'] : styles['agent-message']}`}>
      <div className={styles['message-content']}>
        <p>{message.text}</p>
        {message.metadata && (
          <div className={styles['message-metadata']}>
            {message.metadata.confidence && (
              <span>Confidence: {(message.metadata.confidence * 100).toFixed(0)}%</span>
            )}
            {message.metadata.similarCases && (
              <span>Based on {message.metadata.similarCases} similar cases</span>
            )}
          </div>
        )}
      </div>
      <span className={styles['message-time']}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}
