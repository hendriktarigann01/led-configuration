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

  // Get display types from model data - filter out module data (ID 2)
  getDisplayTypes: () => {
    return model
      .filter((item) => item.id !== 2) // Exclude module data, only show cabinet
      .map((item) => ({
        id: item.id === 1 ? 1 : item.id, // Indoor LED will always be ID 1
        name: item.id === 1 ? "Indoor LED Fixed" : item.name,
        description: item.description,
        data: item.data,
      }));
  },

  getSelectedTypeConfigurations: () => {
    const { selectedDisplayTypeId, selectedSubTypeId } = get();
    if (!selectedDisplayTypeId) return [];

    // For Indoor LED, return data based on subtype selection
    if (selectedDisplayTypeId === 1) {
      if (selectedSubTypeId === 1) {
        // Cabinet - ID 1
        const selectedType = model.find((item) => item.id === 1);
        return selectedType ? selectedType.data : [];
      } else if (selectedSubTypeId === 2) {
        // Module - ID 2
        const selectedType = model.find((item) => item.id === 2);
        return selectedType ? selectedType.data : [];
      } else {
        // No subtype selected, return cabinet data as default
        const selectedType = model.find((item) => item.id === 1);
        return selectedType ? selectedType.data : [];
      }
    }

    // For other display types
    const selectedType = model.find(
      (item) => item.id === selectedDisplayTypeId
    );
    return selectedType ? selectedType.data : [];
  },

  // Get selected display type info
  getSelectedDisplayType: () => {
    const { selectedDisplayTypeId } = get();
    if (!selectedDisplayTypeId) return null;

    // For Indoor LED, always return the generic info
    if (selectedDisplayTypeId === 1) {
      return {
        id: 1,
        name: "Indoor LED Fixed",
        description:
          "Suitable for indoor use with a modular and flexible design.",
      };
    }

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
    const { selectedModel } = get();

    // Ketika subtype berubah, reset selectedModel karena kita pindah antara cabinet dan module
    // yang memiliki struktur data berbeda
    let newSelectedModel = null;

    // Jika ada model yang sudah dipilih sebelumnya, coba cari yang pixel pitch sama
    if (selectedModel && selectedModel.pixel_pitch) {
      const targetDataId = subTypeId === 1 ? 1 : 2; // 1 for Cabinet, 2 for Module
      const targetType = model.find((item) => item.id === targetDataId);

      if (targetType) {
        // Cari model dengan pixel pitch yang sama
        newSelectedModel = targetType.data.find(
          (item) => item.pixel_pitch === selectedModel.pixel_pitch
        );
      }
    }

    console.log(
      "Switching to subtype:",
      subTypeId === 1 ? "Cabinet" : "Module"
    );
    console.log("New selected model:", newSelectedModel);

    set({
      selectedSubTypeId: subTypeId,
      selectedModel: newSelectedModel,
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

    console.log("=== CONFIRM SELECTION DEBUG ===");
    console.log("selectedDisplayTypeId:", selectedDisplayTypeId);
    console.log("selectedSubTypeId:", selectedSubTypeId);
    console.log("selectedModel:", selectedModel);
    console.log(
      "Model type:",
      selectedModel?.cabinet_size ? "Cabinet" : "Module"
    );

    // Pastikan semua data yang diperlukan sudah dipilih
    if (selectedDisplayTypeId && selectedModel && displayType) {
      // For Indoor LED, subtype harus dipilih
      if (selectedDisplayTypeId === 1 && !selectedSubTypeId) {
        console.log("Missing subtype for Indoor LED");
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

      const finalData = {
        name: displayName,
        code: modelCode,
        image: imagePath,
        displayTypeId: selectedDisplayTypeId,
        subTypeId: selectedSubTypeId,
        modelData: selectedModel,
      };

      console.log("Final data being sent to navbar:", finalData);

      navbarStore.setSelectedModel(finalData);

      // Close modal after confirmation
      closeModal();
    }
  },
}));
