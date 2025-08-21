import { create } from "zustand";

export const UseHeaderStore = create((set) => ({
  // Display settings
  screenSize: "Area",
  resolution: "FHD",
  screenHeight: 1.92,
  screenWidth: 2.56,

  // Wall settings
  unit: "Meter",
  wallHeight: 3,
  wallWidth: 5,

  // Actions for Display
  setScreenSize: (size) => set({ screenSize: size }),
  setResolution: (resolution) => set({ resolution }),
  setScreenHeight: (height) => set({ screenHeight: height }),
  setScreenWidth: (width) => set({ screenWidth: width }),

  // Utility actions
  incrementScreenHeight: () =>
    set((state) => ({
      screenHeight: Number((state.screenHeight + 0.01).toFixed(2)),
    })),
  decrementScreenHeight: () =>
    set((state) => ({
      screenHeight: Math.max(0, Number((state.screenHeight - 0.01).toFixed(2))),
    })),
  incrementScreenWidth: () =>
    set((state) => ({
      screenWidth: Number((state.screenWidth + 0.01).toFixed(2)),
    })),
  decrementScreenWidth: () =>
    set((state) => ({
      screenWidth: Math.max(0, Number((state.screenWidth - 0.01).toFixed(2))),
    })),
  incrementWallHeight: () =>
    set((state) => ({
      wallHeight: Number((state.wallHeight + 0.1).toFixed(1)),
    })),
  decrementWallHeight: () =>
    set((state) => ({
      wallHeight: Math.max(0, Number((state.wallHeight - 0.1).toFixed(1))),
    })),
  incrementWallWidth: () =>
    set((state) => ({
      wallWidth: Number((state.wallWidth + 0.1).toFixed(1)),
    })),
  decrementWallWidth: () =>
    set((state) => ({
      wallWidth: Math.max(0, Number((state.wallWidth - 0.1).toFixed(1))),
    })),
}));
