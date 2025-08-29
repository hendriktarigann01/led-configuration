import React, { useEffect } from "react";
import { CirclePlus, Plus, Minus } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseModalStore } from "../store/UseModalStore";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCalculatorStore } from "../store/UseCalculatorStore";
import { ConfigurationModal } from "./ConfigurationModal";

export const Canvas = () => {
  const {
    canvasWidth,
    canvasHeight,
    screenWidth,
    screenHeight,
    wallWidth,
    wallHeight,
    baseWidth,
    baseHeight,
    reset,
    getCabinetCount,
    getActualScreenSize,
    getImageScale,
    updateModelData,
    isConfigured,
    setScreenSize,
  } = UseCanvasStore();

  const { openModal } = UseModalStore();
  const { selectedModel, selectedContent, customImageUrl, roomImageUrl } =
    UseNavbarStore();
  const { syncWithCanvas } = UseHeaderStore();

  // Update canvas store when model is selected
  useEffect(() => {
    if (selectedModel && selectedModel.modelData) {
      updateModelData(selectedModel.modelData, selectedModel.name);
      // Sync header store with updated canvas values
      setTimeout(() => syncWithCanvas(), 0);
    }
  }, [selectedModel, updateModelData, syncWithCanvas]);

  // Calculate display values
  const cabinetCount = getCabinetCount();
  const actualScreenSize = getActualScreenSize();
  const imageScale = getImageScale();
  const configured = isConfigured();

  // Handle control button actions with proper step calculations
  const handleWidthIncrement = () => {
    if (!configured || baseWidth === 0) return;
    const newWidth = Number((screenWidth + baseWidth).toFixed(3));
    setScreenSize(newWidth, screenHeight);
    syncWithCanvas();
  };

  const handleWidthDecrement = () => {
    if (!configured || baseWidth === 0) return;
    const newWidth = Math.max(
      baseWidth,
      Number((screenWidth - baseWidth).toFixed(3))
    );
    setScreenSize(newWidth, screenHeight);
    syncWithCanvas();
  };

  const handleHeightIncrement = () => {
    if (!configured || baseHeight === 0) return;
    const newHeight = Number((screenHeight + baseHeight).toFixed(3));
    setScreenSize(screenWidth, newHeight);
    syncWithCanvas();
  };

  const handleHeightDecrement = () => {
    if (!configured || baseHeight === 0) return;
    const newHeight = Math.max(
      baseHeight,
      Number((screenHeight - baseHeight).toFixed(3))
    );
    setScreenSize(screenWidth, newHeight);
    syncWithCanvas();
  };

  // Calculate dynamic image and canvas dimensions
  const canvasContainerWidth = 550;
  const canvasContainerHeight = 300;

  // Calculate wall scale (how much of the canvas the wall occupies)
  const maxWallWidth = 10; // maximum wall width in meters for scaling reference
  const maxWallHeight = 6; // maximum wall height in meters for scaling reference

  const wallScaleX = Math.min(1, wallWidth / maxWallWidth);
  const wallScaleY = Math.min(1, wallHeight / maxWallHeight);

  // Wall takes up portion of canvas based on its size
  const effectiveCanvasWidth = canvasContainerWidth * wallScaleX;
  const effectiveCanvasHeight = canvasContainerHeight * wallScaleY;

  // Calculate screen scale relative to wall
  const screenToWallRatioX = actualScreenSize.width / wallWidth;
  const screenToWallRatioY = actualScreenSize.height / wallHeight;

  // Image size is screen size relative to wall, scaled to fit in canvas
  const imageWidth = Math.min(
    effectiveCanvasWidth * screenToWallRatioX,
    effectiveCanvasWidth * 1.5 // max 150% of canvas width
  );
  const imageHeight = Math.min(
    effectiveCanvasHeight * screenToWallRatioY,
    effectiveCanvasHeight * 1.5 // max 150% of canvas height
  );

  // Calculate measurement line lengths based on proportions
  const measurementLineLength = 80; // base length in pixels
  const horizontalMeasureLength = Math.max(imageWidth * 0.5);
  const verticalMeasureLength = Math.max(imageHeight * 0.5);

  // Get content source based on selected content
  const getContentSource = () => {
    switch (selectedContent) {
      case "Default Image":
        return "/canvas/canvas-bg.webp";
      case "Default Video":
        return "/canvas/ringroad-bg.mp4";
      case "No Content":
        return "/canvas/no-content.png";
      case "Custom":
        return customImageUrl || "/canvas/canvas-bg.webp";
      default:
        return "/canvas/canvas-bg.webp";
    }
  };

  const contentSource = getContentSource();
  const isVideo = selectedContent === "Default Video";

  return (
    <>
      <div className="flex-1 bg-gray-100 h-full p-4 flex items-center justify-center">
        {/* Reset Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={reset}
            className="w-[144px] px-4 py-2 text-xs bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Canvas Container */}
        <div className="relative m-auto flex justify-center items-center">
          {configured && selectedModel ? (
            /* Canvas Preview */
            <div className="relative w-[650px] h-[370px] z-10 rounded-lg flex items-center justify-center overflow-hidden">
              <div
                className={`w-[550px] h-[300px] ${
                  roomImageUrl ? "bg-transparent" : "bg-white"
                } p-5 flex items-center justify-center`}
                style={{
                  backgroundImage: roomImageUrl
                    ? `url(${roomImageUrl})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {isVideo ? (
                  <div className="relative inline-block">
                    <video
                      src={contentSource}
                      autoPlay
                      loop
                      muted
                      style={{
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`,
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                      className="object-cover z-20"
                    />
                    {/* Dynamic Video Measurements */}
                    {/* V Top Right Measure Image */}
                    <div
                      className="absolute top-0 right-0 border-l border-dashed h- border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateX(100%) translateY(-80%)",
                        height: `${verticalMeasureLength}px`,
                      }}
                    ></div>

                    {/* V Top Left Measure Image */}
                    <div
                      className="absolute top-0 left-0 border-l border-dashed h- border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateX(-100%) translateY(-80%)",
                        height: `${verticalMeasureLength}px`,
                      }}
                    ></div>

                    {/* H Bottom Right Measure Image */}
                    <div
                      className="absolute bottom-0 right-0 border-t border-dashed w-96 border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateY(100%) translateX(80%)",
                        width: `${horizontalMeasureLength}px`,
                      }}
                    ></div>

                    {/* H Bottom Left Measure Image */}
                    <div
                      className="absolute bottom-0 left-0 border-t border-dashed w-96 border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateY(100%) translateX(-80%)",
                        width: `${horizontalMeasureLength}px`,
                      }}
                    ></div>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <div
                      className="relative"
                      style={{
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`,
                      }}
                    >
                      <img
                        src={contentSource}
                        alt="Canvas Preview"
                        className="object-fill w-full h-full z-10"
                      />

                      {/* Overlay grid */}
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        {/* Vertical lines */}
                        <div className="absolute top-0 bottom-0 left-1/3 border-l-2 border-[#D9D9D9]/40"></div>
                        <div className="absolute top-0 bottom-0 left-2/3 border-l-2 border-[#D9D9D9]/40"></div>

                        {/* Horizontal lines */}
                        <div className="absolute left-0 right-0 top-1/3 border-t-2 border-[#D9D9D9]/40"></div>
                        <div className="absolute left-0 right-0 top-2/3 border-t-2 border-[#D9D9D9]/40"></div>
                      </div>
                    </div>
                    {/* Dynamic Image Measurements */}
                    {/* V Top Right Measure Image */}
                    <div
                      className="absolute top-0 right-0 border-l border-dashed h- border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateX(100%) translateY(-80%)",
                        height: `${verticalMeasureLength}px`,
                      }}
                    ></div>

                    {/* V Top Left Measure Image */}
                    <div
                      className="absolute top-0 left-0 border-l border-dashed h- border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateX(-100%) translateY(-80%)",
                        height: `${verticalMeasureLength}px`,
                      }}
                    ></div>

                    {/* H Bottom Right Measure Image */}
                    <div
                      className="absolute bottom-0 right-0 border-t border-dashed w-96 border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateY(100%) translateX(80%)",
                        width: `${horizontalMeasureLength}px`,
                      }}
                    ></div>

                    {/* H Bottom Left Measure Image */}
                    <div
                      className="absolute bottom-0 left-0 border-t border-dashed w-96 border-teal-400 pointer-events-none"
                      style={{
                        transform: "translateY(100%) translateX(-80%)",
                        width: `${horizontalMeasureLength}px`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Canvas to Wall Measurement Lines */}
              {/* H Bottom Measure Canvas to Wall */}
              <div
                className="absolute -z-10 left-0 border-t border-dashed border-teal-400 pointer-events-none"
                style={{
                  bottom: "36px",
                  transform: "translateX(-75%) translateY(100%)",
                  width: `${effectiveCanvasWidth + 100}px`,
                }}
              ></div>

              {/* V Right Measure Canvas to Wall */}
              <div
                className="absolute -z-10 top-0 border-l border-dashed border-teal-400 pointer-events-none"
                style={{
                  right: "52px",
                  transform: "translateX(100%) translateY(-75%)",
                  height: `${effectiveCanvasHeight + 100}px`,
                }}
              ></div>

              {/* Dynamic Wall Dimension Labels */}
              <div className="absolute left-4 top-[30%] -translate-y-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <span
                  className="text-xs text-gray-700 text-center rotate-180"
                  style={{ writingMode: "vertical-lr" }}
                >
                  {(wallHeight / 2).toFixed(2)} m
                </span>
              </div>

              <div className="absolute left-4 top-[70%] -translate-y-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <span
                  className="text-xs text-gray-700 text-center rotate-180"
                  style={{ writingMode: "vertical-lr" }}
                >
                  {(wallHeight / 2).toFixed(2)} m
                </span>
              </div>

              <div className="absolute top-0 left-1/4 -translate-x-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <span className="text-xs text-gray-700 text-center">
                  {(wallWidth / 2).toFixed(2)} m
                </span>
              </div>

              <div className="absolute top-0 right-1/4 translate-x-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <span className="text-xs text-gray-700 text-center">
                  {(wallWidth / 2).toFixed(2)} m
                </span>
              </div>

              {/* Top controls */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-50">
                <button
                  onClick={handleWidthDecrement}
                  disabled={!configured}
                  className={`flex items-center justify-center text-sm w-5 h-5 border rounded ${
                    configured
                      ? "text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                      : "text-gray-300 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs text-gray-700">
                  {actualScreenSize.width.toFixed(2)} m
                </span>
                <button
                  onClick={handleWidthIncrement}
                  disabled={!configured}
                  className={`flex items-center justify-center text-sm w-5 h-5 border rounded ${
                    configured
                      ? "text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                      : "text-gray-300 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Left controls */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <button
                  onClick={handleHeightIncrement}
                  disabled={!configured}
                  className={`flex items-center justify-center text-sm w-5 h-5 border rounded ${
                    configured
                      ? "text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                      : "text-gray-300 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Plus size={12} />
                </button>
                <div className="flex items-center justify-center min-h-[40px]">
                  <span
                    className="text-xs text-gray-700 text-center rotate-180"
                    style={{ writingMode: "vertical-lr" }}
                  >
                    {actualScreenSize.height.toFixed(2)} m
                  </span>
                </div>
                <button
                  onClick={handleHeightDecrement}
                  disabled={!configured}
                  className={`flex items-center justify-center text-sm w-5 h-5 border rounded ${
                    configured
                      ? "text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
                      : "text-gray-300 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Minus size={12} />
                </button>
              </div>

              {/* Human silhouette */}
              <div
                className="absolute -right-2 w-auto h-36 rounded flex items-center justify-center z-50"
                style={{ bottom: "calc(50% - 150px)" }}
              >
                <img
                  src="/human.webp"
                  alt="Human Scale"
                  className="w-full h-full"
                />
              </div>

              {/* Cabinet Count Info */}
              <div className="absolute -bottom-6 left-5 text-xs text-gray-500 px-2 py-1">
                {cabinetCount.horizontal} × {cabinetCount.vertical} units
              </div>
            </div>
          ) : (
            /* Canvas Empty */
            <div className="w-[600px] h-[320px] bg-white text-center flex flex-col items-center justify-center">
              <p className="text-gray-500 text-base">
                Start your configuration by choosing the model that suits your
                needs.
              </p>
              <button
                onClick={openModal}
                className="mt-6 flex items-center justify-center space-x-2 w-1/2 h-10 text-white bg-[#3AAFA9] hover:bg-teal-600 transition-colors"
              >
                <CirclePlus size={20} className="shrink-0" />
                <span className="text-base">Configuration</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal />
    </>
  );
};
