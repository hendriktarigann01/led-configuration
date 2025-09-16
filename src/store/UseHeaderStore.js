import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";
import { UseNavbarStore } from "./UseNavbarStore";
import { UseCalculatorStore } from "./UseCalculatorStore";

export const UseHeaderStore = create((set, get) => ({
  // Display settings
  screenSize: "Area",
  resolution: "Custom",
  screenHeight: 0,
  screenWidth: 0,

  // Wall settings with default values
  unit: "Meter",
  wallHeight: 3, // Default 3m height
  wallWidth: 5, // Default 5m width

  // Initialize default wall values in canvas store
  initializeDefaults: () => {
    const canvasStore = UseCanvasStore.getState();
    const { wallWidth, wallHeight } = get();

    if (
      canvasStore.wallWidth !== wallWidth ||
      canvasStore.wallHeight !== wallHeight
    ) {
      canvasStore.setWallSize(wallWidth, wallHeight);
    }
  },

  // Helper function to get current model data
  getCurrentModelData: () => {
    const navbarStore = UseNavbarStore.getState();
    if (!navbarStore.selectedModel || !navbarStore.selectedModel.modelData) {
      return { modelData: null, displayType: null };
    }

    return {
      modelData: navbarStore.selectedModel.modelData,
      displayType: navbarStore.selectedModel.name,
    };
  },

  // Calculate screen size based on resolution mode
  calculateScreenSizeFromResolution: (resolutionMode) => {
    const canvasStore = UseCanvasStore.getState();
    const calculator = UseCalculatorStore.getState();
    const { baseWidth, baseHeight } = canvasStore;
    const { modelData, displayType } = get().getCurrentModelData();

    if (!baseWidth || !baseHeight || !modelData) {
      return { width: 0, height: 0 };
    }

    return calculator.calculateScreenSizeFromResolution(
      modelData,
      displayType,
      resolutionMode,
      baseWidth,
      baseHeight
    );
  },

  // Get resolution info for display purposes
  getResolutionInfo: () => {
    const { resolution } = get();
    const { modelData, displayType } = get().getCurrentModelData();

    if (!modelData) return null;

    const calculator = UseCalculatorStore.getState();

    if (resolution === "Custom") {
      const currentState = get();
      const canvasStore = UseCanvasStore.getState();

      const unitCount = calculator.calculateUnitCount(
        currentState.screenWidth,
        currentState.screenHeight,
        canvasStore.baseWidth,
        canvasStore.baseHeight
      );

      const modelResolutionField = calculator.getResolutionField(
        modelData,
        displayType
      );
      const modelResolution = calculator.parseResolution(modelResolutionField);

      const actualResolution = {
        width: unitCount.horizontal * modelResolution.width,
        height: unitCount.vertical * modelResolution.height,
      };

      return {
        target: { width: "Custom", height: "Custom" },
        actual: actualResolution,
        units: unitCount,
        modelResolution: modelResolution,
        isCustom: true,
      };
    }

    return calculator.getTargetResolutionInfo(
      modelData,
      displayType,
      resolution
    );
  },

  // Basic setters
  setScreenSize: (size) => set({ screenSize: size }),

  setResolution: (resolution) => {
    set({ resolution });

    if (resolution !== "Custom") {
      const screenSize = get().calculateScreenSizeFromResolution(resolution);
      const canvasStore = UseCanvasStore.getState();

      set({
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
      });

      canvasStore.setScreenSize(screenSize.width, screenSize.height);

      // Auto-adjust wall size if needed
      const currentState = get();
      const minWallWidth = Math.max(5, screenSize.width + 2);
      const minWallHeight = Math.max(3, screenSize.height + 1.5);

      let newWallWidth = currentState.wallWidth;
      let newWallHeight = currentState.wallHeight;

      if (currentState.wallWidth < minWallWidth) {
        newWallWidth = minWallWidth;
      }

      if (currentState.wallHeight < minWallHeight) {
        newWallHeight = minWallHeight;
      }

      if (
        newWallWidth !== currentState.wallWidth ||
        newWallHeight !== currentState.wallHeight
      ) {
        set({
          wallWidth: newWallWidth,
          wallHeight: newWallHeight,
        });
        canvasStore.setWallSize(newWallWidth, newWallHeight);
      }
    } else {
      // Custom mode - sync with canvas
      const canvasStore = UseCanvasStore.getState();
      const actualScreenSize = canvasStore.getActualScreenSize();
      const currentState = get();

      if (
        currentState.screenWidth !== actualScreenSize.width ||
        currentState.screenHeight !== actualScreenSize.height
      ) {
        set({
          screenWidth: actualScreenSize.width,
          screenHeight: actualScreenSize.height,
        });
      }

      // Validate wall size - allow wall to match screen size but minimum 1m
      const minWallWidth = Math.max(1, actualScreenSize.width);
      const minWallHeight = Math.max(1, actualScreenSize.height);

      if (
        currentState.wallWidth < minWallWidth ||
        currentState.wallHeight < minWallHeight
      ) {
        const newWallWidth = Math.max(currentState.wallWidth, minWallWidth);
        const newWallHeight = Math.max(currentState.wallHeight, minWallHeight);

        set({
          wallWidth: newWallWidth,
          wallHeight: newWallHeight,
        });
        canvasStore.setWallSize(newWallWidth, newWallHeight);
      }
    }
  },

  setScreenHeight: (height) => {
    const canvasStore = UseCanvasStore.getState();
    set({ screenHeight: height });
    canvasStore.setScreenSize(get().screenWidth, height);
  },

  setScreenWidth: (width) => {
    const canvasStore = UseCanvasStore.getState();
    set({ screenWidth: width });
    canvasStore.setScreenSize(width, get().screenHeight);
  },

  setWallWidth: (width) => {
    const canvasStore = UseCanvasStore.getState();
    const currentState = get();
    const actualScreenSize = canvasStore.getActualScreenSize();

    // Allow wall to be exactly same size as screen, but minimum 1m
    const minWidth = Math.max(1, actualScreenSize.width);
    const finalWidth = Math.max(minWidth, width);

    set({ wallWidth: finalWidth });
    canvasStore.setWallSize(finalWidth, currentState.wallHeight);
  },

  setWallHeight: (height) => {
    const canvasStore = UseCanvasStore.getState();
    const currentState = get();
    const actualScreenSize = canvasStore.getActualScreenSize();

    // Allow wall to be exactly same size as screen, but minimum 1m
    const minHeight = Math.max(1, actualScreenSize.height);
    const finalHeight = Math.max(minHeight, height);

    set({ wallHeight: finalHeight });
    canvasStore.setWallSize(currentState.wallWidth, finalHeight);
  },

  // Screen increment/decrement utilities
  incrementScreenHeight: () => {
    if (get().resolution !== "Custom") return;

    const canvasStore = UseCanvasStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight <= 0) return;

    const state = get();
    const newHeight = Number((state.screenHeight + baseHeight).toFixed(3));
    state.setScreenHeight(newHeight);
  },

  decrementScreenHeight: () => {
    if (get().resolution !== "Custom") return;

    const canvasStore = UseCanvasStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight <= 0) return;

    const state = get();
    const newHeight = Math.max(
      baseHeight,
      Number((state.screenHeight - baseHeight).toFixed(3))
    );
    state.setScreenHeight(newHeight);
  },

  incrementScreenWidth: () => {
    if (get().resolution !== "Custom") return;

    const canvasStore = UseCanvasStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth <= 0) return;

    const state = get();
    const newWidth = Number((state.screenWidth + baseWidth).toFixed(3));
    state.setScreenWidth(newWidth);
  },

  decrementScreenWidth: () => {
    if (get().resolution !== "Custom") return;

    const canvasStore = UseCanvasStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth <= 0) return;

    const state = get();
    const newWidth = Math.max(
      baseWidth,
      Number((state.screenWidth - baseWidth).toFixed(3))
    );
    state.setScreenWidth(newWidth);
  },

  // Cabinet increment/decrement methods (aliases)
  incrementCabinetHeight: () => get().incrementScreenHeight(),
  decrementCabinetHeight: () => get().decrementScreenHeight(),
  incrementCabinetWidth: () => get().incrementScreenWidth(),
  decrementCabinetWidth: () => get().decrementScreenWidth(),

  // Wall increment/decrement utilities
  incrementWallHeight: () => {
    const state = get();
    const newHeight = Number((state.wallHeight + 0.5).toFixed(1));
    state.setWallHeight(newHeight);
  },

  decrementWallHeight: () => {
    const state = get();
    const minHeight = 1; // Changed from 3 to 1
    const newHeight = Math.max(
      minHeight,
      Number((state.wallHeight - 0.5).toFixed(1))
    );
    state.setWallHeight(newHeight);
  },

  incrementWallWidth: () => {
    const state = get();
    const newWidth = Number((state.wallWidth + 0.5).toFixed(1));
    state.setWallWidth(newWidth);
  },

  decrementWallWidth: () => {
    const state = get();
    const minWidth = 1; // Changed from 5 to 1
    const newWidth = Math.max(
      minWidth,
      Number((state.wallWidth - 0.5).toFixed(1))
    );
    state.setWallWidth(newWidth);
  },

  // Validation methods
  isScreenControlsEnabled: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.isConfigured();
  },

  isWallControlsEnabled: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.isConfigured();
  },

  // Canvas sync method
  syncWithCanvas: () => {
    const canvasStore = UseCanvasStore.getState();

    get().initializeDefaults();

    const actualScreenSize = canvasStore.getActualScreenSize();

    set({
      screenWidth: actualScreenSize.width,
      screenHeight: actualScreenSize.height,
      wallWidth: canvasStore.wallWidth,
      wallHeight: canvasStore.wallHeight,
    });
  },

  // Complete reset method - resets to defaults
  resetToDefaults: () => {
    set({
      screenSize: "Area",
      resolution: "Custom",
      screenHeight: 0,
      screenWidth: 0,
      unit: "Meter",
      wallHeight: 3,
      wallWidth: 5,
    });
  },
}));
