// components/export/PDFExportLayout.jsx (Fixed)
import React, { forwardRef } from "react";
import { FirstPage } from "./FirstPage";
import { ModelPage } from "./ModelPage";
import { IndoorOutdoorConfig } from "./spec-config/IndoorOutdoor";
import { VideoWallConfig } from "./spec-config/VideoWall";
import { Indoor } from "./spec-default/Indoor";
import { Outdoor } from "./spec-default/Outdoor";
import { VideoWall } from "./spec-default/VideoWall";
import { LastPage } from "./LastPage";

export const PDFExportLayout = forwardRef(({ data }, ref) => {
  console.log(">>> PDFExportLayout rendering with data:", data);

  if (!data) {
    console.log(">>> PDFExportLayout: No data provided");
    return null;
  }

  const { components } = data;
  console.log(">>> PDFExportLayout components:", components);

  // Dynamic component selection
  const SpecConfigComponent =
    components?.specConfig === "VideoWallConfig"
      ? VideoWallConfig
      : IndoorOutdoorConfig;

  const SpecDefaultComponent =
    components?.specDefault === "VideoWall"
      ? VideoWall
      : components?.specDefault === "Outdoor"
      ? Outdoor
      : Indoor;

  console.log(">>> Selected components:", {
    SpecConfigComponent: SpecConfigComponent?.name || "Unknown",
    SpecDefaultComponent: SpecDefaultComponent?.name || "Unknown",
  });

  return (
    <div ref={ref} className="bg-gray-100 min-h-screen">
      {/* Page 1: First Page */}
      <div
        className="page-break max-w-4xl mx-auto"
        style={{
          position: "relative",
          backgroundColor: "white",
          pageBreakAfter: "always",
          pageBreakInside: "avoid",
          minHeight: "297mm", // A4 height
          width: "210mm", // A4 width
        }}
      >
        <FirstPage data={data} />
      </div>

      {/* Page 2: Model Page */}
      <div
        className="page-break max-w-4xl mx-auto"
        style={{
          position: "relative",
          backgroundColor: "white",
          pageBreakAfter: "always",
          pageBreakInside: "avoid",
          minHeight: "297mm",
          width: "210mm",
        }}
      >
        <ModelPage data={data} />
      </div>

      {/* Page 3: Spec Config */}
      <div
        className="page-break max-w-4xl mx-auto"
        style={{
          position: "relative",
          backgroundColor: "white",
          pageBreakAfter: "always",
          pageBreakInside: "avoid",
          minHeight: "297mm",
          width: "210mm",
        }}
      >
        <SpecConfigComponent data={data} />
      </div>

      {/* Page 4: Spec Default */}
      <div
        className="page-break max-w-4xl mx-auto"
        style={{
          position: "relative",
          backgroundColor: "white",
          pageBreakAfter: "always",
          pageBreakInside: "avoid",
          minHeight: "297mm",
          width: "210mm",
        }}
      >
        <SpecDefaultComponent data={data} />
      </div>

      {/* Page 5: Last Page */}
      <div
        className="page-break max-w-4xl mx-auto"
        style={{
          position: "relative",
          backgroundColor: "white",
          pageBreakAfter: "avoid",
          pageBreakInside: "avoid",
          minHeight: "297mm",
          width: "210mm",
        }}
      >
        <LastPage data={data} />
      </div>

      {/* CSS untuk memastikan rendering yang konsisten dengan LayoutPDF */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Base styles yang sama dengan LayoutPDF */
          .page-break {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            background: white !important;
            color: #000 !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          .page-break * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: inherit !important;
          }

          /* Table styling untuk memastikan konsistensi */
          .page-break table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 0.75rem !important; /* text-xs equivalent */
            border: 1px solid #e5e7eb !important; /* border-gray-200 */
          }

          .page-break td, .page-break th {
            border: 1px solid #e5e7eb !important; /* border-gray-200 */
            padding: 10px 16px !important; /* px-4 py-2.5 equivalent */
            vertical-align: middle !important;
            font-size: 0.75rem !important;
            line-height: 1.25 !important;
          }

          .page-break td:first-child {
            width: 160px !important; /* w-40 equivalent */
            font-weight: 600 !important;
            color: #374151 !important; /* text-gray-700 */
            background-color: white !important;
          }

          .page-break td:not(:first-child) {
            color: #4b5563 !important; /* text-gray-600 */
          }

          /* Responsive adjustments untuk PDF export */
          @media print {
            .page-break {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              min-height: 297mm !important;
            }
          }

          /* Tambahan styling untuk memastikan layout yang benar */
          .page-break .overflow-hidden {
            overflow: visible !important;
          }

          .page-break .z-1 {
            z-index: 1 !important;
          }

          /* Styling untuk logo dan footer */
          .page-break .absolute {
            position: absolute !important;
          }

          .page-break .top-6 {
            top: 1.5rem !important;
          }

          .page-break .right-8 {
            right: 2rem !important;
          }

          .page-break .bottom-6 {
            bottom: 1.5rem !important;
          }

          .page-break .left-8 {
            left: 2rem !important;
          }

          /* Padding untuk content */
          .page-break .px-16 {
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .page-break .py-20 {
            padding-top: 5rem !important;
            padding-bottom: 5rem !important;
          }

          /* Styling untuk dots dan title */
          .page-break .w-2 {
            width: 0.5rem !important;
          }

          .page-break .h-2 {
            height: 0.5rem !important;
          }

          .page-break .rounded-full {
            border-radius: 9999px !important;
          }
        `,
        }}
      />
    </div>
  );
});

// Set display name for debugging
PDFExportLayout.displayName = "PDFExportLayout";