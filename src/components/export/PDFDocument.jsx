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
import { PDF_METADATA } from "../../constants/PDFConfig";

const getSpecConfigComponent = (componentName) => {
  const mapping = {
    VideoWallConfig: VideoWallConfig,
    IndoorOutdoorConfig: IndoorOutdoorConfig,
  };
  
  return mapping[componentName] || IndoorOutdoorConfig;
};

const getSpecDefaultComponent = (componentName) => {
  const mapping = {
    VideoWall: VideoWall,
    Outdoor: Outdoor,
    Indoor: Indoor,
  };
  
  return mapping[componentName] || Indoor;
};

const validateData = (data) => {
  return data && (data.calculations || data.screenConfig || data.displayType);
};

export const PDFDocument = ({ data }) => {
  if (!data) {
    console.warn("PDFDocument: No data provided");
    return null;
  }

  if (!validateData(data)) {
    console.warn("PDFDocument: Missing critical data, using defaults");
  }

  const SpecConfigComponent = getSpecConfigComponent(data?.components?.specConfig);
  const SpecDefaultComponent = getSpecDefaultComponent(data?.components?.specDefault);

  return (
    <Document
      title={data.pdfTitle || "LED Configuration"}
      author={PDF_METADATA.author}
      subject={PDF_METADATA.subject}
      keywords={PDF_METADATA.keywords}
    >
      <FirstPage data={data} />
      <ModelPage data={data} />
      <SpecConfigComponent data={data} />
      <SpecDefaultComponent data={data} />
      <LastPage />
    </Document>
  );
};