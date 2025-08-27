import { create } from "zustand";
import { UseCalculatorStore } from "./UseCalculatorStore";
import { UseCanvasStore } from "./UseCanvasStore";

export const UseHeaderStore = create((set, get) => ({
  // Display settings
  screenSize: "Area",
  resolution: "FHD",
  screenHeight: 0,
  screenWidth: 0,

  // Wall settings
  unit: "Meter",
  wallHeight: 3,
  wallWidth: 5,

  // Actions for Display
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

  // Actions for Wall
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

  // Utility actions for Screen
  incrementScreenHeight: () => {
    const canvasStore = UseCanvasStore.getState();
    const calculator = UseCalculatorStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight > 0) {
      const newHeight = Number((get().screenHeight + baseHeight).toFixed(3));
      get().setScreenHeight(newHeight);
    }
  },

  decrementScreenHeight: () => {
    const canvasStore = UseCanvasStore.getState();
    const calculator = UseCalculatorStore.getState();
    const { baseHeight } = canvasStore;

    if (baseHeight > 0) {
      const newHeight = Math.max(
        baseHeight,
        Number((get().screenHeight - baseHeight).toFixed(3))
      );
      get().setScreenHeight(newHeight);
    }
  },

  incrementScreenWidth: () => {
    const canvasStore = UseCanvasStore.getState();
    const calculator = UseCalculatorStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth > 0) {
      const newWidth = Number((get().screenWidth + baseWidth).toFixed(3));
      get().setScreenWidth(newWidth);
    }
  },

  decrementScreenWidth: () => {
    const canvasStore = UseCanvasStore.getState();
    const calculator = UseCalculatorStore.getState();
    const { baseWidth } = canvasStore;

    if (baseWidth > 0) {
      const newWidth = Math.max(
        baseWidth,
        Number((get().screenWidth - baseWidth).toFixed(3))
      );
      get().setScreenWidth(newWidth);
    }
  },

  // Utility actions for Wall (always increment/decrement by 1)
  incrementWallHeight: () => {
    const newHeight = Number((get().wallHeight + 1).toFixed(1));
    get().setWallHeight(newHeight);
  },

  decrementWallHeight: () => {
    const newHeight = Math.max(1, Number((get().wallHeight - 1).toFixed(1)));
    get().setWallHeight(newHeight);
  },

  incrementWallWidth: () => {
    const newWidth = Number((get().wallWidth + 1).toFixed(1));
    get().setWallWidth(newWidth);
  },

  decrementWallWidth: () => {
    const newWidth = Math.max(1, Number((get().wallWidth - 1).toFixed(1)));
    get().setWallWidth(newWidth);
  },

  // Check if controls should be enabled (has configuration)
  isScreenControlsEnabled: () => {
    const canvasStore = UseCanvasStore.getState();
    return canvasStore.isConfigured();
  },

  isWallControlsEnabled: () => {
    // Wall controls should always be enabled for now
    return true;
  },

  // Sync methods for canvas controls
  syncScreenDimensions: (width, height) =>
    set({
      screenWidth: width,
      screenHeight: height,
    }),

  // Sync with canvas store on model change
  syncWithCanvas: () => {
    const canvasStore = UseCanvasStore.getState();
    set({
      screenWidth: canvasStore.screenWidth,
      screenHeight: canvasStore.screenHeight,
      wallWidth: canvasStore.wallWidth,
      wallHeight: canvasStore.wallHeight,
    });
  },
}));
