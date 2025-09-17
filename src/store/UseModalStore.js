import { create } from "zustand";
import { model } from "../data/model";
import { UseNavbarStore } from "./UseNavbarStore";

export const UseModalStore = create((set, get) => ({
  // Modal visibility
  isOpen: false,

  // Current step: 'select' | 'configure' | 'subtype'
  currentStep: "select",

  // Selected display type ID
  selectedDisplayTypeId: null,

  // Selected sub-type ID (for Indoor LED: 1=Cabinet, 2=Module)
  selectedSubTypeId: null,

  // Selected model configuration
  selectedModel: null,

  // Get display types from model data
  getDisplayTypes: () => {
    return model.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      data: item.data,
    }));
  },

  getSelectedTypeConfigurations: () => {
    const { selectedDisplayTypeId } = get();
    if (!selectedDisplayTypeId) return [];

    const selectedType = model.find(
      (item) => item.id === selectedDisplayTypeId
    );
    return selectedType ? selectedType.data : [];
  },

  // Get selected display type info
  getSelectedDisplayType: () => {
    const { selectedDisplayTypeId } = get();
    if (!selectedDisplayTypeId) return null;

    return model.find((item) => item.id === selectedDisplayTypeId);
  },

  // Actions
  openModal: () =>
    set({
      isOpen: true,
      currentStep: "select",
      selectedDisplayTypeId: null,
      selectedSubTypeId: null,
      selectedModel: null,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      currentStep: "select",
      selectedDisplayTypeId: null,
      selectedSubTypeId: null,
      selectedModel: null,
    }),

  selectDisplayType: (displayTypeId) => {
    // All display types go to configure step first
    set({
      selectedDisplayTypeId: displayTypeId,
      currentStep: "configure",
      selectedSubTypeId: null,
      selectedModel: null,
    });
  },

  selectSubType: (subTypeId) => {
    let displayTypeId = 1; // default Cabinet
    if (subTypeId === 2) displayTypeId = 2; // Module

    const typeData = model.find((item) => item.id === displayTypeId);

    set({
      selectedSubTypeId: subTypeId,
      selectedDisplayTypeId: displayTypeId,
      selectedModel:
        typeData && typeData.data.length > 0 ? typeData.data[0] : null,
    });
  },
  selectModel: (model) =>
    set({
      selectedModel: model,
    }),

  nextStep: () => {
    const { currentStep, selectedDisplayTypeId } = get();

    if (currentStep === "select") {
      // Go to configure step
      set({
        currentStep: "configure",
        selectedModel: null,
      });
    } else if (currentStep === "configure") {
      // If Indoor LED, go to subtype selection
      if (selectedDisplayTypeId === 1) {
        set({
          currentStep: "subtype",
        });
      }
      // For other types, this shouldn't happen as they confirm directly
    }
  },

  goBack: () => {
    const { currentStep } = get();

    if (currentStep === "subtype") {
      // Go back to configure step
      set({
        currentStep: "configure",
        selectedSubTypeId: null,
        selectedModel: null,
      });
    } else if (currentStep === "configure") {
      // Go back to select step
      set({
        currentStep: "select",
        selectedModel: null,
      });
    }
  },

  confirmSelection: () => {
    const {
      selectedDisplayTypeId,
      selectedSubTypeId,
      selectedModel,
      closeModal,
      getSelectedDisplayType,
    } = get();
    const displayType = getSelectedDisplayType();

    // Pastikan semua data yang diperlukan sudah dipilih
    if (selectedDisplayTypeId && selectedModel && displayType) {
      // For Indoor LED, subtype harus dipilih
      if (selectedDisplayTypeId === 1 && !selectedSubTypeId) {
        return; // Jangan konfirmasi jika subtype belum dipilih
      }

      // Update navbar store with selected model
      const navbarStore = UseNavbarStore.getState();

      // Get the primary identifier based on display type
      let modelCode = "";
      if (selectedModel.pixel_pitch) {
        modelCode = selectedModel.pixel_pitch;
      } else if (selectedModel.inch) {
        modelCode = selectedModel.inch;
      }

      // Determine image path based on display type
      let imagePath = "/product/model/indoor.svg";
      if (displayType.name.includes("Outdoor")) {
        imagePath = "/product/model/outdoor.svg";
      } else if (displayType.name.includes("Video")) {
        imagePath = "/product/model/video_wall.svg";
      }

      // For Indoor LED, include sub-type info
      let displayName = displayType.name;
      if (selectedDisplayTypeId === 1 && selectedSubTypeId) {
        const subTypeName = selectedSubTypeId === 1 ? "Cabinet" : "Module";
        displayName = `${displayType.name} - ${subTypeName}`;
      }

      navbarStore.setSelectedModel({
        name: displayName,
        code: modelCode,
        image: imagePath,
        displayTypeId: selectedDisplayTypeId,
        subTypeId: selectedSubTypeId,
        modelData: selectedModel,
      });

      // Close modal after confirmation
      closeModal();
    }
  },
}));
