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

    // Only set if canvas store doesn't have proper wall dimensions
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

    // Use calculator to determine screen size based on resolution
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

    if (resolution === "Custom" || !modelData) return null;

    const calculator = UseCalculatorStore.getState();
    return calculator.getTargetResolutionInfo(
      modelData,
      displayType,
      resolution
    );
  },

  // Screen dimension actions
  setScreenSize: (size) => set({ screenSize: size }),

  setResolution: (resolution) => {
    set({ resolution });

    // If not custom, calculate and set screen size based on resolution
    if (resolution !== "Custom") {
      const screenSize = get().calculateScreenSizeFromResolution(resolution);
      const canvasStore = UseCanvasStore.getState();

      // Update header store values
      set({
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
      });

      // Update canvas store
      canvasStore.setScreenSize(screenSize.width, screenSize.height);

      // Auto-adjust wall size to accommodate new screen size with margin
      const currentState = get();
      const minWallWidth = Math.max(5, screenSize.width + 2); // 2m margin minimum
      const minWallHeight = Math.max(3, screenSize.height + 1.5); // 1.5m margin minimum

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

  // Wall dimension actions with minimum limits
  setWallHeight: (height) => {
    const canvasStore = UseCanvasStore.getState();
    const minHeight = 3; // Minimum 3m height
    const finalHeight = Math.max(minHeight, height);

    set({ wallHeight: finalHeight });
    canvasStore.setWallSize(get().wallWidth, finalHeight);
  },

  setWallWidth: (width) => {
    const canvasStore = UseCanvasStore.getState();
    const minWidth = 5; // Minimum 5m width
    const finalWidth = Math.max(minWidth, width);

    set({ wallWidth: finalWidth });
    canvasStore.setWallSize(finalWidth, get().wallHeight);
  },

  // Screen increment/decrement utilities
  incrementScreenHeight: () => {
    // Only allow manual adjustments in Custom mode
    if (get().resolution !== "Custom") return;

    const canvasStore = UseCanvasStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight <= 0) return;

    const state = get();
    const newHeight = Number((state.screenHeight + baseHeight).toFixed(3));
    state.setScreenHeight(newHeight);
  },

  decrementScreenHeight: () => {
    // Only allow manual adjustments in Custom mode
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
    // Only allow manual adjustments in Custom mode
    if (get().resolution !== "Custom") return;

    const canvasStore = UseCanvasStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth <= 0) return;

    const state = get();
    const newWidth = Number((state.screenWidth + baseWidth).toFixed(3));
    state.setScreenWidth(newWidth);
  },

  decrementScreenWidth: () => {
    // Only allow manual adjustments in Custom mode
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

  // New Cabinet increment/decrement methods
  incrementCabinetHeight: () => {
    // Only allow manual adjustments in Custom mode
    if (get().resolution !== "Custom") return;
    get().incrementScreenHeight();
  },

  decrementCabinetHeight: () => {
    // Only allow manual adjustments in Custom mode
    if (get().resolution !== "Custom") return;
    get().decrementScreenHeight();
  },

  incrementCabinetWidth: () => {
    // Only allow manual adjustments in Custom mode
    if (get().resolution !== "Custom") return;
    get().incrementScreenWidth();
  },

  decrementCabinetWidth: () => {
    // Only allow manual adjustments in Custom mode
    if (get().resolution !== "Custom") return;
    get().decrementScreenWidth();
  },

  // Wall increment/decrement utilities (by 1 unit) with minimum limits
  incrementWallHeight: () => {
    const state = get();
    const newHeight = Number((state.wallHeight + 1).toFixed(1));
    state.setWallHeight(newHeight);
  },

  decrementWallHeight: () => {
    const state = get();
    const minHeight = 3; // Minimum 3m height
    const newHeight = Math.max(
      minHeight,
      Number((state.wallHeight - 1).toFixed(1))
    );
    state.setWallHeight(newHeight);
  },

  incrementWallWidth: () => {
    const state = get();
    const newWidth = Number((state.wallWidth + 1).toFixed(1));
    state.setWallWidth(newWidth);
  },

  decrementWallWidth: () => {
    const state = get();
    const minWidth = 5; // Minimum 5m width
    const newWidth = Math.max(
      minWidth,
      Number((state.wallWidth - 1).toFixed(1))
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
    // Wall controls are enabled when model is configured
    return canvasStore.isConfigured();
  },

  // Check if screen controls should be interactive (only in Custom mode)
  isScreenControlsInteractive: () => {
    return get().resolution === "Custom" && get().isScreenControlsEnabled();
  },

  // Canvas integration methods
  syncScreenDimensions: (width, height) =>
    set({ screenWidth: width, screenHeight: height }),

  syncWithCanvas: () => {
    const canvasStore = UseCanvasStore.getState();

    // Initialize defaults first if needed
    get().initializeDefaults();

    set({
      screenWidth: canvasStore.screenWidth,
      screenHeight: canvasStore.screenHeight,
      wallWidth: canvasStore.wallWidth,
      wallHeight: canvasStore.wallHeight,
    });
  },

  // Screen boundary validation
  canIncrementScreenWidth: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured() || state.resolution !== "Custom")
      return false;

    return canvasStore.getActualScreenSize().width < state.wallWidth;
  },

  canDecrementScreenWidth: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured() || state.resolution !== "Custom")
      return false;

    return canvasStore.getActualScreenSize().width > canvasStore.baseWidth;
  },

  canIncrementScreenHeight: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured() || state.resolution !== "Custom")
      return false;

    return canvasStore.getActualScreenSize().height < state.wallHeight;
  },

  canDecrementScreenHeight: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured() || state.resolution !== "Custom")
      return false;

    return canvasStore.getActualScreenSize().height > canvasStore.baseHeight;
  },
}));
