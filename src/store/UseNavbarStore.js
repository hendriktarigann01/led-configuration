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

  // Custom image URL for uploaded files
  customImageUrl: null,

  // Room image URL for room setup
  roomImageUrl: null,

  // Crop settings for room image positioning
  cropSettings: null, // { x, y, width, height, scale, rotate }

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedApplication: (application) =>
    set({ selectedApplication: application }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedContent: (content) => set({ selectedContent: content }),
  setCustomImageUrl: (url) => set({ customImageUrl: url }),
  setRoomImageUrl: (url) => set({ roomImageUrl: url }),
  setCropSettings: (settings) => set({ cropSettings: settings }),

  // Clear selected model (back to empty state)
  clearSelectedModel: () => set({ selectedModel: null }),

  // Reset
  resetNavbar: () =>
    set({
      activeTab: "LED Setup",
      selectedApplication: "Control Room",
      selectedModel: null,
      selectedContent: "Default Image",
      customImageUrl: null,
      roomImageUrl: null,
      cropSettings: null,
    }),
}));
