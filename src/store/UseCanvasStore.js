import { create } from "zustand";
import { UseCalculatorStore } from "./UseCalculatorStore";

export const UseCanvasStore = create((set, get) => ({
  // Basic canvas properties
  canvasWidth: 800,
  canvasHeight: 600,

  // LED Screen basic properties
  screenWidth: 0, // meters
  screenHeight: 0, // meters

  // Default wall size (5m width, 3m height)
  wallWidth: 5,
  wallHeight: 3,

  // Cabinet/Module base size (derived from selected model)
  baseWidth: 0, // meters - no default, must be set from config
  baseHeight: 0, // meters - no default, must be set from config

  // Actions
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

  // Set base cabinet/module size from selected model
  setBaseSize: (width, height) =>
    set({
      baseWidth: width,
      baseHeight: height,
    }),

  // Calculate number of cabinets needed
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

  // Calculate actual screen size based on cabinet count
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

  // Complete reset - clears ALL state including model data
  reset: () => {
    set({
      canvasWidth: 800,
      canvasHeight: 600,
      screenWidth: 0,
      screenHeight: 0,
      wallWidth: 5, // Reset to default 5m width
      wallHeight: 3, // Reset to default 3m height
      baseWidth: 0,
      baseHeight: 0,
    });
  },

  // Update model data and maintain cabinet count (MODIFIED)
  updateModelData: (modelData, displayType) => {
    const calculator = UseCalculatorStore.getState();
    const newDimensions = calculator.getBaseDimensions(modelData, displayType);

    const currentState = get();

    // Check if this is first configuration (no previous model)
    const isFirstConfiguration =
      currentState.baseWidth === 0 || currentState.baseHeight === 0;

    if (isFirstConfiguration) {
      // First time configuration - use single unit
      const newScreenWidth = newDimensions.width;
      const newScreenHeight = newDimensions.height;

      // Ensure wall is larger than screen (minimum buffer for practical installation)
      const minWallWidth = Math.max(5, newScreenWidth + 0.5);
      const minWallHeight = Math.max(3, newScreenHeight + 0.5);

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

  // Check if configuration is ready (has selected model)
  isConfigured: () => {
    const { baseWidth, baseHeight } = get();
    return baseWidth > 0 && baseHeight > 0;
  },
}));
