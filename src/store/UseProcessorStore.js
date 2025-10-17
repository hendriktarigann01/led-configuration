import { create } from "zustand";
import { processor } from "../data/processor";
import {
  getAvailableProcessors,
  getRecommendedProcessor,
  getBestConnectionType,
  isProcessorCompatible,
  formatConnectionsForTooltip,
  calculateCurrentResolution,
} from "../utils/ProcessorUtils";

export const UseProcessorStore = create((set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  selectedProcessor: null,
  selectedConnectionType: null,
  currentResolution: 0,

  // ============================================================================
  // ACTIONS
  // ============================================================================

  /**
   * Set selected processor manually
   */
  setSelectedProcessor: (proc) => {
    if (!proc) {
      set({
        selectedProcessor: null,
        selectedConnectionType: null,
      });
      return;
    }

    const state = get();
    const bestConnection = getBestConnectionType(proc, state.currentResolution);

    set({
      selectedProcessor: proc,
      selectedConnectionType: bestConnection?.type || null,
    });
  },

  /**
   * Update current resolution and auto-select best processor
   */
  updateResolution: (
    modelData,
    screenWidth,
    screenHeight,
    baseWidth,
    baseHeight
  ) => {
    const resolution = calculateCurrentResolution(
      modelData,
      screenWidth,
      screenHeight,
      baseWidth,
      baseHeight
    );

    set({ currentResolution: resolution });

    // Auto-select recommended processor
    const recommended = getRecommendedProcessor(processor, resolution);
    if (recommended) {
      const bestConnection = getBestConnectionType(recommended, resolution);
      set({
        selectedProcessor: recommended,
        selectedConnectionType: bestConnection?.type || null,
      });
    } else {
      set({
        selectedProcessor: null,
        selectedConnectionType: null,
      });
    }
  },

  /**
   * Reset processor selection
   */
  reset: () => {
    set({
      selectedProcessor: null,
      selectedConnectionType: null,
      currentResolution: 0,
    });
  },

  // ============================================================================
  // SELECTORS
  // ============================================================================

  /**
   * Get available processors for current resolution
   */
  getAvailableProcessors: () => {
    const state = get();
    return getAvailableProcessors(processor, state.currentResolution);
  },

  /**
   * Get formatted connection types for tooltip
   */
  getFormattedConnections: (proc) => {
    const state = get();
    if (!proc) return [];

    const activeType =
      proc.id === state.selectedProcessor?.id
        ? state.selectedConnectionType
        : getBestConnectionType(proc, state.currentResolution)?.type;

    return formatConnectionsForTooltip(proc, activeType);
  },

  /**
   * Check if processor is compatible with current resolution
   */
  isCompatible: (proc) => {
    const state = get();
    return isProcessorCompatible(proc, state.currentResolution);
  },

  /**
   * Get current processor info
   */
  getCurrentProcessor: () => {
    const state = get();
    return {
      processor: state.selectedProcessor,
      connectionType: state.selectedConnectionType,
      resolution: state.currentResolution,
    };
  },
}));
