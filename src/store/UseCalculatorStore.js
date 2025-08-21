import { create } from "zustand";

export const UseCalculatorStore = create((set) => ({
  panel: null,
  formData: {},
  result: null,
  ledImage: null,
  backgroundImage: null,
  setPanel: (panel) => set({ panel }),
  setFormData: (data) => set({ formData: data }),
  setResult: (res) => set({ result: res }),
  setLedImage: (img) => set({ ledImage: img }),
  setBackgroundImage: (img) => set({ backgroundImage: img }),
  reset: () =>
    set({
      panel: null,
      formData: {},
      result: null,
      ledImage: null,
      backgroundImage: null,
    }),
}));
