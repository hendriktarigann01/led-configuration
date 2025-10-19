import { create } from "zustand";
import {
  RESOLUTION_MODE,
  SCREEN_SIZE_MODE,
  UNIT_TYPE,
} from "../constants/Resolution";
import { DEFAULT_WALL, MIN_STEP } from "../constants/Validation";
import { UseCanvasStore } from "./UseCanvasStore";
import { UseNavbarStore } from "./UseNavbarStore";
import { UseCalculatorStore } from "./UseCalculatorStore";

export const UseHeaderStore = create((set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  // Display settings
  screenSize: SCREEN_SIZE_MODE.AREA,
  resolution: RESOLUTION_MODE.CUSTOM,
  screenHeight: 0,
  screenWidth: 0,

  // Wall settings
  unit: UNIT_TYPE.METER,
  wallHeight: DEFAULT_WALL.HEIGHT,
  wallWidth: DEFAULT_WALL.WIDTH,

  // ============================================================================
  // HELPERS - Internal utilities
  // ============================================================================

  /**
   * Get current model data from navbar store
   */
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

  /**
   * Calculate screen size based on resolution mode
   */
  calculateScreenSizeFromResolution: (resolutionMode) => {
    const canvasStore = UseCanvasStore.getState();
    const calculator = UseCalculatorStore.getState();
    const { baseWidth, baseHeight } = canvasStore;
    const { modelData } = get().getCurrentModelData();

    if (!baseWidth || !baseHeight || !modelData) {
      return { width: 0, height: 0 };
    }

    return calculator.calculateScreenSizeFromResolution(
      modelData,
      resolutionMode,
      baseWidth,
      baseHeight
    );
  },

  // ============================================================================
  // ACTIONS - State mutations
  // ============================================================================

  /**
   * Initialize default wall values in canvas store
   */
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

  /**
   * Set screen size mode
   */
  setScreenSize: (size) => set({ screenSize: size }),

  /**
   * Set resolution mode and update screen size accordingly
   */
  setResolution: (resolution) => {
    set({ resolution });

    if (resolution !== RESOLUTION_MODE.CUSTOM) {
      // FHD/UHD mode - calculate and set screen size
      const screenSize = get().calculateScreenSizeFromResolution(resolution);
      const canvasStore = UseCanvasStore.getState();

      set({
        screenWidth: screenSize.width,
        screenHeight: screenSize.height,
      });

      canvasStore.setScreenSize(screenSize.width, screenSize.height);

      // Auto-adjust wall size for FHD/UHD - rounded up
      const currentState = get();
      const requiredWallWidth = Math.ceil(screenSize.width);
      const requiredWallHeight = Math.ceil(screenSize.height);

      // Update wall size if smaller than screen
      const newWallWidth = Math.max(currentState.wallWidth, requiredWallWidth);
      const newWallHeight = Math.max(
        currentState.wallHeight,
        requiredWallHeight
      );

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
      // Custom mode - sync with canvas and ensure canvas is updated
      const canvasStore = UseCanvasStore.getState();
      const actualScreenSize = canvasStore.getActualScreenSize();

      set({
        screenWidth: actualScreenSize.width,
        screenHeight: actualScreenSize.height,
      });

      canvasStore.setScreenSize(
        actualScreenSize.width,
        actualScreenSize.height
      );
    }
  },

  /**
   * Set screen height with validation
   * FIXED: Improved precision handling
   */
  setScreenHeight: (height) => {
    const canvasStore = UseCanvasStore.getState();
    const { baseHeight } = canvasStore;
    const { wallHeight } = get();

    // Calculate max cabinets that fit in wall
    const maxCabinets = Math.floor(wallHeight / baseHeight);
    const maxHeight = maxCabinets * baseHeight;

    // Round to 3 decimal places to avoid floating point errors
    const validatedHeight = Number(Math.min(height, maxHeight).toFixed(3));

    set({ screenHeight: validatedHeight });
    canvasStore.setScreenSize(get().screenWidth, validatedHeight);
  },

  /**
   * Set screen width with validation
   */
  setScreenWidth: (width) => {
    const canvasStore = UseCanvasStore.getState();
    const { baseWidth } = canvasStore;
    const { wallWidth } = get();

    const maxCabinets = Math.floor(wallWidth / baseWidth);
    const maxWidth = maxCabinets * baseWidth;

    const validatedWidth = Number(Math.min(width, maxWidth).toFixed(3));

    set({ screenWidth: validatedWidth });
    canvasStore.setScreenSize(validatedWidth, get().screenHeight);
  },

  /**
   * Set wall width with validation
   */
  setWallWidth: (width) => {
    const canvasStore = UseCanvasStore.getState();
    const currentState = get();
    const actualScreenSize = canvasStore.getActualScreenSize();

    // Wall can be reduced to screen size exactly, minimum 1m
    const minWidth = Math.max(1, actualScreenSize.width);
    const finalWidth = Math.max(minWidth, width);

    set({ wallWidth: finalWidth });
    canvasStore.setWallSize(finalWidth, currentState.wallHeight);
  },

  /**
   * Set wall height with validation
   */
  setWallHeight: (height) => {
    const canvasStore = UseCanvasStore.getState();
    const currentState = get();
    const actualScreenSize = canvasStore.getActualScreenSize();
    // Minimum Wall 1m
    const minHeight = Math.max(1, actualScreenSize.height);
    const finalHeight = Math.max(minHeight, height);

    set({ wallHeight: finalHeight });
    canvasStore.setWallSize(currentState.wallWidth, finalHeight);
  },

  /**
   * Increment screen height by base unit
   */
  incrementScreenHeight: () => {
    if (get().resolution !== RESOLUTION_MODE.CUSTOM) return;

    const canvasStore = UseCanvasStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight <= 0) return;

    const state = get();
    // Round to 3 decimal places to prevent floating point errors
    const newHeight = Number((state.screenHeight + baseHeight).toFixed(3));
    state.setScreenHeight(newHeight);
  },

  /**
   * Decrement screen height by base unit
   */
  decrementScreenHeight: () => {
    if (get().resolution !== RESOLUTION_MODE.CUSTOM) return;

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

  /**
   * Increment screen width by base unit
   */
  incrementScreenWidth: () => {
    if (get().resolution !== RESOLUTION_MODE.CUSTOM) return;

    const canvasStore = UseCanvasStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth <= 0) return;

    const state = get();
    // Round to 3 decimal places to prevent floating point errors
    const newWidth = Number((state.screenWidth + baseWidth).toFixed(3));
    state.setScreenWidth(newWidth);
  },

  /**
   * Decrement screen width by base unit
   */
  decrementScreenWidth: () => {
    if (get().resolution !== RESOLUTION_MODE.CUSTOM) return;

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

  /**
   * Cabinet increment/decrement methods (aliases)
   */
  incrementCabinetHeight: () => get().incrementScreenHeight(),
  decrementCabinetHeight: () => get().decrementScreenHeight(),
  incrementCabinetWidth: () => get().incrementScreenWidth(),
  decrementCabinetWidth: () => get().decrementScreenWidth(),

  /**
   * Increment wall height by 0.5m
   */
  incrementWallHeight: () => {
    const state = get();
    // Round to nearest 0.5, then add 0.5
    const rounded = Math.round(state.wallHeight * 2) / 2;
    const newHeight = Number((rounded + MIN_STEP.WALL).toFixed(1));
    state.setWallHeight(newHeight);
  },

  /**
   * Decrement wall height by 0.5m
   */
  decrementWallHeight: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();
    const actualScreenSize = canvasStore.getActualScreenSize();

    const minHeight = Math.max(1, actualScreenSize.height);
    // Round to nearest 0.5, then subtract 0.5
    const rounded = Math.round(state.wallHeight * 2) / 2;
    const newHeight = Math.max(
      minHeight,
      Number((rounded - MIN_STEP.WALL).toFixed(1))
    );
    state.setWallHeight(newHeight);
  },

  /**
   * Increment wall width by 0.5m
   */
  incrementWallWidth: () => {
    const state = get();
    // Round to nearest 0.5, then add 0.5
    const rounded = Math.round(state.wallWidth * 2) / 2;
    const newWidth = Number((rounded + MIN_STEP.WALL).toFixed(1));
    state.setWallWidth(newWidth);
  },

  /**
   * Decrement wall width by 0.5m
   */
  decrementWallWidth: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();
    const actualScreenSize = canvasStore.getActualScreenSize();

    const minWidth = Math.max(1, actualScreenSize.width);
    // Round to nearest 0.5, then subtract 0.5
    const rounded = Math.round(state.wallWidth * 2) / 2;
    const newWidth = Math.max(
      minWidth,
      Number((rounded - MIN_STEP.WALL).toFixed(1))
    );
    state.setWallWidth(newWidth);
  },

  /**
   * Sync state with canvas store values
   */
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

  /**
   * Complete reset to defaults
   */
  resetToDefaults: () => {
    set({
      screenSize: SCREEN_SIZE_MODE.AREA,
      resolution: RESOLUTION_MODE.CUSTOM,
      screenHeight: 0,
      screenWidth: 0,
      unit: UNIT_TYPE.METER,
      wallHeight: DEFAULT_WALL.HEIGHT,
      wallWidth: DEFAULT_WALL.WIDTH,
    });
  },

  // ============================================================================
  // SELECTORS - Computed values
  // ============================================================================

  /**
   * Get resolution info for display purposes
   */
  getResolutionInfo: () => {
    const { resolution } = get();
    const { modelData } = get().getCurrentModelData();

    if (!modelData) return null;

    const calculator = UseCalculatorStore.getState();

    if (resolution === RESOLUTION_MODE.CUSTOM) {
      const currentState = get();
      const canvasStore = UseCanvasStore.getState();

      const unitCount = calculator.calculateUnitCount(
        currentState.screenWidth,
        currentState.screenHeight,
        canvasStore.baseWidth,
        canvasStore.baseHeight
      );

      const modelResolutionField = calculator.getResolutionField(modelData);
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

    return calculator.getTargetResolutionInfo(modelData, resolution);
  },

  /**
   * Check if screen controls are enabled
   */
  isScreenControlsEnabled: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.isConfigured();
  },

  /**
   * Check if wall controls are enabled
   */
  isWallControlsEnabled: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.isConfigured();
  },

  /**
   * Get cabinet count (alias for canvas store method)
   */
  getCabinetCount: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.getCabinetCount();
  },
}));
