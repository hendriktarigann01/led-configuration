import { create } from "zustand";
import { model } from "../data/model";
import { UseNavbarStore } from "./UseNavbarStore";

export const UseModalStore = create((set, get) => ({
  // Modal visibility
  isOpen: false,

  // Current step: 'select' | 'configure'
  currentStep: "select",

  // Selected display type ID
  selectedDisplayTypeId: null,

  // Selected model configuration
  selectedModel: null,

  // Get display types from model data
  getDisplayTypes: () => {
    return model.map((item) => ({
      id: item.id,
      name: item.name,
      data: item.data,
    }));
  },

  // Get configurations for selected display type
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
      selectedModel: null,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      currentStep: "select",
      selectedDisplayTypeId: null,
      selectedModel: null,
    }),

  selectDisplayType: (displayTypeId) =>
    set({
      selectedDisplayTypeId: displayTypeId,
      currentStep: "configure",
      selectedModel: null,
    }),

  selectModel: (model) =>
    set({
      selectedModel: model,
    }),

  goBack: () =>
    set({
      currentStep: "select",
      selectedModel: null,
    }),

  confirmSelection: () => {
    const {
      selectedDisplayTypeId,
      selectedModel,
      closeModal,
      getSelectedDisplayType,
    } = get();
    const displayType = getSelectedDisplayType();

    if (selectedDisplayTypeId && selectedModel && displayType) {
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

      navbarStore.setSelectedModel({
        name: displayType.name,
        code: modelCode,
        image: imagePath,
        displayTypeId: selectedDisplayTypeId,
        modelData: selectedModel,
      });
    }

    // Close modal after confirmation
    closeModal();
  },
}));
