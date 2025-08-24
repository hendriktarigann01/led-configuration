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

  // Cabinet/Module base size (derived from selected model)
  baseWidth: 0.64, // meters (default from 640mm)
  baseHeight: 0.48, // meters (default from 480mm)

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

  // Set base cabinet/module size from selected model
  setBaseSize: (width, height) =>
    set({
      baseWidth: width,
      baseHeight: height,
    }),

  // Calculate number of cabinets needed
  getCabinetCount: () => {
    const { screenWidth, screenHeight, baseWidth, baseHeight } = get();
    const horizontalCabinets = Math.ceil(screenWidth / baseWidth);
    const verticalCabinets = Math.ceil(screenHeight / baseHeight);
    return { horizontal: horizontalCabinets, vertical: verticalCabinets };
  },

  // Calculate actual screen size based on cabinet count
  getActualScreenSize: () => {
    const { baseWidth, baseHeight } = get();
    const { horizontal, vertical } = get().getCabinetCount();
    return {
      width: horizontal * baseWidth,
      height: vertical * baseHeight,
    };
  },

  // Get image scale based on wall size
  getImageScale: () => {
    const { wallWidth, wallHeight } = get();
    const { width: actualWidth, height: actualHeight } =
      get().getActualScreenSize();

    // Scale factor based on wall dimensions
    // The larger the wall, the smaller the screen appears relatively
    const baseWallWidth = 5; // base wall width in meters
    const baseWallHeight = 3; // base wall height in meters

    const widthScale = baseWallWidth / wallWidth;
    const heightScale = baseWallHeight / wallHeight;

    // Use the smaller scale to maintain aspect ratio
    return Math.min(widthScale, heightScale);
  },

  // Reset to defaults
  reset: () =>
    set({
      screenWidth: 2.56,
      screenHeight: 1.92,
      wallWidth: 5,
      wallHeight: 3,
      baseWidth: 0.64,
      baseHeight: 0.48,
    }),

  // Update model data and recalculate base size
  updateModelData: (modelData, displayType) => {
    let width = 0.64; // default
    let height = 0.48; // default

    if (modelData.cabinet_size) {
      // Parse cabinet_size like "640*480mm"
      const sizes = modelData.cabinet_size.replace("mm", "").split("*");
      width = parseInt(sizes[0]) / 1000; // convert mm to m
      height = parseInt(sizes[1]) / 1000;
    } else if (modelData.module_size) {
      // Parse module_size like "320*160mm"
      const sizes = modelData.module_size.replace("mm", "").split("*");
      width = parseInt(sizes[0]) / 1000;
      height = parseInt(sizes[1]) / 1000;
    } else if (modelData.unit_size_mm) {
      // Parse unit_size_mm like "1018*573*99mm" (ignore depth)
      const sizes = modelData.unit_size_mm.replace("mm", "").split("*");
      width = parseInt(sizes[0]) / 1000;
      height = parseInt(sizes[1]) / 1000;
    }

    set({
      baseWidth: width,
      baseHeight: height,
    });
  },
}));
