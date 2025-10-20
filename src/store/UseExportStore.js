import { create } from "zustand";
import { UseCanvasStore } from "./UseCanvasStore";
import { UseCalculatorStore } from "./UseCalculatorStore";
import { UseNavbarStore } from "./UseNavbarStore";
import { UseProcessorStore } from "./UseProcessorStore";
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

  projectName: "",
  userName: "",
  phoneNumber: "",
  email: "",

  // ============================================================================
  // ACTIONS - State mutations
  // ============================================================================

  openModal: () => set({ isOpen: true }),

  closeModal: () => set({ isOpen: false }),

  setProjectName: (projectName) => set({ projectName }),
  setUserName: (userName) => set({ userName }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setEmail: (email) => set({ email }),

  resetForm: () =>
    set({
      projectName: "",
      userName: "",
      phoneNumber: "",
      email: "",
    }),

  setFormData: (data) =>
    set({
      projectName: data.projectName || "",
      userName: data.userName || "",
      phoneNumber: data.phoneNumber || "",
      email: data.email || "",
    }),

  setPdfData: (data) => set({ pdfData: data }),

  exportToPdf: async () => {
    const state = get();

    if (!state.isFormValid()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    set({ isExporting: true });

    // Get room image directly without compression
    const navbarStore = UseNavbarStore.getState();
    const roomImageUrl = navbarStore.roomImageUrl || null;

    try {
      const pdfData = state.getPdfExportData();

      if (!pdfData) {
        alert(
          "No data available for export. Please configure your display first."
        );
        set({ isExporting: false });
        return;
      }

      pdfData.roomImageUrl = roomImageUrl;
      state.setPdfData(pdfData);
      console.log(
        "PDF Data roomImageUrl:",
        pdfData.roomImageUrl?.substring(0, 50)
      );

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

  completeExport: () => {
    set({
      isOpen: false,
      isExporting: false,
      pdfData: null,
    });
  },

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
        productName: data.displayType || data.modelName || "",
        pixelPitch: data.modelData?.pixel_pitch || "",
        inch: data.modelData?.inch || "",
        screenSize: data.screenConfig
          ? `${data.screenConfig.width}m x ${data.screenConfig.height}m (${data.screenConfig.area} m²)`
          : "",
        wallSize: data.wallConfig
          ? `${data.wallConfig.width}m x ${data.wallConfig.height}m`
          : "",
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
      console.log("Google Sheets success:", result);
      return result;
    } catch (error) {
      console.error("Google Sheets error:", error);
      throw error;
    }
  },

  // ============================================================================
  // SELECTORS - Computed values
  // ============================================================================

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

  getFormData: () => {
    const state = get();
    return {
      projectName: state.projectName,
      userName: state.userName,
      phoneNumber: state.phoneNumber,
      email: state.email,
    };
  },

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

  isExportReady: () => {
    const canvasStore = UseCanvasStore.getState();
    const navbarStore = UseNavbarStore.getState();
    return canvasStore.isConfigured() && navbarStore.selectedModel;
  },

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  getPixelPitchOrInch: (modelData) => {
    if (modelData?.pixel_pitch) {
      return modelData.pixel_pitch;
    } else if (modelData?.inch) {
      return modelData.inch;
    }
    return "N/A";
  },

  getUnitName: (displayType) => {
    if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
      return UNIT_NAME.CABINET;
    } else if (displayType.includes("Module")) {
      return UNIT_NAME.MODULE;
    } else if (displayType.includes("Video Wall")) {
      return UNIT_NAME.VIDEO_WALL;
    }
    return UNIT_NAME.DEFAULT;
  },

  getResolutionDisplay: (unitCount, resolutionPerUnit, totalUnits) => {
    const totalResolutionWidth =
      unitCount.horizontal * (resolutionPerUnit.width / totalUnits);
    const totalResolutionHeight =
      unitCount.vertical * (resolutionPerUnit.height / totalUnits);
    return `${Math.round(totalResolutionWidth)} x ${Math.round(
      totalResolutionHeight
    )}`;
  },

  getUnitConfiguration: (unitCount, totalUnits) => {
    return `${unitCount.horizontal}(W) x ${unitCount.vertical}(H) ${totalUnits} Pcs`;
  },

  getPartnerData: (modelData, displayTypeId, subTypeId) => {
    if (displayTypeId === DISPLAY_TYPE.INDOOR_LED && subTypeId) {
      const partnerId =
        subTypeId === SUB_TYPE.CABINET
          ? DISPLAY_TYPE.MODULE
          : DISPLAY_TYPE.INDOOR_LED;
      const partnerModel = allModels.find((m) => m.id === partnerId);
      if (partnerModel) {
        return partnerModel.data.find(
          (d) => d.pixel_pitch === modelData.pixel_pitch
        );
      }
    }
    return null;
  },

  getComponentSelection: (displayType) => {
    if (displayType.includes("Video Wall")) {
      return {
        specConfig: PDF_COMPONENTS.VIDEO_WALL.CONFIG,
        specDefault: PDF_COMPONENTS.VIDEO_WALL.DEFAULT,
      };
    } else if (displayType.includes("Outdoor")) {
      return {
        specConfig: PDF_COMPONENTS.INDOOR_OUTDOOR.CONFIG,
        specDefault: PDF_COMPONENTS.OUTDOOR.DEFAULT,
      };
    }
    return {
      specConfig: PDF_COMPONENTS.INDOOR_OUTDOOR.CONFIG,
      specDefault: PDF_COMPONENTS.INDOOR_OUTDOOR.DEFAULT,
    };
  },

  // ============================================================================
  // PDF EXPORT DATA
  // ============================================================================

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

    // Get partner data
    const partnerData = state.getPartnerData(
      modelData,
      navbarStore.selectedModel.displayTypeId,
      navbarStore.selectedModel.subTypeId
    );

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

    const {
      unitCount,
      totalUnits,
      actualScreenSize,
      resolutionPerUnit,
      totalWeight,
    } = results;

    const sqm = (actualScreenSize.width * actualScreenSize.height).toFixed(2);

    // Get helper values
    const pixelPitchOrInch = state.getPixelPitchOrInch(modelData);
    const unitName = state.getUnitName(displayType);
    const resolutionDisplay = state.getResolutionDisplay(
      unitCount,
      resolutionPerUnit,
      totalUnits
    );
    const unitConfiguration = state.getUnitConfiguration(unitCount, totalUnits);
    const componentSelection = state.getComponentSelection(displayType);

    // Calculate power consumption
    const screenArea = actualScreenSize.width * actualScreenSize.height;
    const powerConsumption = calculatePowerConsumption(
      modelData,
      isVideoWall,
      totalUnits,
      screenArea
    );

    const processorStore = UseProcessorStore.getState();
    const processorData = {
      processor: processorStore.selectedProcessor?.name || "N/A",
      connectionType: processorStore.selectedConnectionType || "N/A",
    };

    // ========== CRITICAL: Export screen position for PDF ==========
    const screenPosition = {
      x: canvasStore.screenPosition?.x || 0,
      y: canvasStore.screenPosition?.y || 0,
    };

    console.log("Export Store - Exporting screenPosition:", screenPosition);
    // ================================================================

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

      // ========== ADD: Screen position for move feature ==========
      screenPosition: screenPosition,
      // ============================================================

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
          pixelPitchOrInch,
          unitName,
          resolutionDisplay,
          unitConfiguration,
          sqm: isVideoWall ? null : sqm,
          realSize: isVideoWall
            ? null
            : `${actualScreenSize.width.toFixed(
                3
              )} x ${actualScreenSize.height.toFixed(3)}`,
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

      // Component selection
      components: componentSelection,

      // Display specs
      inch: modelData.inch || "N/A",
      pixelPitch: modelData.pixel_pitch || "N/A",
      brightness: modelData.brightness || "N/A",

      // Indoor specs
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

      // Outdoor specs
      ledLamp: modelData.led_lamp || "N/A",
      pixelResolution: modelData.pixel_resolution || "N/A",
      moduleWeight: modelData.module_weight || "N/A",
      viewingDistance: modelData.best_viewing_distance || "N/A",

      // Video Wall specs
      unitSize: modelData.unit_size_mm || "N/A",
      b2b: modelData.b2b || "N/A",
      resolution: modelData.resolution || "N/A",
      contrastRatio: modelData.contrast_ratio || "N/A",

      processor: processorData,
      roomImageUrl: null,
    };
  },
}));
