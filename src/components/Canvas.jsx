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

  // Calculate image size for display based on actual screen size and scale
  const baseImageWidth = 384;
  const baseImageHeight = 256;

  // Scale image based on actual screen dimensions and wall size
  const imageWidth = baseImageWidth * imageScale;
  const imageHeight = baseImageHeight * imageScale;

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
        // Get the uploaded image URL from Zustand store
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
                    {/* Garis vertikal dari pojok kanan atas */}
                    <div className="absolute top-0 right-0 translate-x-full -translate-y-3/4 h-[110%] border-l border-dashed border-teal-400 pointer-events-none"></div>
                    {/* Garis horizontal dari pojok kiri bawah */}
                    <div className="absolute bottom-0 left-0 translate-y-full -translate-x-3/4 w-[110%] border-t border-dashed border-teal-400 pointer-events-none"></div>
                  </div>
                ) : (
                  <div className="relative inline-block">
                    <img
                      src={contentSource}
                      alt="Canvas Preview"
                      style={{
                        width: `${imageWidth}px`,
                        height: `${imageHeight}px`,
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                      className="object-cover z-20"
                    />
                    {/* V Top Right - sama dengan V Top Left luar */}
                    <div className="absolute top-0 right-0 translate-x-full -translate-y-4/5 h-96  border-l border-dashed border-teal-400 pointer-events-none"></div>

                    {/* V Top Left - sama dengan V Top Left luar */}
                    <div className="absolute top-0 left-0 translate-x-full -translate-y-4/5 h-96  border-l border-dashed border-teal-400 pointer-events-none"></div>

                    {/* H Bottom Right - sama dengan H Bottom luar */}
                    <div className="absolute top-0 left-0 translate-y-full -translate-x-4/5 w-96  border-t border-dashed border-teal-400 pointer-events-none"></div>

                    {/* H Bottom Left - sama dengan H Bottom luar */}
                    <div className="absolute bottom-0 left-0 translate-y-full -translate-x-4/5 w-96  border-t border-dashed border-teal-400 pointer-events-none"></div>
                  </div>
                )}
              </div>

              {/* H Bottom */}
              <div className="absolute bottom-9 -z-10 left-0 translate-y-full -translate-x-3/4 w-full border-t border-dashed border-teal-400 pointer-events-none"></div>
              {/* V Top Left */}
              <div className="absolute top-0 right-13 -z-10 translate-x-full -translate-y-3/4 h-full border-l border-dashed border-teal-400 pointer-events-none"></div>

              {/* Left Teks Top */}
              <div className="absolute left-4 top-[20%] -translate-y-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <span
                  className="text-xs text-gray-700 text-center rotate-180"
                  style={{ writingMode: "vertical-lr" }}
                >
                  12 m
                </span>
              </div>

              {/* Left Teks Bottom */}
              <div className="absolute left-4 top-[80%] -translate-y-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <span
                  className="text-xs text-gray-700 text-center rotate-180"
                  style={{ writingMode: "vertical-lr" }}
                >
                  12 m
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
