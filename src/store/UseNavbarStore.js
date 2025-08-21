import { create } from 'zustand';

export const UseNavbarStore = create((set) => ({
  // Active tab state
  activeTab: 'LED Setup', // 'LED Setup' or 'Room Setup'
  
  // Application selection state
  selectedApplication: 'Control Room', 

  // Model state
  selectedModel: {
    name: 'Indoor Modul Fixed',
    code: 'P 1.8',
    image: '/path/to/model-image.png' 
  },
  
  // Default state
  selectedContent: 'Default Image', 
  
  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedApplication: (application) => set({ selectedApplication: application }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedContent: (content) => set({ selectedContent: content }),
  
  // Reset 
  resetNavbar: () => set({
    activeTab: 'LED Setup',
    selectedApplication: 'Control Room',
    selectedModel: {
      name: 'Indoor Modul Fixed',
      code: 'P 1.8',
      image: '/path/to/model-image.png'
    },
    selectedContent: 'Default Image'
  })
}));
