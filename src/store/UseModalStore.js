import { create } from 'zustand';
import { model } from '../data/model';

export const UseModalStore = create((set, get) => ({
  // Modal visibility
  isOpen: false,
  
  // Current step: 'select' | 'configure'
  currentStep: 'select',
  
  // Selected display type ID
  selectedDisplayTypeId: null,
  
  // Selected model configuration
  selectedModel: null,
  
  // Get display types from model data
  getDisplayTypes: () => {
    return model.map(item => ({
      id: item.id,
      name: item.name,
      data: item.data
    }));
  },
  
  // Get configurations for selected display type
  getSelectedTypeConfigurations: () => {
    const { selectedDisplayTypeId } = get();
    if (!selectedDisplayTypeId) return [];
    
    const selectedType = model.find(item => item.id === selectedDisplayTypeId);
    return selectedType ? selectedType.data : [];
  },
  
  // Get selected display type info
  getSelectedDisplayType: () => {
    const { selectedDisplayTypeId } = get();
    if (!selectedDisplayTypeId) return null;
    
    return model.find(item => item.id === selectedDisplayTypeId);
  },
  
  // Actions
  openModal: () => set({ 
    isOpen: true, 
    currentStep: 'select',
    selectedDisplayTypeId: null,
    selectedModel: null 
  }),
  
  closeModal: () => set({ 
    isOpen: false,
    currentStep: 'select',
    selectedDisplayTypeId: null,
    selectedModel: null
  }),
  
  selectDisplayType: (displayTypeId) => set({ 
    selectedDisplayTypeId: displayTypeId,
    currentStep: 'configure',
    selectedModel: null
  }),
  
  selectModel: (model) => set({ 
    selectedModel: model 
  }),
  
  goBack: () => set({ 
    currentStep: 'select',
    selectedModel: null 
  }),
  
  confirmSelection: () => {
    const { selectedDisplayTypeId, selectedModel, closeModal, getSelectedDisplayType } = get();
    const displayType = getSelectedDisplayType();
    
    // Here you can update the main canvas/navbar store with selected values
    console.log('Selected:', { 
      displayType: displayType?.name, 
      model: selectedModel 
    });
    
    // Close modal after confirmation
    closeModal();
  }
}));
