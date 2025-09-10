import React, { useEffect } from "react";
import { CirclePlus, Plus, Minus } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseModalStore } from "../store/UseModalStore";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { ConfigurationModal } from "./ConfigurationModal";
import { CanvasUtils } from "./utils/CanvasUtils"; // Import utility functions

export const Canvas = () => {
  // Store hooks
  const canvasStore = UseCanvasStore();
  const { openModal } = UseModalStore();
  const { selectedModel, selectedContent, customImageUrl, roomImageUrl } =
    UseNavbarStore();
  const headerStore = UseHeaderStore();

  // Destructure canvas store
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
  } = canvasStore;

  // Destructure header store
  const {
    syncWithCanvas,
    incrementScreenWidth,
    decrementScreenWidth,
    incrementScreenHeight,
    decrementScreenHeight,
    initializeDefaults,
    resolution,
    getResolutionInfo,
  } = headerStore;

  // Initialize model data when selected
  useEffect(() => {
    if (selectedModel?.modelData) {
      updateModelData(selectedModel.modelData, selectedModel.name);

      setTimeout(() => {
        initializeDefaults();
        syncWithCanvas();
      }, 50);
    }
  }, [selectedModel, updateModelData, syncWithCanvas, initializeDefaults]);

  // Calculate display values
  const cabinetCount = getCabinetCount();
  const actualScreenSize = getActualScreenSize();
  const configured = isConfigured();
  const resolutionInfo = getResolutionInfo();

  // Validation for control buttons
  const canIncreaseScreenWidth =
    actualScreenSize.width + baseWidth <= wallWidth;
  const canDecreaseScreenWidth = actualScreenSize.width > baseWidth;
  const canIncreaseScreenHeight =
    actualScreenSize.height + baseHeight <= wallHeight;
  const canDecreaseScreenHeight = actualScreenSize.height > baseHeight;

  // Control button handlers
  const handleWidthIncrement = () => {
    if (!configured || !canIncreaseScreenWidth || resolution !== "Custom")
      return;
    incrementScreenWidth();
  };

  const handleWidthDecrement = () => {
    if (!configured || !canDecreaseScreenWidth || resolution !== "Custom")
      return;
    decrementScreenWidth();
  };

  const handleHeightIncrement = () => {
    if (!configured || !canIncreaseScreenHeight || resolution !== "Custom")
      return;
    incrementScreenHeight();
  };

  const handleHeightDecrement = () => {
    if (!configured || !canDecreaseScreenHeight || resolution !== "Custom")
      return;
    decrementScreenHeight();
  };

  // Use utility functions for calculations
  const { effectiveCanvasWidth, effectiveCanvasHeight } =
    CanvasUtils.getCanvasDimensions(wallWidth, wallHeight);

  const { imageWidth, imageHeight } = CanvasUtils.getImageDimensions(
    actualScreenSize,
    wallWidth,
    wallHeight,
    effectiveCanvasWidth,
    effectiveCanvasHeight
  );

  const {
    horizontalMeasureLength,
    verticalMeasureLength,
    remainingWallHeight,
    remainingWallWidth,
  } = CanvasUtils.getMeasurementValues(
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

  const contentSource = CanvasUtils.getContentSource(
    selectedContent,
    customImageUrl
  );
  const isVideo = selectedContent === "Default Video";

  const getResolutionDisplayString = () => {
    if (!resolutionInfo) return "No Resolution Data";

    const { actual } = resolutionInfo;

    return `${actual.width} × ${actual.height} px`;
  };

  // Component render helpers
  const renderResetButton = () => (
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={reset}
        className="w-20 lg:w-[144px] cursor-pointer px-4 py-2 text-xs bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Reset
      </button>
    </div>
  );

  const renderVideoContent = () => (
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
      {CanvasUtils.renderMeasurementLines(
        horizontalMeasureLength,
        verticalMeasureLength
      )}
    </div>
  );

  const renderImageContent = () => (
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
          className="object-fill w-full h-full z-20"
        />
        {CanvasUtils.renderBezelOverlay(cabinetCount)}
      </div>
      {CanvasUtils.renderMeasurementLines(
        horizontalMeasureLength,
        verticalMeasureLength
      )}
    </div>
  );

  const renderControlButton = (
    onClick,
    disabled,
    icon,
    additionalClasses = ""
  ) => {
    const baseClasses =
      "flex items-center justify-center text-sm w-5 h-5 border rounded";
    const enabledClasses =
      "text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-600 cursor-pointer";
    const disabledClasses = "text-gray-300 border-gray-200 cursor-not-allowed";

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${
          disabled ? disabledClasses : enabledClasses
        } ${additionalClasses}`}
      >
        {icon}
      </button>
    );
  };

  const renderWidthControls = () => (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 hidden lg:flex items-center space-x-2 z-50">
      {renderControlButton(
        handleWidthDecrement,
        !configured || !canDecreaseScreenWidth || resolution !== "Custom",
        <Minus size={12} />
      )}
      <span className="text-xs text-gray-700">
        {actualScreenSize.width.toFixed(2)} m
      </span>
      {renderControlButton(
        handleWidthIncrement,
        !configured || !canIncreaseScreenWidth || resolution !== "Custom",
        <Plus size={12} />
      )}
    </div>
  );

  const renderHeightControls = () => (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center space-y-2 z-50 ">
      {renderControlButton(
        handleHeightIncrement,
        !configured || !canIncreaseScreenHeight || resolution !== "Custom",
        <Plus size={12} />
      )}
      <div className="flex items-center justify-center min-h-[40px]">
        <span
          className="text-xs text-gray-700 text-center rotate-180"
          style={{ writingMode: "vertical-lr" }}
        >
          {actualScreenSize.height.toFixed(2)} m
        </span>
      </div>
      {renderControlButton(
        handleHeightDecrement,
        !configured || !canDecreaseScreenHeight || resolution !== "Custom",
        <Minus size={12} className="rotate-90" />
      )}
    </div>
  );

  const renderCanvasBackground = () => {
    const backgroundStyle = roomImageUrl
      ? {
          backgroundImage: `url(${roomImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {};

    return (
      <div
        className={`w-[330px] h-[180px] max-h-[300px] lg:w-[550px] lg:h-[300px] ${
          roomImageUrl ? "bg-transparent" : "bg-white"
        } p-5 flex items-center justify-center z-20`}
        style={backgroundStyle}
      >
        {isVideo ? renderVideoContent() : renderImageContent()}
      </div>
    );
  };

  const renderCanvasPreview = () => (
    <div className="relative w-full max-w-[650px] h-[250px] lg:w-[650px] lg:h-[370px] rounded-lg flex items-center justify-center overflow-hidden">
      {renderCanvasBackground()}

      {/* Canvas to Wall Measurements */}
      {CanvasUtils.renderCanvasToWallMeasurements(
        effectiveCanvasWidth,
        effectiveCanvasHeight
      )}

      {/* Wall Measurements - Centered */}
      {CanvasUtils.renderWallMeasurements(
        remainingWallHeight,
        remainingWallWidth
      )}

      {/* Info Displays */}
      {CanvasUtils.renderInfoDisplays(getResolutionDisplayString())}

      {/* Screen Controls */}
      {renderWidthControls()}
      {renderHeightControls()}

      {/* Human Silhouette */}
      {CanvasUtils.renderHumanSilhouette(finalHumanHeight, humanToWallRatio)}
    </div>
  );

  const renderEmptyCanvas = () => (
    <div className="w-[330px] h-[180px] max-h-[300px] lg:w-[550px] lg:h-[300px] bg-white text-center flex flex-col items-center justify-center px-4">
      <p className="text-gray-500 text-sm lg:text-base">
        Start your configuration by choosing the model that suits your needs.
      </p>
      <button
        onClick={openModal}
        className="mt-6 flex items-center justify-center space-x-2 w-full max-w-[200px] lg:w-1/2 h-10 text-white bg-[#3AAFA9] hover:bg-teal-600 transition-colors"
      >
        <CirclePlus size={20} className="shrink-0" />
        <span className="text-base">Configuration</span>
      </button>
    </div>
  );

  return (
    <>
      <div className="flex-1 bg-gray-100 h-80  lg:h-full p-2 lg:p-4 flex items-center justify-center">
        {renderResetButton()}

        {/* Canvas Container */}
        <div className="relative m-auto flex justify-center items-center w-full">
          {configured && selectedModel
            ? renderCanvasPreview()
            : renderEmptyCanvas()}
        </div>
      </div>

      <ConfigurationModal />
    </>
  );
};
