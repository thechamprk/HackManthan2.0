import { useCallback } from 'react';
import { support } from '../utils/api';
import useChatStore from '../context/ChatContext';

export const useChat = () => {
  const { messages, addMessage, setLoading, setError, clearChat, setMemoryContext } = useChatStore();
  const customerId = useChatStore((state) => state.customerId);
  const isLoading = useChatStore((state) => state.isLoading);
  const error = useChatStore((state) => state.error);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      const userMessage = {
        id: Date.now(),
        text,
        isUser: true,
        timestamp: new Date().toISOString()
      };

      addMessage(userMessage);
      setLoading(true);
      setError(null);

      try {
        const context = messages.map((message) => ({
          role: message.isUser ? 'user' : 'assistant',
          content: message.text
        }));
        const response = await support.sendMessage(customerId, text, context);

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

        addMessage(agentMessage);
        setMemoryContext(payload.hindsight_memory_used);
      } catch (err) {
        setError(err.message || 'Failed to send message');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    },
    [customerId, messages, addMessage, setLoading, setError, setMemoryContext]
  );

  return {
    messages,
    sendMessage,
    clearChat,
    isLoading,
    error,
    customerId
  };
};

export default useChat;
