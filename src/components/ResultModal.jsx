import React from "react";
import { X, Download } from "lucide-react";
import { UseExportStore } from "../store/UseExportStore";

export const ExportModal = () => {
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
    isExporting,
    isFormValid,
  } = UseExportStore();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields correctly");
      return;
    }
    exportToPdf();
  };

  const isFormComplete = isFormValid();

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl h-[90vh] max-h-[600px] overflow-hidden">
        <div className="p-6 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-medium text-gray-800">
              Export Calculator Simulation
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isExporting}
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* PDF Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="ex. Calculator LED P 1.8"
                disabled={isExporting}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="ex. Building Project"
                disabled={isExporting}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Your Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="ex. Daniel Samantha"
                disabled={isExporting}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex. samantha@mj.com"
                disabled={isExporting}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!isFormComplete || isExporting}
                className={`w-40 font-medium py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormComplete && !isExporting
                    ? "bg-[#3AAFA9] hover:bg-[#2d8680] text-white shadow-md hover:shadow-lg"
                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Export to PDF
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
