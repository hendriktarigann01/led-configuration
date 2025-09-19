import { create } from "zustand";

export const UseNavbarStore = create((set) => ({
  // Active tab state - removed since no more tabs needed
  activeTab: "LED Setup", // Keep for backward compatibility if needed

  // Model state - null means empty model
  selectedModel: null,

  // Default state
  selectedContent: "Default Image",

  // Custom image URL for uploaded files
  customImageUrl: null,

  // Room image URL for room setup
  roomImageUrl: null,

  // Crop settings for Cropper.js positioning
  cropSettings: null, // { canvasData, cropBoxData }

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
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
      selectedModel: null,
      selectedContent: "Default Image",
      customImageUrl: null,
      roomImageUrl: null,
      cropSettings: null,
    }),
}));
