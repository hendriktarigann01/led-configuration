import React, { useEffect, useState, useRef } from "react";
import {
  CirclePlus,
  Plus,
  Minus,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
} from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseModalStore } from "../store/UseModalStore";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { ConfigurationModal } from "./ConfigurationModal";
import { CanvasUtils } from "./utils/CanvasUtils";

export const Canvas = () => {
  // Store hooks
  const canvasStore = UseCanvasStore();
  const { openModal } = UseModalStore();
  const {
    selectedModel,
    selectedContent,
    customImageUrl,
    roomImageUrl,
    resetNavbar,
  } = UseNavbarStore();
  const headerStore = UseHeaderStore();

  // Image positioning state (enhanced version)
  const [imageSettings, setImageSettings] = useState({
    x: 50, // percentage
    y: 50, // percentage
    scale: 1, // 0.5 to 3
    rotation: 0, // degrees
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });
  const [showImageControls, setShowImageControls] = useState(false);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);

  // Refs
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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
    updateModelData,
    isConfigured,
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
    resetToDefaults,
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

  // Show/hide image controls based on room image
  useEffect(() => {
    if (roomImageUrl) {
      setShowImageControls(true);
      // Reset to center when new image is loaded
      setImageSettings((prev) => ({
        ...prev,
        x: 50,
        y: 50,
        scale: 1,
        rotation: 0,
      }));
    } else {
      setShowImageControls(false);
    }
  }, [roomImageUrl]);

  // Image interaction handlers
  const handleImageMouseDown = (e) => {
    if (!roomImageUrl) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    setImageSettings((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: { x: startX, y: startY },
    }));
  };

  const handleImageMouseMove = (e) => {
    if (!imageSettings.isDragging || !roomImageUrl) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const deltaX = currentX - imageSettings.dragStart.x;
    const deltaY = currentY - imageSettings.dragStart.y;

    const newX = imageSettings.x + (deltaX / rect.width) * 100;
    const newY = imageSettings.y + (deltaY / rect.height) * 100;

    setImageSettings((prev) => ({
      ...prev,
      x: Math.max(-50, Math.min(150, newX)),
      y: Math.max(-50, Math.min(150, newY)),
      dragStart: { x: currentX, y: currentY },
    }));
  };

  const handleImageMouseUp = () => {
    setImageSettings((prev) => ({
      ...prev,
      isDragging: false,
    }));
  };

  // Wheel zoom handler
  const handleImageWheel = (e) => {
    if (!roomImageUrl) return;

    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, imageSettings.scale + delta));

    setImageSettings((prev) => ({
      ...prev,
      scale: newScale,
    }));
  };

  // Control handlers
  const handleZoomIn = () => {
    setImageSettings((prev) => ({
      ...prev,
      scale: Math.min(1, prev.scale + 0.1),
    }));
  };

  const handleZoomOut = () => {
    setImageSettings((prev) => ({
      ...prev,
      scale: Math.max(1, prev.scale - 0.1),
    }));
  };

  const handleRotateLeft = () => {
    setImageSettings((prev) => ({
      ...prev,
      rotation: (prev.rotation - 15) % 360,
    }));
  };

  const handleRotateRight = () => {
    setImageSettings((prev) => ({
      ...prev,
      rotation: (prev.rotation + 15) % 360,
    }));
  };

  const resetImagePosition = () => {
    setImageSettings((prev) => ({
      ...prev,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    }));
  };

  const fitImageToCanvas = () => {
    setImageSettings((prev) => ({
      ...prev,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    }));
  };

  const fillCanvas = () => {
    setImageSettings((prev) => ({
      ...prev,
      x: 50,
      y: 50,
      scale: 1.5,
      rotation: 0,
    }));
  };

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

  // Complete reset function
  const handleCompleteReset = () => {
    reset();
    resetToDefaults();
    resetNavbar();
    setImageSettings({
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
    });
    setShowImageControls(false);
  };

  // Screen control handlers
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
        onClick={handleCompleteReset}
        className="w-20 lg:w-[144px] cursor-pointer px-4 py-2 text-xs bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Reset
      </button>
    </div>
  );

  const renderImageControls = () => {
    if (!roomImageUrl || !showImageControls) return null;

    return (
      <div className="absolute top-20 -left-80 z-40 bg-white rounded-lg shadow-lg border p-4 min-w-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Move size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Image Controls
            </span>
          </div>
          <button
            onClick={() => setShowImageControls(!showImageControls)}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Hide
          </button>
        </div>

        <div className="space-y-4">
          {/* Position Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-500">X: </span>
              <span className="font-mono">{imageSettings.x.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-500">Y: </span>
              <span className="font-mono">{imageSettings.y.toFixed(1)}%</span>
            </div>
          </div>

          {/* Scale Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Scale: {Math.round(imageSettings.scale * 100)}%
              </label>
              <div className="flex space-x-1">
                <button
                  onClick={handleZoomOut}
                  disabled={imageSettings.scale <= 0.5}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={imageSettings.scale >= 3}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={imageSettings.scale}
              onChange={(e) =>
                setImageSettings((prev) => ({
                  ...prev,
                  scale: parseFloat(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Rotation Controls */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-600">
                Rotation: {imageSettings.rotation}°
              </label>
              <div className="flex space-x-1">
                <button
                  onClick={handleRotateLeft}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  title="Rotate Left"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={handleRotateRight}
                  className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  title="Rotate Right"
                >
                  <RotateCw size={14} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="15"
              value={imageSettings.rotation}
              onChange={(e) =>
                setImageSettings((prev) => ({
                  ...prev,
                  rotation: parseInt(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={fitImageToCanvas}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Fit to Canvas
            </button>
            <button
              onClick={fillCanvas}
              className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Fill Canvas
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetImagePosition}
            className="w-full flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-[#3AAFA9] text-white hover:bg-teal-600 rounded transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset Position</span>
          </button>

          {/* Instructions */}
          <div className="text-xs text-gray-500 pt-2 border-t">
            <p>• Drag image to move</p>
            <p>• Mouse wheel to zoom</p>
            <p>• Use controls above for fine-tuning</p>
          </div>
        </div>
      </div>
    );
  };

  const renderVideoContent = () => (
    <div className="relative inline-block">
      <div
        className="relative"
        style={{
          width: `${imageWidth}px`,
          height: `${imageHeight}px`,
        }}
      >
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
        {CanvasUtils.renderBezelOverlay(cabinetCount)}
      </div>
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
    <div className="absolute top-1 left-1/2 -translate-x-1/2 hidden lg:flex items-center space-x-2 z-30">
      {renderControlButton(
        handleWidthDecrement,
        !configured || !canDecreaseScreenWidth || resolution !== "Custom",
        <Minus size={12} />
      )}
      <span className="text-xs text-gray-700 px-2 py-1 rounded">
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
    <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center justify-center space-y-2 z-30">
      {renderControlButton(
        handleHeightIncrement,
        !configured || !canIncreaseScreenHeight || resolution !== "Custom",
        <Plus size={12} />
      )}
      <div className="flex items-center justify-center min-h-[40px]">
        <span
          className="text-xs text-gray-700 text-center rotate-180 px-2 py-1 rounded"
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
          backgroundSize: `${imageSettings.scale * 100}%`,
          backgroundPosition: `${imageSettings.x}% ${imageSettings.y}%`,
          backgroundRepeat: "no-repeat",
          transform: `rotate(${imageSettings.rotation}deg)`,
          transformOrigin: "center center",
          transition: imageSettings.isDragging ? "none" : "all 0.2s ease-out",
        }
      : {};

    const cursorClass = roomImageUrl
      ? imageSettings.isDragging
        ? "cursor-grabbing"
        : "cursor-grab"
      : "";

    return (
      <div
        ref={canvasRef}
        className={`w-[300px] h-[180px] max-h-[300px] md:w-[450px] md:h-[250px] lg:w-[550px] lg:h-[300px] ${
          roomImageUrl ? "bg-transparent" : "bg-white"
        } p-5 flex items-center justify-center z-20 relative ${cursorClass} select-none`}
        style={backgroundStyle}
        onMouseDown={handleImageMouseDown}
        onMouseMove={handleImageMouseMove}
        onMouseUp={handleImageMouseUp}
        onMouseLeave={handleImageMouseUp}
        onWheel={handleImageWheel}
      >
        {/* Optional overlay for better contrast */}
        {roomImageUrl && (
          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />
        )}

        {/* Drag indicator */}
        {imageSettings.isDragging && (
          <div className="absolute inset-0 border-2 border-dashed border-[#3AAFA9] z-15 pointer-events-none rounded" />
        )}

        {/* Center crosshair when dragging */}
        {imageSettings.isDragging && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
            <div className="w-4 h-4 border-2 border-[#3AAFA9] rounded-full bg-white/80"></div>
          </div>
        )}

        {/* LED Screen Content */}
        <div className="relative z-20 pointer-events-none">
          {isVideo ? renderVideoContent() : renderImageContent()}
        </div>
      </div>
    );
  };

  const renderCanvasPreview = () => (
    <div className="relative w-full max-w-[400px] h-[250px] md:max-w-[550px] md:h-[320px] lg:max-w-[650px] lg:h-[370px] rounded-lg flex items-center justify-center overflow-hidden">
      {renderCanvasBackground()}

      {/* Image Controls Panel */}
      {renderImageControls()}

      {/* Canvas to Wall Measurements */}
      {CanvasUtils.renderCanvasToWallMeasurements(
        effectiveCanvasWidth,
        effectiveCanvasHeight
      )}

      {/* Wall Measurements */}
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
    <div className="w-[300px] h-[180px] max-h-[300px] md:w-[450px] md:h-[250px] lg:w-[550px] lg:h-[300px] bg-white text-center flex flex-col items-center justify-center px-4">
      <p className="text-gray-500 text-xs lg:text-base">
        Start your configuration by choosing the model that suits your needs.
      </p>
      <button
        onClick={openModal}
        className="mt-6 flex items-center justify-center space-x-1 lg:space-x-2 w-full max-w-40 lg:max-w-52 h-8 lg:h-10 text-white bg-[#3AAFA9] hover:bg-teal-600 transition-colors"
      >
        <CirclePlus className="shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
        <span className="text-xs lg:text-base">Configuration</span>
      </button>
    </div>
  );

  return (
    <>
      <div className="flex-1 bg-gray-100 h-80 lg:h-full p-2 lg:p-4 flex items-center justify-center">
        {renderResetButton()}

        {/* Canvas Container */}
        <div className="relative m-auto flex justify-center items-center w-full">
          {/* <div className="absolute top-[41.5%] left-[11%] -translate-x-1/2 w-52 p-3 text-xs text-white rounded-lg bg-black/40">
            <X className="absolute top-2 right-2 w-5 h-5 cursor-pointer" />
            <p>1. Scroll to Zoom</p>
            <p>2. Click & Drag to Move Image</p>
          </div> */}

          {/* Total Wall Width */}
          <div className="absolute -top-3 left-[26%] w-[300px] md:w-[450px] lg:w-[550px] border-t z-50 border-teal-400 pointer-events-none">
            <span className="absolute left-1/2 -translate-x-1/2 -top-5 bg-white px-1 text-xs text-teal-600">
              {wallWidth} m
            </span>
          </div>

          {/* Total Wall Height */}
          <div className="absolute top-[9%] left-[20%] h-[180px] md:h-[250px] lg:h-[300px] border-l z-50 border-teal-400 pointer-events-none">
            <span className="absolute top-1/2 -translate-y-1/2 -left-8 bg-white px-1 text-xs text-teal-600 whitespace-nowrap">
              {wallHeight} m
            </span>
          </div>

          {configured && selectedModel
            ? renderCanvasPreview()
            : renderEmptyCanvas()}
        </div>

        <div className="absolute bottom-2 right-2 w-auto p-3 text-xs text-white rounded-lg bg-black/40">
          <p>© 2025 MJ Solution Indonesia</p>
        </div>
      </div>

      <ConfigurationModal />
    </>
  );
};
