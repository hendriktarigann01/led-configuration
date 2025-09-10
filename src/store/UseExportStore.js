import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";
import { UseCalculatorStore } from "./UseCalculatorStore";
import { UseNavbarStore } from "./UseNavbarStore";

export const UseExportStore = create((set, get) => ({
  isOpen: false,

  // Form
  pdfTitle: "",
  projectName: "",
  userName: "",
  email: "",

  isExporting: false,

  // PDF Data for export
  pdfData: null,

  openModal: () => set({ isOpen: true }),

  closeModal: () =>
    set({
      isOpen: false,
      // Optionally reset form when closing
      // pdfTitle: "",
      // projectName: "",
      // userName: "",
      // email: "",
    }),

  // Form field setters
  setPdfTitle: (pdfTitle) => set({ pdfTitle }),
  setProjectName: (projectName) => set({ projectName }),
  setUserName: (userName) => set({ userName }),
  setEmail: (email) => set({ email }),

  resetForm: () =>
    set({
      pdfTitle: "",
      projectName: "",
      userName: "",
      email: "",
    }),

  // Get comprehensive data for PDF export
  getPdfExportData: () => {
    const canvasStore = UseCanvasStore.getState();
    const calculatorStore = UseCalculatorStore.getState();
    const navbarStore = UseNavbarStore.getState();
    const state = get();

    if (!canvasStore.isConfigured() || !navbarStore.selectedModel) {
      return null;
    }

    const modelData = navbarStore.selectedModel.modelData;
    const displayType = navbarStore.selectedModel.name;

    // Get calculation results
    const results = calculatorStore.getCalculationResults(
      modelData,
      displayType,
      canvasStore.screenWidth,
      canvasStore.screenHeight,
      canvasStore.baseWidth,
      canvasStore.baseHeight
    );

    if (!results) return null;

    // Determine component type based on display type
    let specConfigComponent = "IndoorOutdoorConfig";
    let specDefaultComponent = "Indoor";

    if (displayType.includes("Video Wall")) {
      specConfigComponent = "VideoWallConfig";
      specDefaultComponent = "VideoWall";
    } else if (displayType.includes("Outdoor")) {
      specDefaultComponent = "Outdoor";
    }

    // Get unit name for display
    const getUnitName = () => {
      if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
        return "Cabinets";
      } else if (displayType.includes("Module")) {
        return "Modules";
      } else if (displayType.includes("Video Wall")) {
        return "Units";
      }
      return "Units";
    };

    return {
      // Form data
      pdfTitle: state.pdfTitle,
      projectName: state.projectName,
      userName: state.userName,
      email: state.email,
      exportDate: new Date().toLocaleDateString("id-ID"),
      exportTime: new Date().toLocaleTimeString("id-ID"),

      // Model data
      modelData,
      displayType,
      modelName: navbarStore.selectedModel.model,

      // Screen configuration
      screenConfig: {
        width: canvasStore.screenWidth.toFixed(3),
        height: canvasStore.screenHeight.toFixed(3),
        area: (canvasStore.screenWidth * canvasStore.screenHeight).toFixed(2),
      },

      // Wall configuration
      wallConfig: {
        width: canvasStore.wallWidth.toFixed(1),
        height: canvasStore.wallHeight.toFixed(1),
      },

      // Calculation results
      calculations: {
        unitCount: results.unitCount,
        totalUnits: results.totalUnits,
        unitName: getUnitName(),
        resolution: results.resolutionPerUnit,
        power: results.totalPower,
        weight: results.totalWeight,
        baseDimensions: results.baseDimensions,
      },

      // Component selection for PDF
      components: {
        specConfig: specConfigComponent,
        specDefault: specDefaultComponent,
      },

      // Additional display info
      inch: modelData.inch || "N/A",
      pixelPitch: modelData.pixel_pitch || "N/A",
      brightness: modelData.brightness || "N/A",
      refreshRate: modelData.refresh_rate || "N/A",
    };
  },

  // Set PDF data for export
  setPdfData: (data) => set({ pdfData: data }),

  sendToGoogleSheets: async (data) => {
    try {
      const webAppUrl = import.meta.env.VITE_WEB_APP_URL;

      if (!webAppUrl) {
        console.warn("Google Sheets URL not configured");
        return { success: true }; // Continue without Google Sheets
      }

      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          pdfTitle: data.pdfTitle,
          projectName: data.projectName,
          userName: data.userName,
          email: data.email,
          displayType: data.displayType || "",
          screenSize: `${data.screenConfig?.width || 0} x ${
            data.screenConfig?.height || 0
          } m`,
          totalUnits: data.calculations?.totalUnits || 0,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to Google Sheets");
      }

      return await response.json();
    } catch (error) {
      console.error("Google Sheets error:", error);
      throw error;
    }
  },

  // This will be called by react-to-print
  exportToPdf: async () => {
    const state = get();

    if (!state.isFormValid()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    set({ isExporting: true });

    try {
      // Get PDF data
      const pdfData = state.getPdfExportData();

      if (!pdfData) {
        alert(
          "No data available for export. Please configure your display first."
        );
        set({ isExporting: false });
        return;
      }

      // Set PDF data for components to use
      state.setPdfData(pdfData);

      console.log("PDF Export Data:", pdfData);

      // Send to Google Sheets (optional)
      try {
        await state.sendToGoogleSheets(pdfData);
      } catch (error) {
        console.warn(
          "Google Sheets integration failed, continuing with PDF export:",
          error
        );
      }

      // Return success - the actual PDF generation will be handled by react-to-print
      return { success: true, data: pdfData };
    } catch (error) {
      console.error("Export preparation failed:", error);
      alert("Failed to prepare export data. Please try again.");
      set({ isExporting: false });
      return { success: false, error };
    }
  },

  // Complete export process (called after PDF generation)
  completeExport: () => {
    set({
      isOpen: false,
      isExporting: false,
      pdfData: null,
    });
  },

  getFormData: () => {
    const state = get();
    return {
      pdfTitle: state.pdfTitle,
      projectName: state.projectName,
      userName: state.userName,
      email: state.email,
    };
  },

  setFormData: (data) =>
    set({
      pdfTitle: data.pdfTitle || "",
      projectName: data.projectName || "",
      userName: data.userName || "",
      email: data.email || "",
    }),

  isFormValid: () => {
    const state = get();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      state.pdfTitle.trim() !== "" &&
      state.projectName.trim() !== "" &&
      state.userName.trim() !== "" &&
      state.email.trim() !== "" &&
      emailRegex.test(state.email)
    );
  },

  // Helper method to check if export is ready
  isExportReady: () => {
    const canvasStore = UseCanvasStore.getState();
    const navbarStore = UseNavbarStore.getState();
    return canvasStore.isConfigured() && navbarStore.selectedModel;
  },
}));
