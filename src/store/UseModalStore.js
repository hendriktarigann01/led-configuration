import { create } from "zustand";
import { model } from "../data/model";
import { UseNavbarStore } from "./UseNavbarStore";

export const UseModalStore = create((set, get) => ({
  // Modal visibility
  isOpen: false,

  // Current step: 'select' | 'subtype' | 'configure'
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
      data: item.data,
    }));
  },

  // Get configurations for selected display type and sub-type
  getSelectedTypeConfigurations: () => {
    const { selectedDisplayTypeId, selectedSubTypeId } = get();
    if (!selectedDisplayTypeId) return [];

    // For Indoor LED Fixed (id=1), filter by sub-type
    if (selectedDisplayTypeId === 1 && selectedSubTypeId) {
      const subTypeData = model.find((item) => item.id === selectedSubTypeId);
      return subTypeData ? subTypeData.data : [];
    }

    // For other display types, use display type directly
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
    // If Indoor LED Fixed is selected, go to subtype step
    if (displayTypeId === 1) {
      set({
        selectedDisplayTypeId: displayTypeId,
        currentStep: "subtype",
        selectedSubTypeId: null,
        selectedModel: null,
      });
    } else {
      // For other types, go directly to configure step
      set({
        selectedDisplayTypeId: displayTypeId,
        currentStep: "configure",
        selectedSubTypeId: null,
        selectedModel: null,
      });
    }
  },

  selectSubType: (subTypeId) =>
    set({
      selectedSubTypeId: subTypeId,
      selectedModel: null,
    }),

  selectModel: (model) =>
    set({
      selectedModel: model,
    }),

  nextStep: () => {
    const { currentStep, selectedDisplayTypeId } = get();

    if (currentStep === "select") {
      // This is handled by selectDisplayType already
      return;
    }

    if (currentStep === "subtype") {
      set({
        currentStep: "configure",
        selectedModel: null,
      });
    }
  },

  goBack: () => {
    const { currentStep } = get();

    if (currentStep === "configure") {
      const { selectedDisplayTypeId } = get();
      // If coming from Indoor LED, go back to subtype step
      if (selectedDisplayTypeId === 1) {
        set({
          currentStep: "subtype",
          selectedModel: null,
        });
      } else {
        // For other types, go back to select step
        set({
          currentStep: "select",
          selectedModel: null,
        });
      }
    } else if (currentStep === "subtype") {
      set({
        currentStep: "select",
        selectedSubTypeId: null,
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
    }

    // Close modal after confirmation
    closeModal();
  },
}));
