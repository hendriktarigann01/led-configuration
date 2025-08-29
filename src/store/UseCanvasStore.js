import { create } from "zustand";
import { UseCalculatorStore } from "./UseCalculatorStore";

export const UseCanvasStore = create((set, get) => ({
  // Basic canvas properties
  canvasWidth: 800,
  canvasHeight: 600,

  // LED Screen basic properties
  screenWidth: 0, // meters - start at 0
  screenHeight: 0, // meters - start at 0

  wallWidth: 0,
  wallHeight: 0,

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

    set({
      wallWidth: validated.width,
      wallHeight: validated.height,
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

  // Reset to defaults
  reset: () =>
    set({
      screenWidth: 0,
      screenHeight: 0,
      wallWidth: 5,
      wallHeight: 3,
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
    });
  },

  // Check if configuration is ready (has selected model)
  isConfigured: () => {
    const { baseWidth, baseHeight } = get();
    return baseWidth > 0 && baseHeight > 0;
  },
}));
