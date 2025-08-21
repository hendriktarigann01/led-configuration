import { create } from "zustand";

export const UseCanvasStore = create((set, get) => ({
  // Basic canvas properties
  canvasWidth: 800,
  canvasHeight: 600,

  // LED Screen basic properties
  screenWidth: 2.56, // meters
  screenHeight: 1.92, // meters

  // Wall basic properties
  wallWidth: 5, // meters
  wallHeight: 3, // meters

  // Actions
  setScreenSize: (width, height) =>
    set({
      screenWidth: width,
      screenHeight: height,
    }),

  setWallSize: (width, height) =>
    set({
      wallWidth: width,
      wallHeight: height,
    }),

  // Reset to defaults
  reset: () =>
    set({
      screenWidth: 2.56,
      screenHeight: 1.92,
      wallWidth: 5,
      wallHeight: 3,
    }),
}));
