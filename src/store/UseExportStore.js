import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";
import { UseCalculatorStore } from "./UseCalculatorStore";
import { UseNavbarStore } from "./UseNavbarStore";
import { model as allModels, model } from "../data/model";

export const UseExportStore = create((set, get) => ({
  isOpen: false,

  // Form
  projectName: "",
  userName: "",
  phoneNumber: "", // Added phone number field
  email: "",

  isExporting: false,

  // PDF Data for export
  pdfData: null,

  openModal: () => set({ isOpen: true }),

  closeModal: () =>
    set({
      isOpen: false,
      // Optionally reset form when closing
      // projectName: "",
      // userName: "",
      // phoneNumber: "",
      // email: "",
    }),

  // Form field setters
  setProjectName: (projectName) => set({ projectName }),
  setUserName: (userName) => set({ userName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }), // Added phone number setter
  setEmail: (email) => set({ email }),

  resetForm: () =>
    set({
      projectName: "",
      userName: "",
      phoneNumber: "",
      email: "",
    }),

  // Generate automatic PDF title
  generatePdfTitle: () => {
    const navbarStore = UseNavbarStore.getState();
    const state = get();

    const pixelPitch = navbarStore.selectedModel?.modelData?.pixel_pitch
      ? `${navbarStore.selectedModel.modelData.pixel_pitch}`
      : "P1.8";

    const projectName = state.projectName.trim() || "";

    const cleanProjectName = projectName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return `${cleanProjectName}_${pixelPitch}_ByMJSolutionIndonesia`;
  },

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

    let partnerData = null;

    if (
      navbarStore.selectedModel?.displayTypeId === 1 &&
      navbarStore.selectedModel?.subTypeId
    ) {
      const partnerId = navbarStore.selectedModel.subTypeId === 1 ? 2 : 1;
      const partnerModel = allModels.find((m) => m.id === partnerId);
      if (partnerModel) {
        partnerData = partnerModel.data.find(
          (d) => d.pixel_pitch === modelData.pixel_pitch
        );
      }
    }

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
      pdfTitle: state.generatePdfTitle(), // Auto-generated PDF title
      projectName: state.projectName,
      userName: state.userName,
      phoneNumber: state.phoneNumber, // Added phone number to export data
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

      // Indoor
      moduleResolution:
        modelData.module_resolution || partnerData?.module_resolution || "N/A",
      modulePixels:
        modelData.module_pixels || partnerData?.module_pixels || "N/A",
      cabinetResolution:
        modelData.cabinet_resolution ||
        partnerData?.cabinet_resolution ||
        "N/A",
      cabinetPixels:
        modelData.cabinet_pixels || partnerData?.cabinet_pixels || "N/A",
      pixelDensity:
        modelData.pixel_density || partnerData?.pixel_density || "N/A",

      // Outdoor
      ledLamp: modelData.led_lamp || "N/A",
      pixelResolution: modelData.pixel_resolution || "N/A",
      moduleWeight: modelData.module_weight || "N/A",
      viewingDistance: modelData.best_viewing_distance || "N/A",

      // Video Wall
      unitSize: modelData.unit_size_mm || "N/A",
      b2b: modelData.b2b || "N/A",
      resolution: modelData.resolution || "N/A",
      contrastRatio: modelData.contrast_ratio || "N/A",
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

      // Only send the fields that your Google Apps Script expects
      const payload = {
        pdfTitle: data.pdfTitle || "",
        projectName: data.projectName || "",
        userName: data.userName || "",
        phoneNumber: data.phoneNumber || "", // Make sure this is included
        email: data.email || "",
      };

      console.log("Sending to Google Sheets:", payload); // Debug log

      const response = await fetch(webAppUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Google Sheets response error:", errorText);
        throw new Error(
          `Failed to send data to Google Sheets: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Google Sheets response:", result); // Debug log
      return result;
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
      projectName: state.projectName,
      userName: state.userName,
      phoneNumber: state.phoneNumber, // Added phone number to form data
      email: state.email,
    };
  },

  setFormData: (data) =>
    set({
      projectName: data.projectName || "",
      userName: data.userName || "",
      phoneNumber: data.phoneNumber || "", // Added phone number to form data setter
      email: data.email || "",
    }),

  isFormValid: () => {
    const state = get();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s()]{8,15}$/; // Simple phone validation

    return (
      state.projectName.trim() !== "" &&
      state.userName.trim() !== "" &&
      state.phoneNumber.trim() !== "" &&
      phoneRegex.test(state.phoneNumber.trim()) &&
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
