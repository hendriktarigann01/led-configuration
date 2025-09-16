import React, { useState, useEffect } from "react";
import { X, Download, CircleAlert } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { UseExportStore } from "../store/UseExportStore";
import { PDFDocument } from "./export/PDFDocument";

export const ExportModal = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    isOpen,
    projectName,
    userName,
    phoneNumber,
    email,
    setProjectName,
    setUserName,
    setPhoneNumber,
    setEmail,
    closeModal,
    exportToPdf,
    completeExport,
    isExporting,
    isFormValid,
    isExportReady,
    generatePdfTitle,
  } = UseExportStore();

  const waitForDataReady = (timeoutMs = 10000) => {
    return Promise.race([
      new Promise((resolve) => {
        const checkData = () => {
          const state = UseExportStore.getState();
          if (state.pdfData?.displays) {
            resolve(state.pdfData);
          } else {
            setTimeout(checkData, 100);
          }
        };
        checkData();
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Data loading timeout")), timeoutMs)
      ),
    ]);
  };

  const generatePDF = async (data) => {
    const blob = await pdf(<PDFDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    const filename = `${generatePdfTitle()}.pdf`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { success: true, filename };
  };

  const getFallbackData = () => {
    const state = UseExportStore.getState();
    return state.getPdfExportData?.() || null;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !isExportReady()) {
      alert(
        "Please complete all required fields and configure your display settings"
      );
      return;
    }

    setIsGenerating(true);

    try {
      const result = await exportToPdf();
      if (!result?.success) {
        throw new Error("Failed to prepare export data");
      }

      let finalData;
      try {
        finalData = await waitForDataReady();
      } catch (waitError) {
        finalData = getFallbackData();
        if (!finalData) {
          throw new Error(
            "No data available for export. Please configure your display first."
          );
        }
      }

      const pdfResult = await generatePDF(finalData);

      if (pdfResult.success) {
        alert(`PDF successfully generated: ${pdfResult.filename}`);
      }
    } catch (error) {
      alert(`Failed to export PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
      completeExport();
    }
  };

  const handleCloseModal = () => {
    setIsGenerating(false);
    completeExport();
    closeModal();
  };

  const isFormComplete = isFormValid() && isExportReady();
  const isProcessing = isExporting || isGenerating;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-[380px] lg:w-full max-w-xl max-h-[90vh] overflow-y-auto">
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

          <div className="flex mb-3 lg:mb-6 justify-center lg:justify-start">
            <h2 className="text-md lg:text-xl font-normal lg:font-medium text-gray-800">
              Export Calculator Simulation
            </h2>
          </div>

          {/* Export Ready Status */}
          {!isExportReady() && (
            <div className="mb-3 lg:mb-6 p-3 flex gap-2 bg-orange-50 border border-orange-200 rounded-md">
              <CircleAlert className="text-sm  text-orange-700" />
              <p className="text-sm font-medium my-auto text-orange-700">
                Please configure your display settings before exporting.
              </p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-2 lg:space-y-5">
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

            {/* Phone Number */}
            <div>
              <label className="block font-xs lg:text-sm font-normal lg:font-medium text-gray-700 mb-2">
                Phone Number<span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="ex. 0867xxxxxxxx"
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
            <div className="pt-4  lg:pt-1 flex justify-center">
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
