import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  customerId: 'user_' + Math.random().toString(36).substr(2, 9),
  isLoading: false,
  error: null,
  memoryContext: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message]
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setMemoryContext: (context) => set({ memoryContext: context }),

  clearChat: () => set({ messages: [], error: null, memoryContext: null }),

  setMessages: (messages) => set({ messages })
}));

export default useChatStore;
