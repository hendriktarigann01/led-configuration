import React, { useEffect, useState, useRef } from "react";
import { CirclePlus, Plus, Minus, X } from "lucide-react";
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

  // Image positioning state (simplified)
  const [imageSettings, setImageSettings] = useState({
    x: 50,
    y: 50,
    scale: 1,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });
  const [showTutorial, setShowTutorial] = useState(false);

  // Size warning modal state
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  // Refs
  const canvasRef = useRef(null);

  // Destructure stores
  const {
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
    screenSize,
    getCabinetCount: getHeaderCabinetCount,
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

  // Reset image settings when room image changes
  useEffect(() => {
    if (roomImageUrl) {
      setImageSettings((prev) => ({
        ...prev,
        x: 50,
        y: 50,
        scale: 1,
      }));
    }
  }, [roomImageUrl]);

  // FIXED: Improved Dynamic Canvas Size Calculator
  const getDynamicCanvasSize = () => {
    const maxWidth =
      window.innerWidth < 768 ? 300 : window.innerWidth < 1024 ? 450 : 550;
    const maxHeight =
      window.innerWidth < 768 ? 180 : window.innerWidth < 1024 ? 250 : 300;

    // Calculate wall aspect ratio
    const wallAspectRatio = wallWidth / wallHeight;

    let canvasW, canvasH;

    // Determine canvas size based on wall dimensions
    if (wallAspectRatio >= 1) {
      // Wall is wider than tall
      canvasW = Math.min(maxWidth, maxWidth);
      canvasH = canvasW / wallAspectRatio;
      if (canvasH > maxHeight) {
        canvasH = maxHeight;
        canvasW = canvasH * wallAspectRatio;
      }
    } else {
      // Wall is taller than wide
      canvasH = Math.min(maxHeight, maxHeight);
      canvasW = canvasH * wallAspectRatio;
      if (canvasW > maxWidth) {
        canvasW = maxWidth;
        canvasH = canvasW / wallAspectRatio;
      }
    }

    return {
      width: Math.round(canvasW),
      height: Math.round(canvasH),
    };
  };

  const dynamicCanvas = getDynamicCanvasSize();

  // Touch and Mouse handlers (unified for mobile and desktop)
  const getPointerPosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (e) => {
    if (!roomImageUrl) return;
    e.preventDefault();
    e.stopPropagation();

    const position = getPointerPosition(e);
    setImageSettings((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: position,
    }));
    setShowTutorial(true);
  };

  const handlePointerMove = (e) => {
    if (!imageSettings.isDragging || !roomImageUrl) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const position = getPointerPosition(e);

    const deltaX = position.x - imageSettings.dragStart.x;
    const deltaY = position.y - imageSettings.dragStart.y;

    const newX = imageSettings.x + (deltaX / rect.width) * 100;
    const newY = imageSettings.y + (deltaY / rect.height) * 100;

    setImageSettings((prev) => ({
      ...prev,
      x: Math.max(-50, Math.min(150, newX)),
      y: Math.max(-50, Math.min(150, newY)),
      dragStart: position,
    }));
  };

  const handlePointerUp = () => {
    setImageSettings((prev) => ({
      ...prev,
      isDragging: false,
    }));
    setShowTutorial(false);
  };

  // Wheel zoom handler (slower zoom with minimum scale to cover canvas)
  const handleWheel = (e) => {
    if (!roomImageUrl) return;
    e.preventDefault();
    e.stopPropagation();

    const delta = e.deltaY > 0 ? -0.05 : 0.05; // Reduced from 0.1 to 0.05
    // Set minimum scale to 1.0 so image always covers the canvas
    const newScale = Math.max(1.0, Math.min(3, imageSettings.scale + delta));

    setImageSettings((prev) => ({
      ...prev,
      scale: newScale,
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

  // Show size warning modal for screen size limits
  const showMaxSizeWarning = (type, currentValue) => {
    const isCabinetMode = screenSize === "Column/Row";

    if (isCabinetMode) {
      const currentCabinetCount = getHeaderCabinetCount();
      if (type === "width") {
        setWarningMessage(
          `The maximum number of columns you can install is ${Math.floor(
            wallWidth / baseWidth
          )} columns with current wall width of ${wallWidth}m. Currently trying to set ${
            currentCabinetCount.horizontal + 1
          } columns.`
        );
      } else {
        setWarningMessage(
          `The maximum number of rows you can install is ${Math.floor(
            wallHeight / baseHeight
          )} rows with current wall height of ${wallHeight}m. Currently trying to set ${
            currentCabinetCount.vertical + 1
          } rows.`
        );
      }
    } else {
      if (type === "width") {
        setWarningMessage(
          `The maximum screen width you can install is ${
            Math.floor(wallWidth / baseWidth) * baseWidth
          }m with current wall width of ${wallWidth}m. Cannot set screen width to ${currentValue}m.`
        );
      } else {
        setWarningMessage(
          `The maximum screen height you can install is ${
            Math.floor(wallHeight / baseHeight) * baseHeight
          }m with current wall height of ${wallHeight}m. Cannot set screen height to ${currentValue}m.`
        );
      }
    }
    setShowSizeWarning(true);
  };

  // Enhanced increment handlers with warning
  const handleScreenWidthIncrement = () => {
    const newWidth = actualScreenSize.width + baseWidth;
    if (newWidth > wallWidth) {
      showMaxSizeWarning("width", newWidth);
      return;
    }
    incrementScreenWidth();
  };

  const handleScreenHeightIncrement = () => {
    const newHeight = actualScreenSize.height + baseHeight;
    if (newHeight > wallHeight) {
      showMaxSizeWarning("height", newHeight);
      return;
    }
    incrementScreenHeight();
  };

  // Complete reset function
  const handleCompleteReset = () => {
    reset();
    resetToDefaults();
    resetNavbar();
    setImageSettings({
      x: 50,
      y: 50,
      scale: 1,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
    });
    setShowTutorial(false);
    setShowSizeWarning(false);
  };

  // Screen control handlers
  const handleWidthIncrement = () => {
    if (!configured || !canIncreaseScreenWidth || resolution !== "Custom")
      return;
    handleScreenWidthIncrement();
  };

  const handleWidthDecrement = () => {
    if (!configured || !canDecreaseScreenWidth || resolution !== "Custom")
      return;
    decrementScreenWidth();
  };

  const handleHeightIncrement = () => {
    if (!configured || !canIncreaseScreenHeight || resolution !== "Custom")
      return;
    handleScreenHeightIncrement();
  };

  const handleHeightDecrement = () => {
    if (!configured || !canDecreaseScreenHeight || resolution !== "Custom")
      return;
    decrementScreenHeight();
  };

  // FIXED: Improved calculations using CanvasUtils
  const { effectiveCanvasWidth, effectiveCanvasHeight } =
    CanvasUtils.getCanvasDimensions(
      wallWidth,
      wallHeight,
      dynamicCanvas.width,
      dynamicCanvas.height
    );

  // CRITICAL FIX: Calculate screen size based on actual canvas dimensions
  const screenToWallRatioX = actualScreenSize.width / wallWidth;
  const screenToWallRatioY = actualScreenSize.height / wallHeight;

  // Calculate screen image size with proper constraints
  const maxScreenWidth = dynamicCanvas.width * 0.9; // 90% of canvas width max
  const maxScreenHeight = dynamicCanvas.height * 0.9; // 90% of canvas height max

  const idealScreenWidth = dynamicCanvas.width * screenToWallRatioX;
  const idealScreenHeight = dynamicCanvas.height * screenToWallRatioY;

  const imageWidth = Math.min(idealScreenWidth, maxScreenWidth);
  const imageHeight = Math.min(idealScreenHeight, maxScreenHeight);

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
    dynamicCanvas.width,
    dynamicCanvas.height
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
        disabled={!isConfigured()}
        onClick={handleCompleteReset}
        className={`w-20 lg:w-[144px] flex items-center justify-center space-x-2 h-8 lg:h-auto px-4 py-2 rounded text-xs transition-colors ${
          isConfigured()
            ? "cursor-pointer bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            : "cursor-not-allowed bg-gray-100 border border-gray-200 text-gray-400"
        }`}
      >
        Reset
      </button>
    </div>
  );

  // Size Warning Modal Component
  const SizeWarningModal = () => {
    if (!showSizeWarning) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-orange-500 text-xl"></div>
            <h3 className="text-lg font-semibold text-gray-800">
              Size Limitation
            </h3>
            <button
              onClick={() => setShowSizeWarning(false)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-gray-600 mb-4">{warningMessage}</p>

          <div className="text-sm text-gray-500 mb-4">
            To install a larger screen, please increase the wall dimensions
            first.
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowSizeWarning(false)}
              className="px-4 py-2 bg-[#3AAFA9] text-white rounded hover:bg-teal-600 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTutorialCard = () => {
    if (!showTutorial || !roomImageUrl) return null;

    return (
      <div className="absolute top-[41.5%] left-[11%] -translate-x-1/2 w-52 p-3 text-xs text-white rounded-lg bg-black/40 z-50">
        <X
          className="absolute top-2 right-2 w-5 h-5 cursor-pointer hover:text-gray-300"
          onClick={() => setShowTutorial(false)}
        />
        <p>1. Scroll to Zoom</p>
        <p>2. Click & Drag to Move Image</p>
        <p>3. Touch & Drag on Mobile</p>
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
          className="object-cover w-full h-full z-20"
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
        {parseFloat(actualScreenSize.width.toFixed(3)).toString()} m
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
          {parseFloat(actualScreenSize.height.toFixed(3)).toString()} m
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
        className={`${
          roomImageUrl ? "bg-transparent" : "bg-white"
        } p-5 flex items-center justify-center z-20 relative  ${cursorClass} select-none`}
        style={{
          width: `${dynamicCanvas.width}px`,
          height: `${dynamicCanvas.height}px`,
          maxHeight: `${dynamicCanvas.height}px`,
          ...backgroundStyle,
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        onWheel={handleWheel}
      >
        {/* Drag indicator */}
        {imageSettings.isDragging && (
          <div className="absolute inset-0 border-2 border-dashed border-[#3AAFA9] z-15 pointer-events-none rounded" />
        )}

        {/* LED Screen Content */}
        <div className="relative z-20 pointer-events-none">
          {isVideo ? renderVideoContent() : renderImageContent()}
        </div>
      </div>
    );
  };

  const renderCanvasPreview = () => (
    <div
      className="relative rounded-lg flex items-center justify-center overflow-hidden"
      style={{
        width: `${Math.min(
          dynamicCanvas.width + 100,
          window.innerWidth - 40
        )}px`,
        height: `${Math.min(
          dynamicCanvas.height + 100,
          window.innerHeight - 200
        )}px`,
        maxWidth: "100vw",
        maxHeight: "80vh",
      }}
    >
      {renderCanvasBackground()}

      {/* Canvas to Wall Measurements */}
      {CanvasUtils.renderCanvasToWallMeasurements(
        dynamicCanvas.width,
        dynamicCanvas.height
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
    <div className="relative w-full max-w-[400px] h-[250px] md:max-w-[550px] md:h-[320px] lg:max-w-[650px] lg:h-[380px] rounded-lg flex items-center justify-center overflow-hidden">
      <div className="w-[300px] h-[180px] max-h-[300px] md:w-[450px] md:h-[250px] lg:w-[550px] lg:h-[300px] bg-white text-center flex flex-col items-center justify-center px-4">
        <p className="text-gray-500 text-xs lg:text-base">
          Start your configuration by choosing the model that suits your needs.
        </p>
        <button
          onClick={openModal}
          className="mt-6 flex items-center justify-center space-x-1 lg:space-x-2 w-full max-w-40 lg:max-w-52 h-8 lg:h-10 text-white bg-[#3AAFA9] hover:bg-teal-600 transition-colors cursor-pointer"
        >
          <CirclePlus className="shrink-0 w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-xs lg:text-base">Configuration</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop overlay when positioning */}
      {imageSettings.isDragging && (
        <div className="fixed inset-0 backdrop-brightness-50 z-40 pointer-events-none" />
      )}

      <div className="flex-1 bg-gray-100 w-full h-80 lg:h-full px-2 mt-12 mb-28 lg:my-0 lg:p-4 flex items-center justify-center">
        {renderResetButton()}

        {/* Canvas Container */}
        <div className="relative m-auto flex justify-center items-center w-full">
          {/* Tutorial Card - only shows when positioning */}
          {renderTutorialCard()}

          {/* Size Warning Modal */}
          <SizeWarningModal />

          {configured && selectedModel && (
            <>
              {/* Total Wall Width */}
              <div
                className="absolute -top-3 border-t z-50 border-teal-400 pointer-events-none"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: `${dynamicCanvas.width}px`,
                }}
              >
                <span className="absolute left-1/2 -translate-x-1/2 -top-5 px-1 text-xs text-teal-600">
                  {parseFloat((Math.floor(wallWidth * 1000) / 1000).toString())}{" "}
                  m
                </span>
              </div>

              {/* Total Wall Height */}
              <div
                className="absolute border-l z-50 border-teal-400 pointer-events-none"
                style={{
                  top: "50%",
                  left: `calc(46% - ${dynamicCanvas.width / 2}px - 20px)`,
                  transform: "translateY(-50%)",
                  height: `${dynamicCanvas.height}px`,
                }}
              >
                <span
                  className="absolute top-1/2 -translate-y-1/2 -left-5 rotate-180 px-1 text-xs text-teal-600 whitespace-nowrap"
                  style={{ writingMode: "vertical-lr" }}
                >
                  {parseFloat(
                    (Math.floor(wallHeight * 1000) / 1000).toString()
                  )}{" "}
                  m
                </span>
              </div>
            </>
          )}
          {configured && selectedModel
            ? renderCanvasPreview()
            : renderEmptyCanvas()}
        </div>

        <div className="invisible lg:visible absolute bottom-2 right-2 w-auto p-3 text-xs text-white rounded-lg bg-black/40">
          <p>© 2025 MJ Solution Indonesia</p>
        </div>
      </div>

      <ConfigurationModal />
    </>
  );
};
