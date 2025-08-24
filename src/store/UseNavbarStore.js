import { create } from "zustand";

export const UseNavbarStore = create((set) => ({
  // Active tab state
  activeTab: "LED Setup", // 'LED Setup' or 'Room Setup'

  // Application selection state
  selectedApplication: "Control Room",

  // Model state - null means empty model
  selectedModel: null,

  // Default state
  selectedContent: "Default Image",

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedApplication: (application) =>
    set({ selectedApplication: application }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedContent: (content) => set({ selectedContent: content }),

  // Clear selected model (back to empty state)
  clearSelectedModel: () => set({ selectedModel: null }),

  // Reset
  resetNavbar: () =>
    set({
      activeTab: "LED Setup",
      selectedApplication: "Control Room",
      selectedModel: null,
      selectedContent: "Default Image",
    }),
}));
