import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  currentCustomerId: '',
  isLoading: false,
  loading: false,
  error: '',
  memory: { retrieved_cases: [], patterns_applied: [] },
  lastMetadata: null,
  resolvedIds: {},
  setCurrentCustomerId: (currentCustomerId) => set({ currentCustomerId }),
  setLoading: (loading) => set({ loading, isLoading: loading }),
  setError: (error) => set({ error }),
  setMemory: (memory) => set({ memory }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLastMetadata: (lastMetadata) => set({ lastMetadata }),
  markResolved: (interactionId) =>
    set((state) => ({
      resolvedIds: {
        ...state.resolvedIds,
        [interactionId]: true
      }
    })),
  clearChat: () =>
    set({
      messages: [],
      error: '',
      memory: { retrieved_cases: [], patterns_applied: [] },
      lastMetadata: null,
      resolvedIds: {}
    })
}));
