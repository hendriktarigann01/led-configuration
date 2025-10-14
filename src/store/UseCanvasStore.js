import { create } from "zustand";
import { DEFAULT_CANVAS, DEFAULT_WALL } from "../constants/Validation";
import { UseCalculatorStore } from "./UseCalculatorStore";

export const UseCanvasStore = create((set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  canvasWidth: DEFAULT_CANVAS.WIDTH,
  canvasHeight: DEFAULT_CANVAS.HEIGHT,

  // LED Screen dimensions (meters)
  screenWidth: 0,
  screenHeight: 0,

  // Wall dimensions (meters)
  wallWidth: DEFAULT_WALL.WIDTH,
  wallHeight: DEFAULT_WALL.HEIGHT,

  // Base unit size derived from selected model (meters)
  baseWidth: 0,
  baseHeight: 0,

  // Screen position (offset in pixels from center)
  screenPosition: { x: 0, y: 0 },

  // Move mode state
  isMoveMode: false,

  // ============================================================================
  // ACTIONS - State mutations
  // ============================================================================

  /**
   * Set screen size with validation
   */
  setScreenSize: (width, height) => {
    const { baseWidth, baseHeight } = get();
    const calculator = UseCalculatorStore.getState();
    const validated = calculator.validateScreenSize(
      width,
      height,
      baseWidth,
      baseHeight
    );

    set({
      screenWidth: validated.width,
      screenHeight: validated.height,
    });
  },

  /**
   * Set wall size with validation
   */
  setWallSize: (width, height) => {
    const calculator = UseCalculatorStore.getState();
    const validated = calculator.validateWallSize(width, height);
    const { screenWidth, screenHeight } = get();

    // Get actual screen size to compare with wall
    const actualScreenSize = get().getActualScreenSize();

    // Ensure minimum wall size is 1m x 1m
    let finalWidth = Math.max(1, validated.width);
    let finalHeight = Math.max(1, validated.height);

    // Wall must be larger than or equal to screen size (exact match allowed)
    if (screenWidth > 0 && screenHeight > 0) {
      finalWidth = Math.max(finalWidth, actualScreenSize.width);
      finalHeight = Math.max(finalHeight, actualScreenSize.height);
    }

    set({
      wallWidth: finalWidth,
      wallHeight: finalHeight,
    });
  },

  /**
   * Set base cabinet/module size from selected model
   */
  setBaseSize: (width, height) => {
    set({
      baseWidth: width,
      baseHeight: height,
    });
  },

  /**
   * Update model data and maintain cabinet count or initialize first config
   */
  updateModelData: (modelData) => {
    const calculator = UseCalculatorStore.getState();
    const newDimensions = calculator.getBaseDimensions(modelData);

    const currentState = get();

    // Check if this is first configuration (no previous model)
    const isFirstConfiguration =
      currentState.baseWidth === 0 || currentState.baseHeight === 0;

    if (isFirstConfiguration) {
      // First time configuration - use single unit
      const newScreenWidth = newDimensions.width;
      const newScreenHeight = newDimensions.height;

      // Ensure wall is larger than screen (minimum buffer for practical installation)
      const minWallWidth = Math.max(DEFAULT_WALL.WIDTH, newScreenWidth + 0.5);
      const minWallHeight = Math.max(
        DEFAULT_WALL.HEIGHT,
        newScreenHeight + 0.5
      );

      set({
        baseWidth: newDimensions.width,
        baseHeight: newDimensions.height,
        screenWidth: newScreenWidth,
        screenHeight: newScreenHeight,
        wallWidth: Math.max(currentState.wallWidth, minWallWidth),
        wallHeight: Math.max(currentState.wallHeight, minWallHeight),
      });
    } else {
      // Model change - maintain current cabinet count
      const currentCabinetCount = get().getCabinetCount();

      // Calculate new screen size to maintain the same cabinet count
      const newScreenWidth =
        currentCabinetCount.horizontal * newDimensions.width;
      const newScreenHeight =
        currentCabinetCount.vertical * newDimensions.height;

      set({
        baseWidth: newDimensions.width,
        baseHeight: newDimensions.height,
        screenWidth: newScreenWidth,
        screenHeight: newScreenHeight,
        // Keep existing wall dimensions - don't auto-resize
        wallWidth: currentState.wallWidth,
        wallHeight: currentState.wallHeight,
      });
    }
  },

  /**
   * Toggle move mode on/off
   */
  toggleMoveMode: () => {
    set((state) => ({
      isMoveMode: !state.isMoveMode,
    }));
  },

  /**
   * Set move mode state
   */
  setMoveMode: (enabled) => {
    set({ isMoveMode: enabled });
  },

  /**
   * Update screen position
   */
  setScreenPosition: (x, y) => {
    set({
      screenPosition: { x, y },
    });
  },

  /**
   * Reset screen position to center
   */
  resetScreenPosition: () => {
    set({
      screenPosition: { x: 0, y: 0 },
    });
  },

  /**
   * Complete reset - clears ALL state including model data
   */
  reset: () => {
    set({
      canvasWidth: DEFAULT_CANVAS.WIDTH,
      canvasHeight: DEFAULT_CANVAS.HEIGHT,
      screenWidth: 0,
      screenHeight: 0,
      wallWidth: DEFAULT_WALL.WIDTH,
      wallHeight: DEFAULT_WALL.HEIGHT,
      baseWidth: 0,
      baseHeight: 0,
      screenPosition: { x: 0, y: 0 },
      isMoveMode: false,
    });
  },

  // ============================================================================
  // SELECTORS - Computed values
  // ============================================================================

  /**
   * Calculate number of cabinets needed
   */
  getCabinetCount: () => {
    const { screenWidth, screenHeight, baseWidth, baseHeight } = get();
    const calculator = UseCalculatorStore.getState();
    return calculator.calculateUnitCount(
      screenWidth,
      screenHeight,
      baseWidth,
      baseHeight
    );
  },

  /**
   * Calculate actual screen size based on cabinet count
   */
  getActualScreenSize: () => {
    const { screenWidth, screenHeight, baseWidth, baseHeight } = get();
    const calculator = UseCalculatorStore.getState();
    return calculator.calculateActualScreenSize(
      screenWidth,
      screenHeight,
      baseWidth,
      baseHeight
    );
  },

  /**
   * Check if configuration is ready (has selected model)
   */
  isConfigured: () => {
    const { baseWidth, baseHeight } = get();
    return baseWidth > 0 && baseHeight > 0;
  },
}));