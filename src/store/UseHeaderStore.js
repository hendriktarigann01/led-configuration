import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";

export const UseHeaderStore = create((set, get) => ({
  // Display settings
  screenSize: "Area",
  resolution: "FHD",
  screenHeight: 0,
  screenWidth: 0,

  // Wall settings
  unit: "Meter",
  wallHeight: 0,
  wallWidth: 0,

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

  // Wall dimension actions
  setWallHeight: (height) => {
    const canvasStore = UseCanvasStore.getState();
    set({ wallHeight: height });
    canvasStore.setWallSize(get().wallWidth, height);
  },

  setWallWidth: (width) => {
    const canvasStore = UseCanvasStore.getState();
    set({ wallWidth: width });
    canvasStore.setWallSize(width, get().wallHeight);
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

  // Wall increment/decrement utilities (by 1 unit)
  incrementWallHeight: () => {
    const state = get();
    const newHeight = Number((state.wallHeight + 1).toFixed(1));
    state.setWallHeight(newHeight);
  },

  decrementWallHeight: () => {
    const state = get();
    const newHeight = Math.max(1, Number((state.wallHeight - 1).toFixed(1)));
    state.setWallHeight(newHeight);
  },

  incrementWallWidth: () => {
    const state = get();
    const newWidth = Number((state.wallWidth + 1).toFixed(1));
    state.setWallWidth(newWidth);
  },

  decrementWallWidth: () => {
    const state = get();
    const newWidth = Math.max(1, Number((state.wallWidth - 1).toFixed(1)));
    state.setWallWidth(newWidth);
  },

  // Validation methods
  isScreenControlsEnabled: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.isConfigured();
  },

  isWallControlsEnabled: () => {
    const state = get();
    return state.wallHeight > 0 && state.wallWidth > 0;
  },

  // Canvas integration methods
  syncScreenDimensions: (width, height) =>
    set({ screenWidth: width, screenHeight: height }),

  syncWithCanvas: () => {
    const canvasStore = UseCanvasStore.getState();
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
