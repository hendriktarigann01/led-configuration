import React, { useRef, useState } from "react";
import { X, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { UseExportStore } from "../store/UseExportStore";
import { PDFExportLayout } from "./export/PDFExportLayout";

export const ExportModal = () => {
  const pdfRef = useRef(null);
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

  // Helper function to convert modern CSS colors to safe colors
  const convertToSafeColor = (colorValue, defaultColor) => {
    if (
      !colorValue ||
      colorValue === "rgba(0, 0, 0, 0)" ||
      colorValue === "transparent"
    ) {
      return defaultColor;
    }

    // Handle oklch colors
    if (colorValue.includes("oklch")) {
      return defaultColor;
    }

    // Handle oklab colors
    if (colorValue.includes("oklab")) {
      return defaultColor;
    }

    // Handle other modern color functions that might cause issues
    if (
      colorValue.includes("color(") ||
      colorValue.includes("lch(") ||
      colorValue.includes("lab(")
    ) {
      return defaultColor;
    }

    return colorValue;
  };

  const generatePDFFromHTML = async () => {
    if (!pdfRef.current) {
      throw new Error("PDF content not ready");
    }

    setIsGenerating(true);
    setDebugInfo("Starting PDF generation...");

    try {
      console.log(">>> pdfRef.current:", pdfRef.current);

      // First, make the PDF container visible temporarily for capturing
      const container = pdfRef.current;
      const originalStyles = {
        position: container.style.position,
        visibility: container.style.visibility,
        left: container.style.left,
        top: container.style.top,
      };

      // Temporarily make it visible but off-screen
      container.style.position = "fixed";
      container.style.visibility = "visible";
      container.style.left = "-9999px";
      container.style.top = "0px";
      container.style.zIndex = "9999";

      // Get all page elements
      const pages = container.querySelectorAll(".page-break");
      console.log(">>> Found pages:", pages.length);

      if (pages.length === 0) {
        setDebugInfo("ERROR: No pages found!");
        throw new Error("No pages found to export");
      }

      setDebugInfo(`Found ${pages.length} pages, creating PDF...`);

      // Create PDF with A4 size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];

        setDebugInfo(`Processing page ${i + 1}/${pages.length}...`);
        console.log(`>>> Processing page ${i + 1}:`, page);

        // Hide all other pages
        pages.forEach((p, idx) => {
          if (idx !== i) {
            p.style.display = "none";
          } else {
            p.style.display = "block";
          }
        });

        // Wait for layout to settle
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Force all images to load
        const images = page.querySelectorAll("img");
        await Promise.all(
          Array.from(images).map((img) => {
            return new Promise((resolve) => {
              if (img.complete) {
                resolve();
              } else {
                img.onload = resolve;
                img.onerror = resolve;
                setTimeout(resolve, 1000); // timeout after 1s
              }
            });
          })
        );

        // Capture page with specific settings
        const canvas = await html2canvas(page, {
          scale: 4,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: true,
          width: page.scrollWidth || 794,
          height: page.scrollHeight || 1123,
          scrollX: 0,
          scrollY: 0,
          foreignObjectRendering: false,
          onclone: (clonedDoc) => {
            console.log(">>> Cloning document for page", i + 1);

            // Force all text to be visible
            const allElements = clonedDoc.querySelectorAll("*");
            allElements.forEach((el) => {
              const style = window.getComputedStyle(el);

              // Convert modern CSS colors to safe RGB/hex colors
              if (style.backgroundColor) {
                el.style.backgroundColor = convertToSafeColor(
                  style.backgroundColor,
                  "#ffffff"
                );
              }

              if (style.color) {
                el.style.color = convertToSafeColor(style.color, "#000000");
              }

              if (style.borderColor) {
                el.style.borderColor = convertToSafeColor(
                  style.borderColor,
                  "#cccccc"
                );
              }

              // Handle border colors for all sides
              if (style.borderTopColor) {
                el.style.borderTopColor = convertToSafeColor(
                  style.borderTopColor,
                  "#cccccc"
                );
              }
              if (style.borderRightColor) {
                el.style.borderRightColor = convertToSafeColor(
                  style.borderRightColor,
                  "#cccccc"
                );
              }
              if (style.borderBottomColor) {
                el.style.borderBottomColor = convertToSafeColor(
                  style.borderBottomColor,
                  "#cccccc"
                );
              }
              if (style.borderLeftColor) {
                el.style.borderLeftColor = convertToSafeColor(
                  style.borderLeftColor,
                  "#cccccc"
                );
              }

              // Handle outline color
              if (style.outlineColor) {
                el.style.outlineColor = convertToSafeColor(
                  style.outlineColor,
                  "#cccccc"
                );
              }

              // Ensure text is not transparent
              if (style.opacity === "0" || style.visibility === "hidden") {
                el.style.opacity = "1";
                el.style.visibility = "visible";
              }

              // Force font properties for text elements
              if (
                el.tagName === "DIV" ||
                el.tagName === "SPAN" ||
                el.tagName === "P" ||
                el.tagName === "H1" ||
                el.tagName === "H2" ||
                el.tagName === "H3" ||
                el.tagName === "H4" ||
                el.tagName === "H5" ||
                el.tagName === "H6" ||
                el.tagName === "TD" ||
                el.tagName === "TH"
              ) {
                el.style.fontFamily = "Arial, sans-serif";
                if (!el.style.fontSize) {
                  el.style.fontSize = "14px";
                }
                if (!el.style.lineHeight) {
                  el.style.lineHeight = "1.5";
                }
              }
            });

            console.log(">>> Styling applied to cloned document");
          },
        });

        console.log(`>>> Canvas created for page ${i + 1}:`, {
          width: canvas.width,
          height: canvas.height,
        });

        if (canvas.width === 0 || canvas.height === 0) {
          throw new Error(`Page ${i + 1} has zero dimensions`);
        }

        // Add new page if not first
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate scaling to fit A4
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If height is too big, scale down to fit A4 height
        const maxHeight = 297; // A4 height in mm
        const finalWidth =
          imgHeight > maxHeight
            ? (canvas.width * maxHeight) / canvas.height
            : imgWidth;
        const finalHeight = imgHeight > maxHeight ? maxHeight : imgHeight;

        // Add image to PDF
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(
          imgData,
          "JPEG",
          (210 - finalWidth) / 2,
          0,
          finalWidth,
          finalHeight
        );
      }

      // Restore original styles
      container.style.position = originalStyles.position;
      container.style.visibility = originalStyles.visibility;
      container.style.left = originalStyles.left;
      container.style.top = originalStyles.top;

      // Show all pages again
      pages.forEach((p) => {
        p.style.display = "block";
      });

      const now = new Date();
      const timestamp = now
        .toLocaleDateString("id-ID", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-");

      const filename = `${pdfTitle || "LED-Configuration"}_${timestamp}.pdf`;

      console.log(filename);

      setDebugInfo(`Saving PDF: ${filename}`);
      console.log(`>>> Saving PDF as: ${filename}`);

      // Save PDF
      pdf.save(filename);

      return { success: true, filename };
    } catch (error) {
      console.error(">>> PDF generation error:", error);
      setDebugInfo(`ERROR: ${error.message}`);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid() || !isExportReady()) {
      alert(
        "Please complete all required fields and configure your display settings"
      );
      return;
    }

    try {
      setDebugInfo("Preparing export data...");

      const result = await exportToPdf();
      if (!result?.success) {
        alert("Failed to prepare export data");
        return;
      }

      setDebugInfo("Waiting for content to render...");

      // Wait for React to render the PDF layout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!pdfRef.current) {
        setDebugInfo("Waiting longer for PDF layout...");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (!pdfRef.current) {
          alert("PDF layout failed to render. Please try again.");
          completeExport();
          return;
        }
      }

      // ENHANCED: Wait for images to be ready in the DOM
      setDebugInfo("Waiting for images to load...");
      const imagesReady = await waitForAllImages(pdfRef.current);

      if (!imagesReady) {
        console.warn("Some images may not have loaded properly");
      }

      setDebugInfo("Generating PDF...");
      const pdfResult = await generatePDFFromHTML();

      if (pdfResult.success) {
        alert(`PDF successfully generated: ${pdfResult.filename}`);
        setDebugInfo("✅ PDF generated successfully!");
        completeExport();
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export PDF. Please try again.");
      completeExport();
    }
  };

  const waitForAllImages = async (container) => {
    const basePage = container.querySelector("[data-images-loaded]");
    if (basePage) {
      const isLoaded = basePage.getAttribute("data-images-loaded") === "true";
      if (isLoaded) {
        console.log("✅ All page images pre-loaded");
        return true;
      }
    }

    // Fallback wait
    console.warn("⚠️ Images not pre-loaded, using fallback wait");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return false;
  };

  const isFormComplete = isFormValid() && isExportReady();
  const isProcessing = isExporting || isGenerating;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
        <div className="bg-white rounded-xl shadow-2xl w-[380px] lg:w-full max-w-xl h-[90vh] max-h-[600px] overflow-hidden">
          <div className="p-6 h-full">
            {/* Header */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
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

      {/* Hidden but accessible PDF Layout */}
      {pdfData && (
        <div
          style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#000000",
          }}
        >
          <PDFExportLayout ref={pdfRef} data={pdfData} />
        </div>
      )}
    </>
  );
};
