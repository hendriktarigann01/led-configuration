import { create } from "zustand";
import { model } from "../data/model";
import { UseNavbarStore } from "./UseNavbarStore";
import {
  DISPLAY_TYPE,
  SUB_TYPE,
  DISPLAY_TYPE_NAME,
  DISPLAY_IMAGE_PATH,
} from "../constants/Display";

export const UseModalStore = create((set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  isOpen: false,
  currentStep: "select", // 'select' | 'configure' | 'subtype'
  selectedDisplayTypeId: null,
  selectedSubTypeId: null,
  selectedModel: null,

  // ============================================================================
  // ACTIONS - State mutations
  // ============================================================================

  /**
   * Open modal and reset to initial state
   */
  openModal: () =>
    set({
      isOpen: true,
      currentStep: "select",
      selectedDisplayTypeId: null,
      selectedSubTypeId: null,
      selectedModel: null,
    }),

  /**
   * Close modal
   */
  closeModal: () =>
    set({
      isOpen: false,
      currentStep: "select",
      selectedDisplayTypeId: null,
      selectedSubTypeId: null,
      selectedModel: null,
    }),

  /**
   * Select display type and move to configure step
   */
  selectDisplayType: (displayTypeId) => {
    set({
      selectedDisplayTypeId: displayTypeId,
      currentStep: "configure",
      selectedSubTypeId: null,
      selectedModel: null,
    });
  },

  /**
   * Select sub-type for Indoor LED (Cabinet or Module)
   */
  selectSubType: (subTypeId) => {
    const { selectedModel } = get();

    let newSelectedModel = null;

    // If there's a previously selected model, try to find same pixel pitch
    if (selectedModel && selectedModel.pixel_pitch) {
      const targetDataId =
        subTypeId === SUB_TYPE.CABINET
          ? DISPLAY_TYPE.INDOOR_LED
          : DISPLAY_TYPE.MODULE;
      const targetType = model.find((item) => item.id === targetDataId);

      if (targetType) {
        newSelectedModel = targetType.data.find(
          (item) => item.pixel_pitch === selectedModel.pixel_pitch
        );
      }
    }

    set({
      selectedSubTypeId: subTypeId,
      selectedModel: newSelectedModel,
    });
  },

  /**
   * Select specific model configuration
   */
  selectModel: (modelConfig) =>
    set({
      selectedModel: modelConfig,
    }),

  /**
   * Move to next step
   */
  nextStep: () => {
    const { currentStep, selectedDisplayTypeId } = get();

    if (currentStep === "select") {
      set({
        currentStep: "configure",
        selectedModel: null,
      });
    } else if (
      currentStep === "configure" &&
      selectedDisplayTypeId === DISPLAY_TYPE.INDOOR_LED
    ) {
      set({
        currentStep: "subtype",
      });
    }
  },

  /**
   * Go back to previous step
   */
  goBack: () => {
    const { currentStep } = get();

    if (currentStep === "subtype") {
      set({
        currentStep: "configure",
        selectedSubTypeId: null,
        selectedModel: null,
      });
    } else if (currentStep === "configure") {
      set({
        currentStep: "select",
        selectedModel: null,
      });
    }
  },

  /**
   * Confirm selection and update navbar store
   */
  confirmSelection: () => {
    const {
      selectedDisplayTypeId,
      selectedSubTypeId,
      selectedModel,
      closeModal,
      getSelectedDisplayType,
    } = get();
    const displayType = getSelectedDisplayType();

    // Validate selection
    if (selectedDisplayTypeId && selectedModel && displayType) {
      // For Indoor LED, subtype must be selected
      if (
        selectedDisplayTypeId === DISPLAY_TYPE.INDOOR_LED &&
        !selectedSubTypeId
      ) {
        return;
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
      let imagePath = DISPLAY_IMAGE_PATH.INDOOR;
      if (displayType.name.includes("Outdoor")) {
        imagePath = DISPLAY_IMAGE_PATH.OUTDOOR;
      } else if (displayType.name.includes("Video")) {
        imagePath = DISPLAY_IMAGE_PATH.VIDEO_WALL;
      }

      // For Indoor LED, include sub-type info
      let displayName = displayType.name;
      if (
        selectedDisplayTypeId === DISPLAY_TYPE.INDOOR_LED &&
        selectedSubTypeId
      ) {
        const subTypeName =
          selectedSubTypeId === SUB_TYPE.CABINET ? "Cabinet" : "Module";
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

      navbarStore.setSelectedModel(finalData);
      closeModal();
    }
  },

  // ============================================================================
  // SELECTORS - Computed values
  // ============================================================================

  /**
   * Get display types from model data (filter out module data)
   */
  getDisplayTypes: () => {
    return model
      .filter((item) => item.id !== DISPLAY_TYPE.MODULE)
      .map((item) => ({
        id:
          item.id === DISPLAY_TYPE.INDOOR_LED
            ? DISPLAY_TYPE.INDOOR_LED
            : item.id,
        name:
          item.id === DISPLAY_TYPE.INDOOR_LED
            ? DISPLAY_TYPE_NAME[DISPLAY_TYPE.INDOOR_LED]
            : item.name,
        description: item.description,
        data: item.data,
      }));
  },

  /**
   * Get configurations for selected display type
   */
  getSelectedTypeConfigurations: () => {
    const { selectedDisplayTypeId, selectedSubTypeId } = get();
    if (!selectedDisplayTypeId) return [];

    // For Indoor LED, return data based on subtype selection
    if (selectedDisplayTypeId === DISPLAY_TYPE.INDOOR_LED) {
      if (selectedSubTypeId === SUB_TYPE.CABINET) {
        const selectedType = model.find(
          (item) => item.id === DISPLAY_TYPE.INDOOR_LED
        );
        return selectedType ? selectedType.data : [];
      } else if (selectedSubTypeId === SUB_TYPE.MODULE) {
        const selectedType = model.find(
          (item) => item.id === DISPLAY_TYPE.MODULE
        );
        return selectedType ? selectedType.data : [];
      } else {
        // No subtype selected, return cabinet data as default
        const selectedType = model.find(
          (item) => item.id === DISPLAY_TYPE.INDOOR_LED
        );
        return selectedType ? selectedType.data : [];
      }
    }

    // For other display types
    const selectedType = model.find(
      (item) => item.id === selectedDisplayTypeId
    );
    return selectedType ? selectedType.data : [];
  },

  /**
   * Get selected display type info
   */
  getSelectedDisplayType: () => {
    const { selectedDisplayTypeId } = get();
    if (!selectedDisplayTypeId) return null;

    // For Indoor LED, always return the generic info
    if (selectedDisplayTypeId === DISPLAY_TYPE.INDOOR_LED) {
      return {
        id: DISPLAY_TYPE.INDOOR_LED,
        name: DISPLAY_TYPE_NAME[DISPLAY_TYPE.INDOOR_LED],
        description:
          "Suitable for indoor use with a modular and flexible design.",
      };
    }

    return model.find((item) => item.id === selectedDisplayTypeId);
  },
}));
