import React, { useState } from "react";
import { X, Download } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { UseExportStore } from "../store/UseExportStore";
import { PDFDocument } from "./export/PDFDocument";

export const ExportModal = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  const {
    isOpen,
    pdfTitle,
    projectName,
    userName,
    email,
    setPdfTitle,
    setProjectName,
    setUserName,
    setEmail,
    closeModal,
    exportToPdf,
    completeExport,
    isExporting,
    isFormValid,
    isExportReady,
    pdfData,
  } = UseExportStore();

  const generatePDFManually = async (data) => {
    console.log(">>> Starting manual PDF generation with data:", data);

    try {
      // Generate PDF blob using @react-pdf/renderer
      const blob = await pdf(<PDFDocument data={data} />).toBlob();
      console.log(">>> PDF blob generated:", blob);

      // Create download link
      const url = URL.createObjectURL(blob);

      // Generate filename
      const timestamp = new Date()
        .toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");

      const filename = `${pdfTitle || "LED-Configuration"}_${timestamp}.pdf`;

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      console.error(">>> Manual PDF generation error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !isExportReady()) {
      alert(
        "Please complete all required fields and configure your display settings"
      );
      return;
    }

    setIsGenerating(true);
    setDebugInfo("Preparing export data...");

    try {
      console.log(">>> Starting PDF export process...");

      // Step 1: Prepare data (sama seperti ExportModalOld)
      const result = await exportToPdf();
      console.log(">>> exportToPdf result:", result);

      if (!result?.success) {
        alert("Failed to prepare export data");
        return;
      }

      setDebugInfo("Waiting for data to be ready...");

      // Step 2: Wait for data to be ready (sama seperti ExportModalOld)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 3: Get final data from store
      const currentState = UseExportStore.getState();
      const finalData = currentState.pdfData;

      console.log(">>> Final pdfData:", finalData);

      if (!finalData) {
        // Try direct data as fallback
        const directData = currentState.getPdfExportData();
        console.log(">>> Fallback to direct data:", directData);

        if (!directData) {
          alert(
            "No data available for export. Please configure your display first."
          );
          completeExport();
          return;
        }

        // Use direct data
        setDebugInfo("Generating PDF...");
        const pdfResult = await generatePDFManually(directData);

        if (pdfResult.success) {
          alert(`PDF successfully generated: ${pdfResult.filename}`);
          setDebugInfo("✅ PDF generated successfully!");
          completeExport();
        }
        return;
      }

      // Step 4: Generate PDF with store data
      setDebugInfo("Generating PDF...");
      const pdfResult = await generatePDFManually(finalData);

      if (pdfResult.success) {
        alert(`PDF successfully generated: ${pdfResult.filename}`);
        setDebugInfo("✅ PDF generated successfully!");
        completeExport();
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF. Please try again.");
      setDebugInfo(`❌ Error: ${error.message}`);
      completeExport();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCloseModal = () => {
    setDebugInfo("");
    setIsGenerating(false);
    completeExport();
    closeModal();
  };

  const isFormComplete = isFormValid() && isExportReady();
  const isProcessing = isExporting || isGenerating;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-[380px] lg:w-full max-w-xl h-[90vh] max-h-[600px] overflow-hidden">
        <div className="p-6 h-full">
          {/* Header */}
          <div className="flex justify-end">
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              disabled={isProcessing}
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex mb-8 justify-center lg:justify-start">
            <h2 className="text-md lg:text-xl font-normal lg:font-medium text-gray-800">
              Export Calculator Simulation
            </h2>
          </div>

          {/* Export Ready Status */}
          {!isExportReady() && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-700">
                Please configure your display settings before exporting.
              </p>
            </div>
          )}

          {/* Debug Info */}
          {debugInfo && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">{debugInfo}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* PDF Title */}
            <div>
              <label className="block font-xs lg:text-sm font-normal lg:font-medium text-gray-700 mb-2">
                PDF Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="ex. Calculator LED P 1.8"
                disabled={isProcessing}
                className="w-full px-3 py-3 border border-gray-300 text-sm font-light lg:font-light rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Project Name */}
            <div>
              <label className="block font-xs lg:text-sm font-normal lg:font-medium text-gray-700 mb-2">
                Project Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="ex. Building Project"
                disabled={isProcessing}
                className="w-full px-3 py-3 border border-gray-300 text-sm font-light lg:font-light rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Your Name */}
            <div>
              <label className="block font-xs lg:text-sm font-normal lg:font-medium text-gray-700 mb-2">
                Your Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="ex. Daniel Samantha"
                disabled={isProcessing}
                className="w-full px-3 py-3 border border-gray-300 text-sm font-light lg:font-light rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-xs lg:text-sm font-normal lg:font-medium text-gray-700 mb-2">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex. samantha@mj.com"
                disabled={isProcessing}
                className="w-full px-3 py-3 border border-gray-300 text-sm font-light lg:font-light rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete || isProcessing}
                className={`font-medium py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center cursor-pointer gap-2 ${
                  isFormComplete && !isProcessing
                    ? "bg-[#3AAFA9] hover:bg-[#2d8680] text-white shadow-md hover:shadow-lg"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {isGenerating ? "Generating..." : "Preparing..."}
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
