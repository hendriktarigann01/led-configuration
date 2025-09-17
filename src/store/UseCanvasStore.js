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

    // Ensure minimum wall size is 1m x 1m
    const finalWidth = Math.max(1, validated.width);
    const finalHeight = Math.max(1, validated.height);

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
      set({
        baseWidth: newDimensions.width,
        baseHeight: newDimensions.height,
        screenWidth: newDimensions.width,
        screenHeight: newDimensions.height,
        // Ensure wall defaults are maintained
        wallWidth: Math.max(5, currentState.wallWidth),
        wallHeight: Math.max(3, currentState.wallHeight),
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
        // Keep existing wall dimensions
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
