import React from "react";
import { BasePage } from "./BasePage";
import { CanvasUtils } from "../utils/CanvasUtils";

export const ModelPage = ({ data }) => {
  // Get the appropriate product image based on display type
  const getProductImage = () => {
    if (!data) return "/product/model/indoor.svg";

    if (data.displayType.includes("Video Wall")) {
      return "/product/model/video_wall.svg";
    } else if (data.displayType.includes("Outdoor")) {
      return "/product/model/outdoor.svg";
    } else {
      return "/product/model/indoor.svg";
    }
  };

  const getDisplayTitle = () => {
    if (!data) return "Indoor Cabinet Fixed";

    if (data.displayType.includes("Video Wall")) {
      return "Video Wall";
    } else if (data.displayType.includes("Outdoor")) {
      return "Outdoor LED Display";
    } else {
      return "Indoor LED Display";
    }
  };

  const getPixelPitch = () => {
    if (!data) return "P 1.8";

    if (data.pixelPitch) {
      return `${data.pixelPitch}`;
    }

    if (data.inch) {
      return `${data.inch}"`;
    }

    return "1.8";
  };

  // Calculate all dimensions using utility functions
  const calculateCanvasData = () => {
    // Default fallback values
    const defaultData = {
      imageWidth: 256,
      imageHeight: 144,
      isVideo: false,
      contentSource: "/canvas/canvas-bg.webp",
      effectiveCanvasWidth: 475,
      effectiveCanvasHeight: 270,
      horizontalMeasureLength: 256,
      verticalMeasureLength: 144,
      remainingWallHeight: 1.5,
      remainingWallWidth: 1.5,
      finalHumanHeight: 144,
      humanToWallRatio: 0.57,
      actualScreenSize: { width: 1, height: 1 },
      cabinetCount: { horizontal: 1, vertical: 1 },
      wallWidth: 5,
      wallHeight: 3,
      roomImageUrl: null,
    };

    if (!data || !data.calculations || !data.calculations.unitCount) {
      return defaultData;
    }

    // Extract data with fallbacks
    const wallWidth = parseFloat(data.wallConfig?.width) || 5;
    const wallHeight = parseFloat(data.wallConfig?.height) || 3;
    const screenWidth = parseFloat(data.screenConfig?.width) || 1;
    const screenHeight = parseFloat(data.screenConfig?.height) || 1;
    const selectedContent = data.selectedContent || "Default Image";
    const customImageUrl = data.customImageUrl;
    const roomImageUrl = data.roomImageUrl;

    // Calculate actual screen size (from calculations)
    const actualScreenSize = {
      width: screenWidth,
      height: screenHeight,
    };

    // Use utility functions to calculate dimensions
    const { effectiveCanvasWidth, effectiveCanvasHeight } =
      CanvasUtils.getCanvasDimensions(
        wallWidth,
        wallHeight,
        475, // ModelPage container width
        270 // ModelPage container height
      );

    const { imageWidth, imageHeight } = CanvasUtils.getImageDimensions(
      actualScreenSize,
      wallWidth,
      wallHeight,
      effectiveCanvasWidth,
      effectiveCanvasHeight
    );

    const measurementValues = CanvasUtils.getMeasurementValues(
      actualScreenSize,
      wallWidth,
      wallHeight,
      imageWidth,
      imageHeight,
      effectiveCanvasWidth,
      effectiveCanvasHeight
    );

    const { finalHumanHeight, humanToWallRatio } =
      CanvasUtils.getHumanDimensions(wallHeight);

    const contentSource = data?.selectedContent
      ? CanvasUtils.getContentSource(data.selectedContent, data.customImageUrl)
      : "/canvas/canvas-bg.webp";
    console.log("ModelPage contentSource:", contentSource);
    console.log("ModelPage selectedContent:", selectedContent);
    const isVideo = selectedContent === "Default Video";

    return {
      imageWidth,
      imageHeight,
      isVideo,
      contentSource,
      effectiveCanvasWidth,
      effectiveCanvasHeight,
      ...measurementValues,
      finalHumanHeight,
      humanToWallRatio,
      actualScreenSize,
      wallWidth,
      wallHeight,
      roomImageUrl,
      cabinetCount: data.calculations.unitCount || {
        horizontal: 1,
        vertical: 1,
      },
    };
  };

  const canvasData = calculateCanvasData();

  // Render video content with all measurements and overlays
  const renderVideoContent = () => (
    <div className="relative inline-block">
      <video
        src={canvasData.contentSource}
        autoPlay
        loop
        muted
        style={{
          width: `${canvasData.imageWidth}px`,
          height: `${canvasData.imageHeight}px`,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        className="object-cover z-20"
      />
      {CanvasUtils.renderMeasurementLines(
        canvasData.horizontalMeasureLength,
        canvasData.verticalMeasureLength
      )}
    </div>
  );

  // Render image content with all measurements and overlays
  const renderImageContent = () => (
    <div className="relative inline-block">
      <div
        className="relative"
        style={{
          width: `${canvasData.imageWidth}px`,
          height: `${canvasData.imageHeight}px`,
        }}
      >
        <img
          src={canvasData.contentSource}
          alt="Canvas Preview"
          className="object-fill w-full h-full z-20"
        />
        {CanvasUtils.renderBezelOverlay(canvasData.cabinetCount)}
      </div>
      {CanvasUtils.renderMeasurementLines(
        canvasData.horizontalMeasureLength,
        canvasData.verticalMeasureLength
      )}
    </div>
  );

  // Render the complete canvas with all elements
  const renderCompleteCanvas = () => (
    <div className="relative w-[650px] h-[370px] z-[99] mx-auto flex justify-center items-center overflow-hidden">
      {/* Main Canvas Container */}
      <div
        className="w-[550px] h-[300px] border border-gray-300 p-5 flex items-center justify-center z-20"
        style={{
          ...(canvasData.roomImageUrl && {
            backgroundImage: `url(${canvasData.roomImageUrl})`,
          }),
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: canvasData.roomImageUrl ? "transparent" : "white",
        }}
      >
        {canvasData.isVideo ? renderVideoContent() : renderImageContent()}
      </div>

      {/* Canvas to Wall Measurements */}
      {CanvasUtils.renderCanvasToWallMeasurements(
        canvasData.effectiveCanvasWidth,
        canvasData.effectiveCanvasHeight
      )}

      {/* Wall Measurements - Centered between lines */}
      {CanvasUtils.renderWallMeasurements(
        canvasData.remainingWallHeight,
        canvasData.remainingWallWidth
      )}

      {/* Screen Dimension Labels - Centered */}
      {CanvasUtils.renderScreenDimensionLabels(
        canvasData.actualScreenSize,
        true
      )}

      {/* Human Silhouette */}
      {CanvasUtils.renderHumanSilhouette(
        canvasData.finalHumanHeight,
        canvasData.humanToWallRatio
      )}
    </div>
  );

  return (
    <BasePage>
      {/* Logo */}
      <div className="absolute top-6 right-8">
        <img
          src="/logo/mjs_logo_text.png"
          alt="logo-mjs"
          className="w-auto h-10"
        />
      </div>

      {/* Main Content */}
      <div className="px-16 py-40">
        <div className="text-center mb-5">
          <div
            className="text-gray-700 flex items-center justify-center space-x-4 h-10 p-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem", // fallback untuk space-x-4
              height: "2.5rem", // fallback h-10
              padding: "0.5rem", // fallback p-2
              color: "#374151", // fallback text-gray-700
            }}
          >
            {/* Dots kiri */}
            <div
              className="flex space-x-1"
              style={{ display: "flex", gap: "0.25rem" }}
            >
              <div
                className="w-2 h-2 bg-[#2A7A78] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#2A7A78",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#3AAFA9] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3AAFA9",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#E0F2F0] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#E0F2F0",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>

            {/* Title */}
            <p
              className="font-medium text-lg leading-none flex items-center"
              style={{
                fontWeight: 500,
                fontSize: "1.125rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              Model
            </p>

            {/* Dots kanan */}
            <div
              className="flex space-x-1"
              style={{ display: "flex", gap: "0.25rem" }}
            >
              <div
                className="w-2 h-2 bg-[#E0F2F0] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#E0F2F0",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#3AAFA9] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3AAFA9",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#2A7A78] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#2A7A78",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center w-[550px] h-[300px] justify-center mx-auto mb-5">
          <div className="rounded-lg m-8 flex items-center justify-center">
            <div className="text-center">
              <img src={getProductImage()} alt="product" className="w-72" />
            </div>
          </div>
          <div className="text-left">
            <div className="text-xl font-light text-gray-600 mb-5">
              {getDisplayTitle()}
            </div>
            <div className="text-2xl text-gray-700">{getPixelPitch()}</div>
          </div>
        </div>

        <div className="mb-20">
          <div
            className="text-gray-700 flex items-center justify-center space-x-4 h-10 p-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem", // fallback untuk space-x-4
              height: "2.5rem", // fallback h-10
              padding: "0.5rem", // fallback p-2
              color: "#374151", // fallback text-gray-700
            }}
          >
            {/* Dots kiri */}
            <div
              className="flex space-x-1"
              style={{ display: "flex", gap: "0.25rem" }}
            >
              <div
                className="w-2 h-2 bg-[#2A7A78] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#2A7A78",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#3AAFA9] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3AAFA9",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#E0F2F0] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#E0F2F0",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>

            {/* Title */}
            <p
              className="font-medium text-lg leading-none flex items-center"
              style={{
                fontWeight: 500,
                fontSize: "1.125rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              Led Configuration Rendering
            </p>

            {/* Dots kanan */}
            <div
              className="flex space-x-1"
              style={{ display: "flex", gap: "0.25rem" }}
            >
              <div
                className="w-2 h-2 bg-[#E0F2F0] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#E0F2F0",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#3AAFA9] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3AAFA9",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#2A7A78] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#2A7A78",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>
          </div>
          {/* Complete Canvas Container Export */}
          <div className="relative my-5">{renderCompleteCanvas()}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-8 text-[10px] space-y-2 text-gray-600">
        <div className="font-semibold">MJ Solution Indonesia</div>
        <p>
          The Mansion Bougenville Kemayoran Tower Fontana Zona I Lantai 50
          Kemayoran Jakarta Utara
        </p>
        <div className="flex items-center space-x-4">
          {/* Website */}
          <div className="inline-flex items-center space-x-1">
            <img
              src="/icons/icon-web.svg"
              className="w-4 h-4 relative top-[1px]"
              alt="web"
            />
            <span className="leading-[1]">mjsolution.co.id</span>
          </div>

          {/* Phone */}
          <div className="inline-flex items-center space-x-1">
            <img
              src="/icons/icon-call.svg"
              className="w-4 h-4 relative top-[1px]"
              alt="phone"
            />
            <span className="leading-[1]">(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </BasePage>
  );
};
