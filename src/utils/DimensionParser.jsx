import { CONVERSION } from "../constants/Validation";

/**
 * Parse size string to dimensions in meters
 * @param {string} sizeString - Size string in various formats
 * @returns {{width: number, height: number}}
 */
export const parseDimensions = (sizeString) => {
  if (!sizeString) return { width: 0, height: 0 };

  // Handle format: "640 (W) x 480 (H)"
  if (sizeString.includes("(W)") && sizeString.includes("(H)")) {
    const parts = sizeString.split(" x ");
    const width = parseFloat(
      parts[0].replace("(W)", "").replace(",", "").trim()
    );
    const height = parseFloat(parts[1].replace("(H)", "").trim());
    return {
      width: width / CONVERSION.MM_TO_M,
      height: height / CONVERSION.MM_TO_M,
    };
  }

  // Handle format: "640*480mm" or "960*960 mm" or "640x480"
  if (sizeString.includes("*") || sizeString.includes("x")) {
    const cleanSize = sizeString.replace(/mm|m/g, "").trim();
    const separator = cleanSize.includes("*") ? "*" : "x";
    const parts = cleanSize.split(separator);
    const width = parseFloat(parts[0].replace(",", "").trim());
    const height = parseFloat(parts[1].replace(",", "").trim());
    return {
      width: width / CONVERSION.MM_TO_M,
      height: height / CONVERSION.MM_TO_M,
    };
  }

  return { width: 0, height: 0 };
};

/**
 * Parse weight from string (remove kg/pcs and convert to number)
 * @param {string} weightString - Weight string
 * @returns {number}
 */
export const parseWeight = (weightString) => {
  if (!weightString) return 0;

  const weightMatch = weightString.match(/(\d+(?:\.\d+)?)/);
  return weightMatch ? parseFloat(weightMatch[1]) : 0;
};

/**
 * Get base dimensions from model data based on display type
 * @param {Object} modelData - Model data object
 * @returns {{width: number, height: number}}
 */
export const getBaseDimensions = (modelData) => {
  if (!modelData) return { width: 0, height: 0 };

  // Indoor LED Fixed (Cabinet)
  if (modelData.cabinet_size) {
    return parseDimensions(modelData.cabinet_size);
  }

  // Indoor LED Fixed (Module)
  if (modelData.module_size) {
    return parseDimensions(modelData.module_size);
  }

  // Video Wall
  if (modelData.unit_size_mm) {
    return parseDimensions(modelData.unit_size_mm);
  }

  return { width: 0, height: 0 };
};

/**
 * Get weight field based on display type
 * @param {Object} modelData - Model data object
 * @returns {string|null}
 */
export const getWeightField = (modelData) => {
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
};
