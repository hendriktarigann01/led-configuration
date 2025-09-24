import { create } from "zustand";

export const UseCropperStore = create((set) => ({
  // Modal visibility
  isOpen: false,

  // Image URL to be cropped
  originalImageUrl: null,

  // Callback function to handle the cropped result
  onComplete: null,

  // Cropping state
  cropState: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  },

  // Actions
  openCropper: (imageUrl, onComplete) =>
    set({
      isOpen: true,
      originalImageUrl: imageUrl,
      onComplete,
      // Reset crop state when opening
      cropState: {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
      },
    }),

  closeCropper: () =>
    set({
      isOpen: false,
      originalImageUrl: null,
      onComplete: null,
      cropState: {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
      },
    }),

  setCropState: (newState) =>
    set((state) => ({
      cropState: { ...state.cropState, ...newState },
    })),

  updateCropState: (updater) =>
    set((state) => ({
      cropState: updater(state.cropState),
    })),
}));
