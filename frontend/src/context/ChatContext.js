import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  loading: false,
  lastMetadata: null,
  resolvedIds: {},
  setLoading: (loading) => set({ loading }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setLastMetadata: (lastMetadata) => set({ lastMetadata }),
  markResolved: (interactionId) =>
    set((state) => ({
      resolvedIds: {
        ...state.resolvedIds,
        [interactionId]: true
      }
    })),
  clearChat: () => set({ messages: [], lastMetadata: null, resolvedIds: {} })
}));
