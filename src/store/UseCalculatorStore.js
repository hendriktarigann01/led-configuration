import { create } from "zustand";

export const UseCalculatorStore = create((set, get) => ({
  // Parse size dari string menjaFdi dimensi dalam meter
  parseDimensions: (sizeString) => {
    if (!sizeString) return { width: 0, height: 0 };

    // Handle different formats
    if (sizeString.includes("(W)") && sizeString.includes("(H)")) {
      // Format: "1,075 (W) x 606 (H) x 54 (D)"
      const parts = sizeString.split(" x ");
      const width = parseFloat(
        parts[0].replace("(W)", "").replace(",", "").trim()
      );
      const height = parseFloat(parts[1].replace("(H)", "").trim());
      return {
        width: width / 1000, // convert mm to m
        height: height / 1000,
      };
    } else if (sizeString.includes("*") || sizeString.includes("x")) {
      // Format: "640*480mm" or "960*960 mm"
      const cleanSize = sizeString.replace(/mm|m/g, "").trim();
      const separator = cleanSize.includes("*") ? "*" : "x";
      const parts = cleanSize.split(separator);
      const width = parseFloat(parts[0].replace(",", "").trim());
      const height = parseFloat(parts[1].replace(",", "").trim());
      return {
        width: width / 1000, // convert mm to m
        height: height / 1000,
      };
    }

    return { width: 0, height: 0 };
  },

  // Get base dimensions dari model data
  getBaseDimensions: (modelData, displayType) => {
    if (!modelData) return { width: 0, height: 0 };

    // Indoor LED Fixed (Cabinet)
    if (modelData.cabinet_size) {
      return get().parseDimensions(modelData.cabinet_size);
    }

    // Indoor LED Fixed (Module)
    if (modelData.module_size) {
      return get().parseDimensions(modelData.module_size);
    }

    // Video Wall
    if (modelData.unit_size_mm) {
      return get().parseDimensions(modelData.unit_size_mm);
    }

    return { width: 0, height: 0 };
  },

  // Calculate cabinet/module count
  calculateUnitCount: (screenWidth, screenHeight, baseWidth, baseHeight) => {
    if (baseWidth === 0 || baseHeight === 0)
      return { horizontal: 0, vertical: 0 };

    const horizontal = Math.ceil(screenWidth / baseWidth);
    const vertical = Math.ceil(screenHeight / baseHeight);
    return { horizontal, vertical };
  },

  // Calculate actual screen size based on unit count
  calculateActualScreenSize: (
    screenWidth,
    screenHeight,
    baseWidth,
    baseHeight
  ) => {
    const unitCount = get().calculateUnitCount(
      screenWidth,
      screenHeight,
      baseWidth,
      baseHeight
    );
    return {
      width: unitCount.horizontal * baseWidth,
      height: unitCount.vertical * baseHeight,
    };
  },

  // Calculate increment/decrement step for screen controls
  getScreenStep: (baseWidth, baseHeight) => {
    return { width: baseWidth, height: baseHeight };
  },

  // Calculate increment/decrement step for wall controls (always 1 meter)
  getWallStep: () => {
    return { width: 1, height: 1 };
  },

  // Validate minimum screen size (at least one unit)
  validateScreenSize: (width, height, baseWidth, baseHeight) => {
    return {
      width: Math.max(baseWidth || 0, width),
      height: Math.max(baseHeight || 0, height),
    };
  },

  // Validate minimum wall size
  validateWallSize: (width, height) => {
    return {
      width: Math.max(1, width), // minimum 1 meter
      height: Math.max(1, height), // minimum 1 meter
    };
  },

  // Calculate image scale for canvas display
  calculateImageScale: (wallWidth, wallHeight, screenWidth, screenHeight) => {
    const baseWallWidth = 5; // base wall width in meters
    const baseWallHeight = 3; // base wall height in meters

    const widthScale = baseWallWidth / wallWidth;
    const heightScale = baseWallHeight / wallHeight;

    // Use the smaller scale to maintain aspect ratio
    return Math.min(widthScale, heightScale);
  },
}));
