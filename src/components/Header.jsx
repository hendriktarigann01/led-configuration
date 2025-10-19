import React, { useState, useEffect } from "react";
import { FileDown, Eye } from "lucide-react";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseExportStore } from "../store/UseExportStore";
import { UseProcessorStore } from "../store/UseProcessorStore";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { ExportModal } from "./ExportModal";
import { ResultModal } from "./ResultModal";
import { DisplayControls } from "./header/DisplayControls";
import { WallControls } from "./header/WallControls";
import { ProcessorSection } from "./header/ProcessorSection";

export const Header = () => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const {
    screenSize,
    resolution,
    screenHeight,
    screenWidth,
    wallHeight,
    wallWidth,
    setScreenSize,
    setResolution,
    setScreenHeight,
    setScreenWidth,
    setWallHeight,
    setWallWidth,
    incrementScreenHeight,
    decrementScreenHeight,
    incrementScreenWidth,
    decrementScreenWidth,
    incrementWallHeight,
    decrementWallHeight,
    incrementWallWidth,
    decrementWallWidth,
    isScreenControlsEnabled,
    isWallControlsEnabled,
    initializeDefaults,
    syncWithCanvas,
    incrementCabinetWidth,
    decrementCabinetWidth,
    incrementCabinetHeight,
    decrementCabinetHeight,
  } = UseHeaderStore();

  const {
    baseWidth,
    baseHeight,
    getActualScreenSize,
    isConfigured,
    getCabinetCount,
    isMoveMode,
  } = UseCanvasStore();

  const { openModal } = UseExportStore();
  const { updateResolution } = UseProcessorStore();
  const { selectedModel } = UseNavbarStore();

  useEffect(() => {
    initializeDefaults();
    syncWithCanvas();
  }, [initializeDefaults, syncWithCanvas]);

  useEffect(() => {
    if (isConfigured() && selectedModel?.modelData) {
      updateResolution(
        selectedModel.modelData,
        screenWidth,
        screenHeight,
        baseWidth,
        baseHeight
      );
    }
  }, [
    screenWidth,
    screenHeight,
    baseWidth,
    baseHeight,
    selectedModel,
    isConfigured,
    updateResolution,
  ]);

  const actualScreenSize = getActualScreenSize();
  const cabinetCount = getCabinetCount();
  const configured = isConfigured();

  const canIncreaseScreenWidth =
    actualScreenSize.width + baseWidth <= wallWidth;
  const canDecreaseScreenWidth = actualScreenSize.width > baseWidth;
  const canIncreaseScreenHeight =
    actualScreenSize.height + baseHeight <= wallHeight;
  const canDecreaseScreenHeight = actualScreenSize.height > baseHeight;

  const canIncreaseCabinetWidth = canIncreaseScreenWidth;
  const canDecreaseCabinetWidth =
    canDecreaseScreenWidth && cabinetCount.horizontal > 1;
  const canIncreaseCabinetHeight = canIncreaseScreenHeight;
  const canDecreaseCabinetHeight =
    canDecreaseScreenHeight && cabinetCount.vertical > 1;

  const canIncreaseWallWidth = true;
  const canDecreaseWallWidth = wallWidth > Math.max(1, actualScreenSize.width);
  const canIncreaseWallHeight = true;
  const canDecreaseWallHeight =
    wallHeight > Math.max(1, actualScreenSize.height);

  const screenControlsEnabled = isScreenControlsEnabled();
  const wallControlsEnabled = isWallControlsEnabled();
  const isCustomMode = resolution === "Custom";

  const toggleButtonsDisabled = !screenControlsEnabled;

  const numberInputsDisabled =
    !screenControlsEnabled || !isCustomMode || isMoveMode;

  const handleCabinetWidthChange = (value) => {
    if (!isCustomMode || isMoveMode) return;

    const newCabinetCount = Math.round(Math.max(1, value));
    const maxColumns = Math.floor(wallWidth / baseWidth);
    const validatedCount = Math.min(newCabinetCount, maxColumns);

    const newScreenWidth = validatedCount * baseWidth;
    setScreenWidth(newScreenWidth);
  };

  const handleCabinetHeightChange = (value) => {
    if (!isCustomMode || isMoveMode) return;

    const newCabinetCount = Math.round(Math.max(1, value));
    const maxRows = Math.floor(wallHeight / baseHeight);
    const validatedCount = Math.min(newCabinetCount, maxRows);

    const newScreenHeight = validatedCount * baseHeight;
    setScreenHeight(newScreenHeight);
  };

  const handleWallWidthChange = (value) => {
    if (isMoveMode) return;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setWallWidth(parsedValue);
    }
  };

  const handleWallHeightChange = (value) => {
    if (isMoveMode) return;
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setWallHeight(parsedValue);
    }
  };

  const handleScreenWidthIncrement = () => {
    if (!canIncreaseScreenWidth || isMoveMode) return;
    incrementScreenWidth();
  };

  const handleScreenHeightIncrement = () => {
    if (!canIncreaseScreenHeight || isMoveMode) return;
    incrementScreenHeight();
  };

  const handleCabinetWidthIncrement = () => {
    if (!canIncreaseCabinetWidth || isMoveMode) return;
    incrementCabinetWidth();
  };

  const handleCabinetHeightIncrement = () => {
    if (!canIncreaseCabinetHeight || isMoveMode) return;
    incrementCabinetHeight();
  };

  return (
    <>
      <div className="bg-white border-gray-200 p-5">
        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center mb-4">
          <img
            src="/logo/mjs_logo_text.png"
            alt="logo"
            className="w-32 h-auto"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full mx-auto space-y-2 lg:space-y-0">
          {/* Display Section */}
          <DisplayControls
            screenSize={screenSize}
            setScreenSize={setScreenSize}
            resolution={resolution}
            setResolution={setResolution}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            cabinetCount={cabinetCount}
            onScreenWidthIncrement={handleScreenWidthIncrement}
            onScreenHeightIncrement={handleScreenHeightIncrement}
            onScreenWidthDecrement={decrementScreenWidth}
            onScreenHeightDecrement={decrementScreenHeight}
            onCabinetWidthIncrement={handleCabinetWidthIncrement}
            onCabinetHeightIncrement={handleCabinetHeightIncrement}
            onCabinetWidthDecrement={decrementCabinetWidth}
            onCabinetHeightDecrement={decrementCabinetHeight}
            onCabinetWidthChange={handleCabinetWidthChange}
            onCabinetHeightChange={handleCabinetHeightChange}
            canIncreaseScreenWidth={canIncreaseScreenWidth}
            canDecreaseScreenWidth={canDecreaseScreenWidth}
            canIncreaseScreenHeight={canIncreaseScreenHeight}
            canDecreaseScreenHeight={canDecreaseScreenHeight}
            canIncreaseCabinetWidth={canIncreaseCabinetWidth}
            canDecreaseCabinetWidth={canDecreaseCabinetWidth}
            canIncreaseCabinetHeight={canIncreaseCabinetHeight}
            canDecreaseCabinetHeight={canDecreaseCabinetHeight}
            toggleButtonsDisabled={toggleButtonsDisabled}
            numberInputsDisabled={numberInputsDisabled}
            isMoveMode={isMoveMode}
          />

          {/* Wall Section */}
          <WallControls
            wallWidth={wallWidth}
            wallHeight={wallHeight}
            onWallWidthChange={handleWallWidthChange}
            onWallHeightChange={handleWallHeightChange}
            onWallWidthIncrement={incrementWallWidth}
            onWallHeightIncrement={incrementWallHeight}
            onWallWidthDecrement={decrementWallWidth}
            onWallHeightDecrement={decrementWallHeight}
            canIncreaseWallWidth={canIncreaseWallWidth}
            canDecreaseWallWidth={canDecreaseWallWidth}
            canIncreaseWallHeight={canIncreaseWallHeight}
            canDecreaseWallHeight={canDecreaseWallHeight}
            wallControlsEnabled={wallControlsEnabled}
            isMoveMode={isMoveMode}
          />

          <ProcessorSection configured={configured} />

          {/* Action Buttons */}
          <div className="flex justify-center lg:flex-col space-y-2 gap-5 lg:gap-0 my-auto">
            <button
              onClick={openModal}
              disabled={!configured}
              className={`flex items-center justify-center space-x-2 h-8 lg:w-[144px] max-w-40 lg:h-auto px-4 py-2 rounded text-xs transition-colors ${
                configured
                  ? "cursor-pointer bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  : "cursor-not-allowed bg-gray-100 border border-gray-200 text-gray-400"
              }`}
            >
              <FileDown size={16} />
              <span className="text-xs">Export to PDF</span>
            </button>

            <button
              onClick={() => setIsResultModalOpen(true)}
              disabled={!configured}
              className={`flex items-center justify-center space-x-2 h-8 lg:w-[144px] max-w-40 lg:h-auto px-4 py-2 rounded text-xs transition-colors ${
                configured
                  ? "cursor-pointer bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  : "cursor-not-allowed bg-gray-100 border border-gray-200 text-gray-400"
              }`}
            >
              <Eye size={16} />
              <span>View Result</span>
            </button>
          </div>
        </div>
      </div>

      <ExportModal />
      <ResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
      />
    </>
  );
};
