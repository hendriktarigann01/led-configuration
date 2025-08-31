import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";

export const UseHeaderStore = create((set, get) => ({
  // Display settings
  screenSize: "Area",
  resolution: "FHD",
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

  // Screen dimension actions
  setScreenSize: (size) => set({ screenSize: size }),
  setResolution: (resolution) => set({ resolution }),

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
    const canvasStore = UseCanvasStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight <= 0) return;

    const state = get();
    const newHeight = Number((state.screenHeight + baseHeight).toFixed(3));
    state.setScreenHeight(newHeight);
  },

  decrementScreenHeight: () => {
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
    const canvasStore = UseCanvasStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth <= 0) return;

    const state = get();
    const newWidth = Number((state.screenWidth + baseWidth).toFixed(3));
    state.setScreenWidth(newWidth);
  },

  decrementScreenWidth: () => {
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

    if (!canvasStore.isConfigured()) return false;

    return canvasStore.getActualScreenSize().width < state.wallWidth;
  },

  canDecrementScreenWidth: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured()) return false;

    return canvasStore.getActualScreenSize().width > canvasStore.baseWidth;
  },

  canIncrementScreenHeight: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured()) return false;

    return canvasStore.getActualScreenSize().height < state.wallHeight;
  },

  canDecrementScreenHeight: () => {
    const state = get();
    const canvasStore = UseCanvasStore.getState();

    if (!canvasStore.isConfigured()) return false;

    return canvasStore.getActualScreenSize().height > canvasStore.baseHeight;
  },
}));
