import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";
import { UseCalculatorStore } from "./UseCalculatorStore";
import { UseNavbarStore } from "./UseNavbarStore";
import { model as allModels } from "../data/model";
import { formatPhoneForStorage, isValidPhoneNumber } from "../utils/PhoneUtils";
import {
  DISPLAY_TYPE,
  SUB_TYPE,
  UNIT_NAME,
  PDF_COMPONENTS,
} from "../constants/Display";
import {
  calculatePowerConsumption,
  formatPowerConsumption,
} from "../utils/PowerCalculator";

export const UseExportStore = create((set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================
  isOpen: false,
  isExporting: false,
  pdfData: null,

  // Form fields
  projectName: "",
  userName: "",
  phoneNumber: "",
  email: "",

  // ============================================================================
  // ACTIONS - State mutations
  // ============================================================================

  /**
   * Open export modal
   */
  openModal: () => set({ isOpen: true }),

  /**
   * Close export modal
   */
  closeModal: () => set({ isOpen: false }),

  /**
   * Set form field values
   */
  setProjectName: (projectName) => set({ projectName }),
  setUserName: (userName) => set({ userName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),

  /**
   * Reset form to empty
   */
  resetForm: () =>
    set({
      projectName: "",
      userName: "",
      phoneNumber: "",
      email: "",
    }),

  /**
   * Set form data from object
   */
  setFormData: (data) =>
    set({
      projectName: data.projectName || "",
      userName: data.userName || "",
      phoneNumber: data.phoneNumber || "",
      email: data.email || "",
    }),

  /**
   * Set PDF data for export
   */
  setPdfData: (data) => set({ pdfData: data }),

  /**
   * Export to PDF - prepare data and send to Google Sheets
   */
  exportToPdf: async () => {
    const state = get();

    if (!state.isFormValid()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    set({ isExporting: true });

    try {
      const pdfData = state.getPdfExportData();

      if (!pdfData) {
        alert(
          "No data available for export. Please configure your display first."
        );
        set({ isExporting: false });
        return;
      }

      state.setPdfData(pdfData);

      // Try to send to Google Sheets (non-blocking)
      try {
        await state.sendToGoogleSheets(pdfData);
      } catch (error) {
        console.warn(
          "Google Sheets integration failed, continuing with PDF export:",
          error
        );
      }

      return { success: true, data: pdfData };
    } catch (error) {
      console.error("Export preparation failed:", error);
      alert("Failed to prepare export data. Please try again.");
      set({ isExporting: false });
      return { success: false, error };
    }
  },

  /**
   * Complete export and cleanup
   */
  completeExport: () => {
    set({
      isOpen: false,
      isExporting: false,
      pdfData: null,
    });
  },

  /**
   * Send data to Google Sheets
   */
  sendToGoogleSheets: async (data) => {
    try {
      const webAppUrl = import.meta.env.VITE_WEB_APP_URL;

      if (!webAppUrl) {
        console.warn("Google Sheets URL not configured");
        return { success: true };
      }

      const payload = {
        pdfTitle: data.pdfTitle || "",
        projectName: data.projectName || "",
        userName: data.userName || "",
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
      };

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
      return result;
    } catch (error) {
      console.error("Google Sheets error:", error);
      throw error;
    }
  },

  // ============================================================================
  // SELECTORS - Computed values
  // ============================================================================

  /**
   * Generate automatic PDF title
   */
  generatePdfTitle: () => {
    const navbarStore = UseNavbarStore.getState();
    const state = get();

    const pixelPitch = navbarStore.selectedModel?.modelData?.pixel_pitch
      ? `${navbarStore.selectedModel.modelData.pixel_pitch}`
      : "P1.8";

    const projectName = state.projectName.trim() || "";

    const cleanProjectName = projectName
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    return `${cleanProjectName}_${pixelPitch}_ByMJSolutionIndonesia`;
  },

  /**
   * Get form data object
   */
  getFormData: () => {
    const state = get();
    return {
      projectName: state.projectName,
      userName: state.userName,
      phoneNumber: state.phoneNumber,
      email: state.email,
    };
  },

  /**
   * Validate form fields
   */
  isFormValid: () => {
    const state = get();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      state.projectName.trim() !== "" &&
      state.userName.trim() !== "" &&
      state.phoneNumber.trim() !== "" &&
      isValidPhoneNumber(state.phoneNumber) &&
      state.email.trim() !== "" &&
      emailRegex.test(state.email)
    );
  },

  /**
   * Check if export is ready (has configured display)
   */
  isExportReady: () => {
    const canvasStore = UseCanvasStore.getState();
    const navbarStore = UseNavbarStore.getState();
    return canvasStore.isConfigured() && navbarStore.selectedModel;
  },

  /**
   * Get comprehensive data for PDF export
   */
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
    const isVideoWall = displayType.includes("Video Wall");

    // Get partner data for indoor displays
    let partnerData = null;
    if (
      navbarStore.selectedModel?.displayTypeId === DISPLAY_TYPE.INDOOR_LED &&
      navbarStore.selectedModel?.subTypeId
    ) {
      const partnerId =
        navbarStore.selectedModel.subTypeId === SUB_TYPE.CABINET
          ? DISPLAY_TYPE.MODULE
          : DISPLAY_TYPE.INDOOR_LED;
      const partnerModel = allModels.find((m) => m.id === partnerId);
      if (partnerModel) {
        partnerData = partnerModel.data.find(
          (d) => d.pixel_pitch === modelData.pixel_pitch
        );
      }
    }

    // Get comprehensive calculation results
    const results = calculatorStore.getCalculationResults(
      modelData,
      displayType,
      canvasStore.screenWidth,
      canvasStore.screenHeight,
      canvasStore.baseWidth,
      canvasStore.baseHeight
    );

    if (!results) return null;

    const {
      unitCount,
      totalUnits,
      actualScreenSize,
      resolutionPerUnit,
      totalWeight,
    } = results;

    const sqm = (actualScreenSize.width * actualScreenSize.height).toFixed(2);

    // Helper functions
    const getPixelPitchOrInch = () => {
      if (modelData.pixel_pitch) {
        return modelData.pixel_pitch;
      } else if (modelData.inch) {
        return modelData.inch;
      }
      return "N/A";
    };

    const getUnitName = () => {
      if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
        return UNIT_NAME.CABINET;
      } else if (displayType.includes("Module")) {
        return UNIT_NAME.MODULE;
      } else if (displayType.includes("Video Wall")) {
        return UNIT_NAME.VIDEO_WALL;
      }
      return UNIT_NAME.DEFAULT;
    };

    const getResolutionDisplay = () => {
      const totalResolutionWidth =
        unitCount.horizontal * (resolutionPerUnit.width / totalUnits);
      const totalResolutionHeight =
        unitCount.vertical * (resolutionPerUnit.height / totalUnits);
      return `${Math.round(totalResolutionWidth)} x ${Math.round(
        totalResolutionHeight
      )}`;
    };

    const getUnitConfiguration = () => {
      return `${unitCount.horizontal}(W) x ${unitCount.vertical}(H) ${totalUnits} Pcs`;
    };

    // Calculate power consumption
    const screenArea = actualScreenSize.width * actualScreenSize.height;
    const powerConsumption = calculatePowerConsumption(
      modelData,
      isVideoWall,
      totalUnits,
      screenArea
    );

    // Determine component selection for PDF
    let specConfigComponent = PDF_COMPONENTS.INDOOR_OUTDOOR.CONFIG;
    let specDefaultComponent = PDF_COMPONENTS.INDOOR_OUTDOOR.DEFAULT;

    if (displayType.includes("Video Wall")) {
      specConfigComponent = PDF_COMPONENTS.VIDEO_WALL.CONFIG;
      specDefaultComponent = PDF_COMPONENTS.VIDEO_WALL.DEFAULT;
    } else if (displayType.includes("Outdoor")) {
      specDefaultComponent = PDF_COMPONENTS.OUTDOOR.DEFAULT;
    }

    return {
      // Form data
      pdfTitle: state.generatePdfTitle(),
      projectName: state.projectName,
      userName: state.userName,
      phoneNumber: formatPhoneForStorage(state.phoneNumber),
      email: state.email,
      exportDate: new Date().toLocaleDateString("id-ID"),
      exportTime: new Date().toLocaleTimeString("id-ID"),

      // Model data
      modelData,
      displayType,
      modelName: navbarStore.selectedModel.model,
      isVideoWall,

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
        unitCount,
        totalUnits,
        actualScreenSize,
        resolutionPerUnit,
        totalWeight,
        baseDimensions: {
          width: canvasStore.baseWidth,
          height: canvasStore.baseHeight,
        },

        processedValues: {
          pixelPitchOrInch: getPixelPitchOrInch(),
          unitName: getUnitName(),
          resolutionDisplay: getResolutionDisplay(),
          unitConfiguration: getUnitConfiguration(),
          sqm: isVideoWall ? null : sqm,
          realSize: isVideoWall
            ? null
            : `${actualScreenSize.width.toFixed(
                3
              )} x ${actualScreenSize.height.toFixed(3)} `,
          weight:
            !isVideoWall && totalWeight > 0
              ? `${totalWeight.toFixed(0)} kg`
              : null,
          powerConsumption: {
            max: powerConsumption.max,
            average: powerConsumption.average,
            maxFormatted: formatPowerConsumption(
              powerConsumption.max,
              isVideoWall
            ),
            averageFormatted: formatPowerConsumption(
              powerConsumption.average,
              isVideoWall
            ),
          },
        },
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
}));
