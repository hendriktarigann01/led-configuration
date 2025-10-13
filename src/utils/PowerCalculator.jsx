import { POWER_ROUND_STEP } from "../constants/Validation";

/**
 * Parse power consumption from different formats
 * @param {string} powerString - Power string
 * @returns {{max: number, average: number}}
 */
export const parsePowerConsumption = (powerString) => {
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
};

/**
 * Calculate power consumption for display
 * @param {Object} modelData - Model data object
 * @param {boolean} isVideoWall - Is video wall display
 * @param {number} totalUnits - Total units
 * @param {number} screenArea - Screen area in square meters
 * @returns {{max: number, average: number}}
 */
export const calculatePowerConsumption = (
  modelData,
  isVideoWall,
  totalUnits,
  screenArea
) => {
  if (!modelData.power_consumption) return { max: 0, average: 0 };

  const powerData = parsePowerConsumption(modelData.power_consumption);

  if (isVideoWall) {
    return {
      max: totalUnits * powerData.max,
      average: totalUnits * powerData.average,
    };
  } else {
    return {
      max: screenArea * powerData.max,
      average: screenArea * powerData.average,
    };
  }
};

/**
 * Format power consumption for display
 * @param {number} power - Power value
 * @param {boolean} isVideoWall - Is video wall display
 * @returns {string|null}
 */
export const formatPowerConsumption = (power, isVideoWall) => {
  if (power <= 0) return null;

  if (isVideoWall) {
    return `${Math.round(power).toLocaleString("id-ID")} W`;
  } else {
    return `${(
      Math.ceil(power / POWER_ROUND_STEP) * POWER_ROUND_STEP
    ).toLocaleString("id-ID")} W`;
  }
};
