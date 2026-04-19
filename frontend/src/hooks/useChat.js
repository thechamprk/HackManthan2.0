import { useMemo } from 'react';
import { useChatStore } from '../context/ChatContext';
import { request, support } from '../utils/api';
import { CHAT_MESSAGES_LIMIT } from '../utils/constants';

function createUserMessage(content) {
  return {
    id: `u_${Date.now()}`,
    role: 'user',
    content: content.trim(),
    timestamp: new Date().toISOString()
  };
}

function createSystemError(message) {
  return {
    id: `err_${Date.now()}`,
    role: 'agent',
    content: `I could not complete that request: ${message}`,
    timestamp: new Date().toISOString(),
    confidence: 0,
    provider: 'system'
  };
}

export function useChat(customerId) {
  const {
    messages,
    loading,
    isLoading,
    error,
    memory,
    currentCustomerId,
    lastMetadata,
    resolvedIds,
    addMessage,
    setCurrentCustomerId,
    setError,
    setMemory,
    setLoading,
    setLastMetadata,
    markResolved,
    clearChat
  } = useChatStore();

  const activeCustomerId = customerId || currentCustomerId;

  const conversationContext = useMemo(
    () =>
      messages.map((message) => ({
        role: message.role === 'agent' ? 'assistant' : 'user',
        content: message.content
      })),
    [messages]
  );

  async function sendSupportMessage(content) {
    if (!content.trim() || loading) return;
    if (!activeCustomerId) {
      setError('customerId is required');
      return;
    }

    const userMessage = createUserMessage(content);
    addMessage(userMessage);
    setLoading(true);

    try {
      const payload = await support.sendMessage(
        activeCustomerId,
        userMessage.content,
        [...conversationContext, { role: 'user', content: userMessage.content }]
      );

      if (!payload.success) {
        throw new Error(payload?.error?.message || 'Failed to send message');
      }

      const data = payload.data;
      setCurrentCustomerId(activeCustomerId);
      setError('');
      setMemory(data.hindsight_memory_used || { retrieved_cases: [], patterns_applied: [] });
      addMessage({
        id: data.interaction_id,
        role: 'agent',
        interactionId: data.interaction_id,
        content: data.agent_response || data.agentResponse,
        timestamp: data.timestamp || new Date().toISOString(),
        confidence: Number(data.confidence_score ?? data.confidenceScore ?? 0),
        provider: data.provider || 'agent'
      });
      setLastMetadata(data);
    } catch (error) {
      setError(error.message);
      addMessage(createSystemError(error.message));
    } finally {
      setLoading(false);
    }
  }

  async function markInteractionResolved(interactionId) {
    if (!interactionId || resolvedIds[interactionId]) return;

    try {
      const payload = await request(`/api/support/${interactionId}/effectiveness`, {
        method: 'PUT',
        data: { effectiveness_score: 1 }
      });

      if (!payload.success) {
        throw new Error(payload?.error?.message || 'Failed to mark as resolved');
      }

      markResolved(interactionId);
    } catch (error) {
      addMessage(createSystemError(error.message));
    }
  }

  return {
    messages: messages.slice(-CHAT_MESSAGES_LIMIT),
    isLoading: isLoading || loading,
    loading: isLoading || loading,
    error,
    memory,
    lastMetadata,
    resolvedIds,
    sendMessage: sendSupportMessage,
    sendSupportMessage,
    clearChat,
    markInteractionResolved
  };
}
