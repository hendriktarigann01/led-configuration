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
      </div>
    );
  });

  // Set display name for debugging
  PDFExportLayout.displayName = "PDFExportLayout";
