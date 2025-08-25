import React, { useEffect } from "react";
import { CirclePlus, Plus, Minus } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseModalStore } from "../store/UseModalStore";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseHeaderStore } from "../store/UseHeaderStore";
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
  } = UseCanvasStore();

  const { openModal } = UseModalStore();
  const { selectedModel } = UseNavbarStore();
  const {
    setScreenWidth,
    setScreenHeight,
    incrementScreenWidth,
    decrementScreenWidth,
    incrementScreenHeight,
    decrementScreenHeight,
  } = UseHeaderStore();

  // Update canvas store when model is selected
  useEffect(() => {
    if (selectedModel && selectedModel.modelData) {
      updateModelData(selectedModel.modelData, selectedModel.name);
    }
  }, [selectedModel, updateModelData]);

  // Calculate display values
  const cabinetCount = getCabinetCount();
  const actualScreenSize = getActualScreenSize();
  const imageScale = getImageScale();

  // Handle control button actions
  const handleWidthIncrement = () => {
    const newWidth = screenWidth + baseWidth;
    setScreenWidth(newWidth);
    incrementScreenWidth();
  };

  const handleWidthDecrement = () => {
    const newWidth = Math.max(baseWidth, screenWidth - baseWidth);
    setScreenWidth(newWidth);
    decrementScreenWidth();
  };

  const handleHeightIncrement = () => {
    const newHeight = screenHeight + baseHeight;
    setScreenHeight(newHeight);
    incrementScreenHeight();
  };

  const handleHeightDecrement = () => {
    const newHeight = Math.max(baseHeight, screenHeight - baseHeight);
    setScreenHeight(newHeight);
    decrementScreenHeight();
  };

  // Calculate image size for display
  const imageWidth = 384 * imageScale; // 80% of 480px (w-4/5 h-4/5 of 600px container)
  const imageHeight = 256 * imageScale; // 80% of 320px

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
          {selectedModel ? (
            /* Canvas Preview */
            <div className="w-[600px] h-[320px] z-10 rounded-lg flex items-center justify-center">
              <div className="w-4/5 h-4/5 bg-white p-5 flex items-center justify-center">
                <img
                  src="/canvas-bg.webp"
                  alt="Canvas Preview"
                  style={{
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  className="object-cover"
                />
              </div>

              {/* Top controls */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-50">
                <button
                  onClick={handleWidthDecrement}
                  className="flex items-center justify-center text-gray-300 text-sm w-5 h-5 border border-gray-300 hover:bg-gray-50"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs text-gray-700">
                  {actualScreenSize.width.toFixed(2)} m
                </span>
                <button
                  onClick={handleWidthIncrement}
                  className="flex items-center justify-center text-gray-300 text-sm w-5 h-5 border border-gray-300 hover:bg-gray-50"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="absolute top-80 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-50">
                <button
                  onClick={handleWidthDecrement}
                  className="flex items-center justify-center text-gray-300 text-sm w-5 h-5 border border-gray-300 hover:bg-gray-50"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs text-gray-700">
                  {actualScreenSize.width.toFixed(2)} m
                </span>
                <button
                  onClick={handleWidthIncrement}
                  className="flex items-center justify-center text-gray-300 text-sm w-5 h-5 border border-gray-300 hover:bg-gray-50"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Left controls */}
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-2 z-50">
                <button
                  onClick={handleHeightIncrement}
                  className="flex items-center justify-center text-gray-300 text-sm w-5 h-5 border border-gray-300 hover:bg-gray-50"
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
                  className="flex items-center justify-center text-gray-300 text-sm w-5 h-5 border border-gray-300 hover:bg-gray-50"
                >
                  <Minus size={12} />
                </button>
              </div>

              {/* Human silhouette */}
              <div
                className="absolute right-0 w-auto h-36 rounded flex items-center justify-center z-50"
                style={{ bottom: "calc(50% - 128px)" }}
              >
                <img
                  src="/human.webp"
                  alt="Human Scale"
                  className="w-full h-full"
                />
              </div>

              {/* Cabinet Count Info */}
              <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
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
                className="mt-6 flex items-center justify-center space-x-2 w-1/2 h-10 text-white bg-teal-500 hover:bg-teal-600 transition-colors"
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
