import React from 'react';
import '../styles/MessageItem.module.css';

export default function MessageItem({ message, isUser }) {
  return (
    <div className={`message-item ${isUser ? 'user-message' : 'agent-message'}`}>
      <div className="message-content">
        <p>{message.text}</p>
        {message.metadata && (
          <div className="message-metadata">
            {message.metadata.confidence && (
              <span>Confidence: {(message.metadata.confidence * 100).toFixed(0)}%</span>
            )}
            {message.metadata.similarCases && (
              <span>Based on {message.metadata.similarCases} similar cases</span>
            )}
          </div>
        )}
      </div>
      <span className="message-time">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}
