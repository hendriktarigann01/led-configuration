/**
 * Get all connection types with their capacities for a processor
 * @param {Object} processor - Processor object
 * @returns {Array} Array of {type, capacity} objects
 */
export const getConnectionTypes = (processor) => {
  if (!processor || !processor.maxResolution) return [];

  return Object.entries(processor.maxResolution).map(([type, capacity]) => ({
    type: type,
    capacity,
  }));
};

/**
 * Get highest capacity from all connection types
 * @param {Object} processor - Processor object
 * @returns {number} Highest capacity
 */
export const getHighestCapacity = (processor) => {
  const connectionTypes = getConnectionTypes(processor);
  if (connectionTypes.length === 0) return 0;

  return Math.max(...connectionTypes.map((conn) => conn.capacity));
};

/**
 * Find the best connection type for a given resolution
 * Logic: Use smallest connection type that can support the resolution
 * If all connection types are insufficient, use the largest one
 * @param {Object} processor - Processor object
 * @param {number} currentResolution - Current screen resolution
 * @returns {Object} {type, capacity} of best connection type
 */
export const getBestConnectionType = (processor, currentResolution) => {
  const connectionTypes = getConnectionTypes(processor);

  if (connectionTypes.length === 0) return null;

  // Sort by capacity ascending
  const sortedTypes = [...connectionTypes].sort(
    (a, b) => a.capacity - b.capacity
  );

  // Find smallest connection type that meets or exceeds resolution
  const suitable = sortedTypes.find(
    (conn) => conn.capacity >= currentResolution
  );

  // If found, return it; otherwise return the largest available
  return suitable || sortedTypes[sortedTypes.length - 1];
};

/**
 * Check if processor is compatible with given resolution
 * Logic: countResolution ≥ maxResolution (using HIGHEST capacity)
 * @param {Object} processor - Processor object
 * @param {number} currentResolution - Current screen resolution
 * @returns {boolean}
 */
export const isProcessorCompatible = (processor, currentResolution) => {
  const highestCapacity = getHighestCapacity(processor);

  // Processor compatible if: countResolution >= maxResolution
  return currentResolution <= highestCapacity;
};

/**
 * Filter processors based on logic: countResolution ≥ maxResolution
 * Tiered system: TB/VX series (entry-mid) can appear together
 * H Series only appears if NO TB/VX is sufficient
 * @param {Array} processors - Array of processor objects
 * @param {number} currentResolution - Current screen resolution
 * @returns {Array} Filtered processors sorted by ID
 */
export const getAvailableProcessors = (processors, currentResolution) => {
  if (!processors || processors.length === 0) return [];
  if (!currentResolution || currentResolution <= 0) return processors;

  // Filter processors where: countResolution >= maxResolution
  const compatible = processors.filter((proc) =>
    isProcessorCompatible(proc, currentResolution)
  );

  // Separate by series
  const tbVxCompatible = compatible.filter(
    (proc) => proc.series === "TB" || proc.series === "VX"
  );
  const hCompatible = compatible.filter((proc) => proc.series === "H");

  // Logic: Show H Series ONLY if no TB/VX is sufficient
  let result;
  if (tbVxCompatible.length > 0) {
    // TB/VX available → Show only TB/VX, hide H series
    result = tbVxCompatible;
  } else {
    // No TB/VX available → Show H series
    result = hCompatible;
  }

  // Sort by ID (ascending)
  return result.sort((a, b) => a.id - b.id);
};

/**
 * Get the best processor for current resolution
 * Auto-select: Smallest processor (by ID) where countResolution >= maxResolution
 * @param {Array} processors - Array of processor objects
 * @param {number} currentResolution - Current screen resolution
 * @returns {Object|null|string} Best processor, null, or "no compatible processor"
 */
export const getRecommendedProcessor = (processors, currentResolution) => {
  const available = getAvailableProcessors(processors, currentResolution);

  // If no compatible processor found, check if resolution exceeds all specs
  if (available.length === 0 && currentResolution > 0) {
    const allIncompatible = processors.every(
      (proc) => !isProcessorCompatible(proc, currentResolution)
    );

    if (allIncompatible) {
      return "no compatible processor";
    }
  }

  // Return smallest (first by ID) compatible processor
  return available.length > 0 ? available[0] : null;
};


/**
 * Format capacity number with thousand separators
 * @param {number} capacity - Capacity number
 * @returns {string} Formatted string (e.g., "26.000.000")
 */
export const formatCapacity = (capacity) => {
  if (!capacity) return "0";
  return capacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/**
 * Format connection types for display in tooltip
 * @param {Object} processor - Processor object
 * @param {string} activeType - Currently active connection type
 * @returns {Array} Array of formatted connection info
 */
export const formatConnectionsForTooltip = (processor, activeType) => {
  const connections = getConnectionTypes(processor);

  return connections.map((conn) => ({
    type: conn.type,
    capacity: formatCapacity(conn.capacity),
    isActive: conn.type === activeType,
  }));
};

/**
 * Calculate current resolution from screen dimensions and model data
 * @param {Object} modelData - Model data object
 * @param {number} screenWidth - Screen width in meters
 * @param {number} screenHeight - Screen height in meters
 * @param {number} baseWidth - Base unit width in meters
 * @param {number} baseHeight - Base unit height in meters
 * @returns {number} Total resolution in pixels
 */
export const calculateCurrentResolution = (
  modelData,
  screenWidth,
  screenHeight,
  baseWidth,
  baseHeight
) => {
  if (!modelData || !baseWidth || !baseHeight) return 0;

  // Calculate cabinet count
  const cabinetCountH = Math.round(screenWidth / baseWidth);
  const cabinetCountV = Math.round(screenHeight / baseHeight);

  // Get resolution per cabinet/module
  let resolutionPerUnit = { width: 0, height: 0 };

  if (modelData.cabinet_resolution) {
    const match = modelData.cabinet_resolution.match(/(\d+)\s*[xXÃ—]\s*(\d+)/);
    if (match) {
      resolutionPerUnit = {
        width: parseInt(match[1]),
        height: parseInt(match[2]),
      };
    }
  } else if (modelData.module_resolution) {
    const match = modelData.module_resolution.match(/(\d+)\s*[xXÃ—]\s*(\d+)/);
    if (match) {
      resolutionPerUnit = {
        width: parseInt(match[1]),
        height: parseInt(match[2]),
      };
    }
  } else if (modelData.resolution) {
    const match = modelData.resolution.match(/(\d+)\s*[xXÃ—]\s*(\d+)/);
    if (match) {
      resolutionPerUnit = {
        width: parseInt(match[1]),
        height: parseInt(match[2]),
      };
    }
  }

  // Calculate total resolution
  const totalWidth = resolutionPerUnit.width * cabinetCountH;
  const totalHeight = resolutionPerUnit.height * cabinetCountV;
  const totalResolution = totalWidth * totalHeight;

  // Console log for debugging
  console.log("=== RESOLUTION CALCULATION ===");
  console.log("Cabinet Count (H x V):", cabinetCountH, "x", cabinetCountV);
  console.log("Resolution per unit:", resolutionPerUnit);
  console.log("Total Resolution (W x H):", totalWidth, "x", totalHeight);
  console.log("Total Resolution (dots):", totalResolution);
  console.log("==============================");

  return totalResolution;
};
