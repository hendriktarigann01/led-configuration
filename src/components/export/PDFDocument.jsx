import React from "react";
import { Document } from "@react-pdf/renderer";
import { FirstPage } from "./FirstPage";
import { ModelPage } from "./ModelPage";
import { IndoorOutdoorConfig } from "./spec-config/IndoorOutdoor";
import { VideoWallConfig } from "./spec-config/VideoWall";
import { Indoor } from "./spec-default/Indoor";
import { Outdoor } from "./spec-default/Outdoor";
import { VideoWall } from "./spec-default/VideoWall";
import { LastPage } from "./LastPage";

export const PDFDocument = ({ data }) => {
  console.log(">>> PDFDocument rendering with data:", data);
  console.log(">>> Data keys:", data ? Object.keys(data) : "No data");

  if (!data) {
    console.log(">>> PDFDocument: No data provided");
    return null;
  }

  // Log specific data sections for debugging
  console.log(">>> calculations:", data.calculations);
  console.log(">>> screenConfig:", data.screenConfig);
  console.log(">>> wallConfig:", data.wallConfig);
  console.log(">>> components:", data.components);
  console.log(">>> displayType:", data.displayType);

  const { components } = data;
  console.log(">>> PDFDocument components:", components);

  // Dynamic component selection dengan fallback yang lebih robust
  const SpecConfigComponent = (() => {
    if (components?.specConfig === "VideoWallConfig") {
      console.log(">>> Selected VideoWallConfig");
      return VideoWallConfig;
    } else {
      console.log(">>> Selected IndoorOutdoorConfig (default)");
      return IndoorOutdoorConfig;
    }
  })();

  const SpecDefaultComponent = (() => {
    if (components?.specDefault === "VideoWall") {
      console.log(">>> Selected VideoWall spec default");
      return VideoWall;
    } else if (components?.specDefault === "Outdoor") {
      console.log(">>> Selected Outdoor spec default");
      return Outdoor;
    } else {
      console.log(">>> Selected Indoor spec default (default)");
      return Indoor;
    }
  })();

  console.log(">>> Final selected components:", {
    SpecConfigComponent: SpecConfigComponent?.name || "Unknown",
    SpecDefaultComponent: SpecDefaultComponent?.name || "Unknown",
  });

  // Validate critical data before rendering
  const hasValidData =
    data && (data.calculations || data.screenConfig || data.displayType);
  if (!hasValidData) {
    console.warn(">>> PDFDocument: Missing critical data, using defaults");
  }

  return (
    <Document
      title={data.pdfTitle || "LED Configuration"}
      author="MJ Solution Indonesia"
      subject="LED Display Configuration Report"
      keywords="LED, Display, Configuration, MJ Solution"
    >
      {/* Page 1: First Page */}
      <FirstPage data={data} />

      {/* Page 2: Model Page */}
      <ModelPage data={data} />

      {/* Page 3: Spec Config */}
      <SpecConfigComponent data={data} />

      {/* Page 4: Spec Default */}
      <SpecDefaultComponent data={data} />

      {/* Page 5: Last Page */}
      <LastPage data={data} />
    </Document>
  );
};
