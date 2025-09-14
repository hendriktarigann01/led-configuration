// // utils/PDFDataMapper.jsx - Utility untuk mapping data dari store ke format PDF
// export class PDFDataMapper {
//   static mapToPDFData(storeData, formData) {
//     const now = new Date();
//     const exportDate = now.toLocaleDateString("id-ID", {
//       timeZone: "Asia/Jakarta",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     });

//     return {
//       // Form data dari ExportModal
//       pdfTitle: formData.pdfTitle,
//       projectName: formData.projectName,
//       userName: formData.userName,
//       email: formData.email,
//       exportDate,

//       // Display configuration
//       displayType: storeData.displayType || "Indoor LED Fixed",
//       pixelPitch: storeData.pixelPitch || "P 1.86",
//       inch: storeData.inch,

//       // Screen configuration
//       screenConfig: this.formatScreenConfig(storeData.screenConfig),
//       numberOfScreens: this.formatNumberOfScreens(
//         storeData.calculations?.unitCount
//       ),
//       dimensions: this.formatDimensions(storeData.screenConfig),
//       displayArea: this.formatDisplayArea(storeData.screenConfig),

//       // Power requirements
//       maxPower: this.formatPower(storeData.calculations?.power),

//       // Detailed specifications (sesuaikan dengan data yang tersedia)
//       unitSize: this.formatUnitSize(storeData.screenConfig),
//       brightness: storeData.brightness || "500 cd/m2",
//       resolution: this.formatResolution(storeData.screenConfig),
//       contrastRatio: storeData.contrastRatio || "4000",
//       aspectRatio: this.calculateAspectRatio(storeData.screenConfig),
//       displayColor: storeData.displayColor || "8 bit / 16.7 M",
//       colorGamut: storeData.colorGamut || "72%",
//       responseTime: storeData.responseTime || "8 ms",
//       viewingAngle: storeData.viewingAngle || "178 (H) / 178 (V)",
//       hScanningFreq: storeData.hScanningFreq || "30 kHz ~ 83 kHz",
//       vScanningFreq: storeData.vScanningFreq || "48Hz ~ 75Hz",
//       audioInOut: storeData.audioInOut || "Stereo Mini Jack",
//       videoIn: storeData.videoIn || "HDMI1, HDMI2",
//       powerSupply: storeData.powerSupply || "AC 100 ~ 240 V / 50 ~ 60 Hz",
//       powerConsumption: this.formatPowerConsumption(
//         storeData.calculations?.power
//       ),
//       standbyPower: storeData.standbyPower || "1W",
//       operationTemp: storeData.operationTemp || "0 ~ 40 °C",
//       storageTemp: storeData.storageTemp || "-20 ~ 65 °C",
//       operation: storeData.operation || "24/7",

//       // Canvas/rendering data (jika tersedia)
//       canvasImageUrl: storeData.canvasImageUrl, // Jika Anda punya screenshot canvas
//       selectedContent: storeData.selectedContent,
//       customImageUrl: storeData.customImageUrl,
//       roomImageUrl: storeData.roomImageUrl,

//       // Wall configuration
//       wallConfig: storeData.wallConfig,
//       calculations: storeData.calculations,

//       // Additional metadata
//       showDetailedSpecs: true, // Control untuk menampilkan halaman detail spec
//     };
//   }

//   static formatScreenConfig(screenConfig) {
//     if (!screenConfig) return "1 x 1";
//     const width = Math.round(parseFloat(screenConfig.width) || 1);
//     const height = Math.round(parseFloat(screenConfig.height) || 1);
//     return `${width} x ${height}`;
//   }

//   static formatNumberOfScreens(unitCount) {
//     if (!unitCount) return "1 pcs";
//     const total = (unitCount.horizontal || 1) * (unitCount.vertical || 1);
//     return `${total} pcs`;
//   }

//   static formatDimensions(screenConfig) {
//     if (!screenConfig) return "120 (L) x 60 (W) x 54 (D)";

//     const width = parseFloat(screenConfig.width) || 120;
//     const height = parseFloat(screenConfig.height) || 60;
//     const depth = parseFloat(screenConfig.depth) || 54;

//     return `${Math.round(width * 100)} (L) x ${Math.round(
//       height * 100
//     )} (W) x ${Math.round(depth)} (D)`;
//   }

//   static formatDisplayArea(screenConfig) {
//     if (!screenConfig) return "0.01 m²";

//     const width = parseFloat(screenConfig.width) || 1.2;
//     const height = parseFloat(screenConfig.height) || 0.6;
//     const area = width * height;

//     return `${area.toFixed(2)} m²`;
//   }

//   static formatPower(powerData) {
//     if (!powerData || !powerData.max) return "180 W";
//     return `${Math.round(powerData.max)} W`;
//   }

//   static formatUnitSize(screenConfig) {
//     if (!screenConfig) return "1,075 (W) x 605 (H) x 54 (D)";

//     const width = Math.round((parseFloat(screenConfig.width) || 1.075) * 1000);
//     const height = Math.round(
//       (parseFloat(screenConfig.height) || 0.605) * 1000
//     );
//     const depth = Math.round((parseFloat(screenConfig.depth) || 0.054) * 1000);

//     return `${width.toLocaleString()} (W) x ${height.toLocaleString()} (H) x ${depth} (D)`;
//   }

//   static formatResolution(screenConfig) {
//     // Ini bisa disesuaikan dengan data resolusi yang actual
//     if (!screenConfig) return "FHD 1920 x 1080";

//     // Jika ada data resolusi dari screenConfig, gunakan itu
//     if (screenConfig.resolution) {
//       return screenConfig.resolution;
//     }

//     // Default berdasarkan size
//     return "FHD 1920 x 1080";
//   }

//   static calculateAspectRatio(screenConfig) {
//     if (!screenConfig) return "16:9";

//     const width = parseFloat(screenConfig.width) || 16;
//     const height = parseFloat(screenConfig.height) || 9;

//     // Hitung GCD untuk mendapatkan ratio
//     const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
//     const divisor = gcd(Math.round(width * 10), Math.round(height * 10));

//     const ratioWidth = Math.round(width * 10) / divisor;
//     const ratioHeight = Math.round(height * 10) / divisor;

//     return `${ratioWidth}:${ratioHeight}`;
//   }

//   static formatPowerConsumption(powerData) {
//     if (!powerData || !powerData.max) return "≤180 W";
//     return `≤${Math.round(powerData.max)} W`;
//   }

//   // Helper method untuk validasi data
//   static validatePDFData(data) {
//     const required = ["pdfTitle", "projectName", "userName", "email"];
//     const missing = required.filter(
//       (field) => !data[field] || data[field].trim() === ""
//     );

//     if (missing.length > 0) {
//       throw new Error(`Missing required fields: ${missing.join(", ")}`);
//     }

//     return true;
//   }

//   // Helper method untuk membuat preview data
//   static createPreviewData() {
//     return {
//       pdfTitle: "LED Display Configuration Preview",
//       projectName: "Sample Project",
//       userName: "Preview User",
//       email: "preview@mjsolution.co.id",
//       exportDate: new Date().toLocaleDateString("id-ID"),
//       displayType: "Indoor LED Fixed",
//       pixelPitch: "P 1.86",
//       screenConfig: "2 x 2",
//       numberOfScreens: "4 pcs",
//       dimensions: "240 (L) x 120 (W) x 54 (D)",
//       displayArea: "2.88 m²",
//       maxPower: "720 W",
//       showDetailedSpecs: true,
//     };
//   }
// }
