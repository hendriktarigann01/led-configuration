import { create } from "zustand";
import { BASE_WALL_DISPLAY } from "../constants/Validation";
import {
  parseDimensions,
  parseWeight,
  getBaseDimensions,
  getWeightField,
} from "../utils/DimensionParser";
import {
  parseResolution,
  getResolutionField,
  calculateUnitsForResolution,
  calculateScreenSizeFromResolution,
  getTargetResolutionInfo,
  calculateResolutionPerUnit,
} from "../utils/ResolutionCalculator";
import {
  parsePowerConsumption,
  calculatePowerConsumption,
} from "../utils/PowerCalculator";

export const UseCalculatorStore = create((set, get) => ({
  // ============================================================================
  // SELECTORS - Read-only computed values
  // ============================================================================

  /**
   * Calculate number of units needed to fill screen dimensions
   */
  calculateUnitCount: (screenWidth, screenHeight, baseWidth, baseHeight) => {
    if (baseWidth === 0 || baseHeight === 0) {
      return { horizontal: 1, vertical: 1 };
    }

    const horizontal = Math.max(1, Math.ceil(screenWidth / baseWidth));
    const vertical = Math.max(1, Math.ceil(screenHeight / baseHeight));

    return { horizontal, vertical };
  },

  /**
   * Calculate actual screen size based on unit count
   */
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

  /**
   * Calculate total weight of all units
   */
  calculateTotalWeight: (modelData, totalUnits) => {
    const weightField = getWeightField(modelData);
    if (!weightField || totalUnits === 0) {
      return 0;
    }

    const unitWeight = parseWeight(weightField);
    return unitWeight * totalUnits;
  },

  /**
   * Get comprehensive calculation results
   */
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
    const resolutionPerUnit = calculateResolutionPerUnit(modelData, totalUnits);
    const totalWeight = get().calculateTotalWeight(modelData, totalUnits);

    return {
      unitCount,
      totalUnits,
      actualScreenSize,
      resolutionPerUnit,
      totalWeight,
      baseDimensions: { width: baseWidth, height: baseHeight },
    };
  },

  /**
   * Calculate image scale for canvas display
   */
  calculateImageScale: (wallWidth, wallHeight) => {
    const widthScale = BASE_WALL_DISPLAY.WIDTH / wallWidth;
    const heightScale = BASE_WALL_DISPLAY.HEIGHT / wallHeight;

    // Use the smaller scale to maintain aspect ratio
    return Math.min(widthScale, heightScale);
  },

  /**
   * Calculate increment/decrement step for screen controls
   */
  getScreenStep: (baseWidth, baseHeight) => {
    return { width: baseWidth, height: baseHeight };
  },

  /**
   * Calculate increment/decrement step for wall controls (always 0.5 meter)
   */
  getWallStep: () => {
    return { width: 0.5, height: 0.5 };
  },

  /**
   * Validate minimum screen size (at least one unit)
   */
  validateScreenSize: (width, height, baseWidth, baseHeight) => {
    return {
      width: Math.max(baseWidth || 0, width),
      height: Math.max(baseHeight || 0, height),
    };
  },

  /**
   * Validate minimum wall size
   */
  validateWallSize: (width, height) => {
    return {
      width: Math.max(1, width), // minimum 1 meter
      height: Math.max(1, height), // minimum 1 meter
    };
  },

  // ============================================================================
  // EXPORTED UTILITIES - Re-export from utils for convenience
  // ============================================================================
  parseDimensions,
  parseResolution,
  parsePowerConsumption,
  parseWeight,
  getResolutionField,
  getWeightField,
  getBaseDimensions,
  calculateUnitsForResolution,
  calculateScreenSizeFromResolution,
  getTargetResolutionInfo,
  calculateResolutionPerUnit,
  calculatePowerConsumption,
}));
