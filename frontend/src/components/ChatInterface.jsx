import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/ChatInterface.module.css';
import MessageItem from './MessageItem';
import LoadingSpinner from './LoadingSpinner';
import { support } from '../utils/api';

export default function ChatInterface() {
  const [customerId, setCustomerId] = useState('user_' + Math.random().toString(36).substr(2, 9));
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await support.sendMessage(customerId, inputMessage, []);
      const payload = response?.data || response;

      const agentMessage = {
        id: Date.now() + 1,
        text: payload.agent_response,
        isUser: false,
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: payload.confidence_score,
          similarCases: payload.similar_past_cases,
          patterns: payload.hindsight_memory_used?.patterns_applied || []
        }
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      setError(err.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
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
          messages.map(msg => (
            <MessageItem key={msg.id} message={msg} isUser={msg.isUser} />
          ))
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
