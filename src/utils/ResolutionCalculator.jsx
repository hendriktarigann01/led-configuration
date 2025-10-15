import { STANDARD_RESOLUTION } from "../constants/Resolution";

/**
 * Parse resolution from different formats
 * @param {string} resolutionString - Resolution string
 * @returns {{width: number, height: number}}
 */
export const parseResolution = (resolutionString) => {
  if (!resolutionString) return { width: 0, height: 0 };

  // Handle formats: "512 X 384 dots", "256 x 128 dots", "FHD 1920 x 1080", "1920 x 1080"
  const cleanResolution = resolutionString.toLowerCase();

  // Extract numbers from string
  const numberMatch = cleanResolution.match(
    /(\d+)\s*[xÃƒÆ'Ã†'ÃƒÂ¢Ã¢â€šÂ¬"]\s*(\d+)/
  );

  if (numberMatch) {
    return {
      width: parseInt(numberMatch[1]),
      height: parseInt(numberMatch[2]),
    };
  }

  return { width: 0, height: 0 };
};

/**
 * Get resolution field based on display type
 * @param {Object} modelData - Model data object
 * @returns {string|null}
 */
export const getResolutionField = (modelData) => {
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
};

/**
 * Calculate units needed to achieve target resolution
 * @param {Object} modelData - Model data object
 * @param {{width: number, height: number}} targetResolution - Target resolution
 * @returns {{horizontal: number, vertical: number}}
 */
export const calculateUnitsForResolution = (modelData, targetResolution) => {
  const resolutionField = getResolutionField(modelData);
  if (!resolutionField) return { horizontal: 1, vertical: 1 };

  const modelResolution = parseResolution(resolutionField);
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
};

/**
 * Calculate screen size based on resolution mode
 * @param {Object} modelData - Model data object
 * @param {string} resolutionMode - Resolution mode (FHD, UHD, Custom)
 * @param {number} baseWidth - Base unit width
 * @param {number} baseHeight - Base unit height
 * @returns {{width: number, height: number}}
 */
export const calculateScreenSizeFromResolution = (
  modelData,
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
      targetResolution = STANDARD_RESOLUTION.FHD;
      break;
    case "UHD":
      targetResolution = STANDARD_RESOLUTION.UHD;
      break;
    case "Custom":
    default:
      // Keep current screen size for custom mode
      return { width: baseWidth, height: baseHeight };
  }

  // Get required units for target resolution
  const requiredUnits = calculateUnitsForResolution(
    modelData,
    targetResolution
  );

  // Calculate actual screen size
  const screenWidth = requiredUnits.horizontal * baseWidth;
  const screenHeight = requiredUnits.vertical * baseHeight;

  return { width: screenWidth, height: screenHeight };
};

/**
 * Get target resolution info for display
 * @param {Object} modelData - Model data object
 * @param {string} resolutionMode - Resolution mode
 * @returns {Object|null}
 */
export const getTargetResolutionInfo = (modelData, resolutionMode) => {
  if (resolutionMode === "Custom") return null;

  const targetResolution =
    resolutionMode === "FHD"
      ? STANDARD_RESOLUTION.FHD
      : STANDARD_RESOLUTION.UHD;

  const requiredUnits = calculateUnitsForResolution(
    modelData,
    targetResolution
  );
  const modelResolutionField = getResolutionField(modelData);
  const modelResolution = parseResolution(modelResolutionField);

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
};

/**
 * Calculate total resolution per unit
 * @param {Object} modelData - Model data object
 * @param {number} totalUnits - Total units
 * @returns {{width: number, height: number}}
 */
export const calculateResolutionPerUnit = (modelData, totalUnits) => {
  const resolutionField = getResolutionField(modelData);
  if (!resolutionField || totalUnits === 0) {
    return { width: 0, height: 0 };
  }

  const unitResolution = parseResolution(resolutionField);

  return {
    width: unitResolution.width * totalUnits,
    height: unitResolution.height * totalUnits,
  };
};

/**
 * Calculate GCD (Greatest Common Divisor) using Euclidean algorithm
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} GCD of a and b
 */
const gcd = (a, b) => {
  return b === 0 ? a : gcd(b, a % b);
};

/**
 * Calculate aspect ratio from resolution
 * @param {{width: number, height: number}} resolution - Resolution object
 * @returns {string} Aspect ratio in "W:H" format (e.g., "16:9", "4:3")
 */
export const CalculateAspectRatio = (resolution) => {
  if (!resolution || resolution.width === 0 || resolution.height === 0) {
    return "N/A";
  }

  const { width, height } = resolution;
  const divisor = gcd(width, height);

  const ratioWidth = width / divisor;
  const ratioHeight = height / divisor;

  return `${ratioWidth} : ${ratioHeight}`;
};
