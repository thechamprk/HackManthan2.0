import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/ChatInterface.module.css';
import MessageItem from './MessageItem';
import LoadingSpinner from './LoadingSpinner';
import useChat from '../hooks/useChat';

export default function ChatInterface() {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { messages, sendMessage, isLoading, error, customerId } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const messageToSend = inputMessage;
    setInputMessage('');
    await sendMessage(messageToSend);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles['chat-interface']}>
      <div className={styles['chat-header']}>
        <h2>Support Chat</h2>
        <div className={styles['customer-info']}>
          <small>Customer ID: {customerId}</small>
        </div>
      </div>

      <div className={styles['messages-container']}>
        {messages.length === 0 ? (
          <div className={styles['empty-state']}>
            <h3>👋 Welcome to Hindsight Expert</h3>
            <p>Ask any support question and watch as the AI learns from past interactions</p>
          </div>
        ) : (
          messages.map((msg) => <MessageItem key={msg.id} message={msg} isUser={msg.isUser} />)
        )}
        {isLoading && <LoadingSpinner message="Agent is thinking..." />}
        {error && (
          <div className={styles['error-message']}>
            <strong>Error:</strong> {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles['input-section']}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your support question..."
          disabled={isLoading}
          rows="3"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className={styles['send-button']}
        >
          {isLoading ? '⏳ Sending...' : '📤 Send'}
        </button>
      </div>
    </div>
  );
}
