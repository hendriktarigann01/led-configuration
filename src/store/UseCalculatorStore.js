import { create } from "zustand";

export const UseCalculatorStore = create((set, get) => ({
  // Parse size dari string menjadi dimensi dalam meter
  parseDimensions: (sizeString) => {
    if (!sizeString) return { width: 0, height: 0 };

    // Handle different formats
    if (sizeString.includes("(W)") && sizeString.includes("(H)")) {
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
        width: width / 1000,
        height: height / 1000,
      };
    }

    return { width: 0, height: 0 };
  },

  // Parse resolution from different formats
  parseResolution: (resolutionString) => {
    if (!resolutionString) return { width: 0, height: 0 };

    // Handle different formats:
    // "512 X 384 dots" (LED Cabinet/Outdoor)
    // "256 x 128 dots" (LED Module)
    // "FHD 1920 x 1080" (Video Wall)
    // "1920 x 1080" (Video Wall alternative)

    let cleanResolution = resolutionString.toLowerCase();

    // Extract numbers from string
    const numberMatch = cleanResolution.match(/(\d+)\s*[xÃƒÆ'Ã¢â‚¬"]\s*(\d+)/);

    if (numberMatch) {
      return {
        width: parseInt(numberMatch[1]),
        height: parseInt(numberMatch[2]),
      };
    }

    return { width: 0, height: 0 };
  },

  // Parse power consumption from different formats
  parsePowerConsumption: (powerString) => {
    if (!powerString) return { max: 0, average: 0 };

    // Handle format: "Max: 650W/m², Average: 300W/m²"
    const pattern = /Max:\s*(\d+)W\/m².*?Average[;:]?\s*(\d+)W\/m²/i;
    const match = powerString.match(pattern);

    if (match) {
      return {
        max: parseFloat(match[1]),
        average: parseFloat(match[2]),
      };
    }

    return { max: 0, average: 0 };
  },

  // Parse weight from string (remove kg/pcs and convert to number)
  parseWeight: (weightString) => {
    if (!weightString) return 0;

    const weightMatch = weightString.match(/(\d+(?:\.\d+)?)/);
    return weightMatch ? parseFloat(weightMatch[1]) : 0;
  },

  // Get resolution string based on display type
  getResolutionField: (modelData, displayType) => {
    if (!modelData) return null;

    // Indoor LED Fixed (Cabinet) and Outdoor
    if (modelData.cabinet_resolution) {
      return modelData.cabinet_resolution;
    }

    // Indoor LED Fixed (Module)
    if (modelData.module_resolution) {
      return modelData.module_resolution;
    }

    // Video Wall
    if (modelData.resolution) {
      return modelData.resolution;
    }

    return null;
  },

  // Get weight field based on display type
  getWeightField: (modelData, displayType) => {
    if (!modelData) return null;

    // Check for cabinet weight first (Cabinet and Outdoor)
    if (modelData.cabinet_weight) {
      return modelData.cabinet_weight;
    }

    // Then check for module weight (Module)
    if (modelData.module_weight) {
      return modelData.module_weight;
    }

    // Video Wall doesn't have weight data
    return null;
  },

  // Calculate units needed to achieve target resolution
  calculateUnitsForResolution: (modelData, displayType, targetResolution) => {
    const resolutionField = get().getResolutionField(modelData, displayType);
    if (!resolutionField) return { horizontal: 1, vertical: 1 };

    const modelResolution = get().parseResolution(resolutionField);
    if (modelResolution.width === 0 || modelResolution.height === 0) {
      return { horizontal: 1, vertical: 1 };
    }

    // Calculate how many units needed for target resolution
    const unitsNeededWidth = Math.ceil(
      targetResolution.width / modelResolution.width
    );
    const unitsNeededHeight = Math.ceil(
      targetResolution.height / modelResolution.height
    );

    return {
      horizontal: Math.max(1, unitsNeededWidth),
      vertical: Math.max(1, unitsNeededHeight),
    };
  },

  // Calculate screen size based on resolution mode
  calculateScreenSizeFromResolution: (
    modelData,
    displayType,
    resolutionMode,
    baseWidth,
    baseHeight
  ) => {
    if (!modelData || baseWidth === 0 || baseHeight === 0) {
      return { width: baseWidth, height: baseHeight };
    }

    let targetResolution = null;

    switch (resolutionMode) {
      case "FHD":
        targetResolution = { width: 1920, height: 1080 };
        break;
      case "UHD":
        targetResolution = { width: 3840, height: 2160 };
        break;
      case "Custom":
      default:
        // Keep current screen size for custom mode
        return { width: baseWidth, height: baseHeight };
    }

    // Get required units for target resolution
    const requiredUnits = get().calculateUnitsForResolution(
      modelData,
      displayType,
      targetResolution
    );

    // Calculate actual screen size
    const screenWidth = requiredUnits.horizontal * baseWidth;
    const screenHeight = requiredUnits.vertical * baseHeight;

    return { width: screenWidth, height: screenHeight };
  },

  // Get target resolution info for display
  getTargetResolutionInfo: (modelData, displayType, resolutionMode) => {
    if (resolutionMode === "Custom") return null;

    const targetResolution =
      resolutionMode === "FHD"
        ? { width: 1920, height: 1080 }
        : { width: 3840, height: 2160 };

    const requiredUnits = get().calculateUnitsForResolution(
      modelData,
      displayType,
      targetResolution
    );
    const modelResolutionField = get().getResolutionField(
      modelData,
      displayType
    );
    const modelResolution = get().parseResolution(modelResolutionField);

    // Calculate actual achieved resolution
    const actualResolution = {
      width: requiredUnits.horizontal * modelResolution.width,
      height: requiredUnits.vertical * modelResolution.height,
    };

    return {
      target: targetResolution,
      actual: actualResolution,
      units: requiredUnits,
      modelResolution: modelResolution,
    };
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

  calculateUnitCount: (screenWidth, screenHeight, baseWidth, baseHeight) => {
    if (baseWidth === 0 || baseHeight === 0) {
      return { horizontal: 1, vertical: 1 };
    }

    const horizontal = Math.max(1, Math.ceil(screenWidth / baseWidth));
    const vertical = Math.max(1, Math.ceil(screenHeight / baseHeight));

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

  // Calculate total resolution per cabinet/module
  calculateResolutionPerUnit: (modelData, displayType, totalUnits) => {
    const resolutionField = get().getResolutionField(modelData, displayType);
    if (!resolutionField || totalUnits === 0) {
      return { width: 0, height: 0 };
    }

    const unitResolution = get().parseResolution(resolutionField);

    return {
      width: unitResolution.width * totalUnits,
      height: unitResolution.height * totalUnits,
    };
  },

  // Calculate total weight
  calculateTotalWeight: (modelData, displayType, totalUnits) => {
    const weightField = get().getWeightField(modelData, displayType);
    if (!weightField || totalUnits === 0) {
      return 0;
    }

    const unitWeight = get().parseWeight(weightField);
    return unitWeight * totalUnits;
  },

  // Get comprehensive calculation results (without totalPower)
  getCalculationResults: (
    modelData,
    displayType,
    screenWidth,
    screenHeight,
    baseWidth,
    baseHeight
  ) => {
    if (!modelData || baseWidth === 0 || baseHeight === 0) {
      return null;
    }

    const unitCount = get().calculateUnitCount(
      screenWidth,
      screenHeight,
      baseWidth,
      baseHeight
    );
    const totalUnits = unitCount.horizontal * unitCount.vertical;

    const actualScreenSize = get().calculateActualScreenSize(
      screenWidth,
      screenHeight,
      baseWidth,
      baseHeight
    );
    const resolutionPerUnit = get().calculateResolutionPerUnit(
      modelData,
      displayType,
      totalUnits
    );
    const totalWeight = get().calculateTotalWeight(
      modelData,
      displayType,
      totalUnits
    );

    return {
      unitCount,
      totalUnits,
      actualScreenSize,
      resolutionPerUnit,
      totalWeight,
      baseDimensions: { width: baseWidth, height: baseHeight },
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