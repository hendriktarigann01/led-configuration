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

    // Ensure minimum wall size is 5m x 3m
    const finalWidth = Math.max(5, validated.width);
    const finalHeight = Math.max(3, validated.height);

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

  // Get image scale based on wall size
  getImageScale: () => {
    const { wallWidth, wallHeight, screenWidth, screenHeight } = get();
    const calculator = UseCalculatorStore.getState();
    return calculator.calculateImageScale(
      wallWidth,
      wallHeight,
      screenWidth,
      screenHeight
    );
  },

  // Reset to defaults (keep default wall size)
  reset: () =>
    set({
      screenWidth: 0,
      screenHeight: 0,
      wallWidth: 5, // Keep default 5m width
      wallHeight: 3, // Keep default 3m height
      baseWidth: 0,
      baseHeight: 0,
    }),

  // Update model data and recalculate base size
  updateModelData: (modelData, displayType) => {
    const calculator = UseCalculatorStore.getState();
    const dimensions = calculator.getBaseDimensions(modelData, displayType);

    set({
      baseWidth: dimensions.width,
      baseHeight: dimensions.height,
      // Initialize screen size to one unit
      screenWidth: dimensions.width,
      screenHeight: dimensions.height,
      // Ensure wall defaults are maintained (wall controls should be enabled after model selection)
      wallWidth: Math.max(5, get().wallWidth), // Keep existing or set to 5m minimum
      wallHeight: Math.max(3, get().wallHeight), // Keep existing or set to 3m minimum
    });
  },

  // Check if configuration is ready (has selected model)
  isConfigured: () => {
    const { baseWidth, baseHeight } = get();
    return baseWidth > 0 && baseHeight > 0;
  },
}));
