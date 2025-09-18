import React, { useState, useEffect } from "react";
import { FileDown, Eye } from "lucide-react";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseExportStore } from "../store/UseExportStore";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { ExportModal } from "./ExportModal";
import { ResultModal } from "./ResultModal";

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
  } = UseCanvasStore();
  const { openModal } = UseExportStore();

  // Initialize defaults and sync on component mount
  useEffect(() => {
    initializeDefaults();
    syncWithCanvas();
  }, [initializeDefaults, syncWithCanvas]);

  // Get actual screen size and cabinet count for validation
  const actualScreenSize = getActualScreenSize();
  const cabinetCount = getCabinetCount();

  // Validation rules - Wall must be >= Screen (exact match allowed)
  const canIncreaseScreenWidth =
    actualScreenSize.width + baseWidth <= wallWidth;
  const canDecreaseScreenWidth = actualScreenSize.width > baseWidth;
  const canIncreaseScreenHeight =
    actualScreenSize.height + baseHeight <= wallHeight;
  const canDecreaseScreenHeight = actualScreenSize.height > baseHeight;

  // Cabinet validation (same logic but different display)
  const canIncreaseCabinetWidth = canIncreaseScreenWidth;
  const canDecreaseCabinetWidth =
    canDecreaseScreenWidth && cabinetCount.horizontal > 1;
  const canIncreaseCabinetHeight = canIncreaseScreenHeight;
  const canDecreaseCabinetHeight =
    canDecreaseScreenHeight && cabinetCount.vertical > 1;

  // Wall validation - wall can be reduced to match screen size but minimum 1m
  const canIncreaseWallWidth = true;
  const canDecreaseWallWidth = wallWidth > Math.max(1, actualScreenSize.width);
  const canIncreaseWallHeight = true;
  const canDecreaseWallHeight =
    wallHeight > Math.max(1, actualScreenSize.height);

  const screenControlsEnabled = isScreenControlsEnabled();
  const wallControlsEnabled = isWallControlsEnabled();
  const isCustomMode = resolution === "Custom";
  const controlsDisabled = !screenControlsEnabled || !isCustomMode;

  // Validation for manual input - check if input value will exceed wall limits
  const validateScreenInput = (value, type) => {
    if (type === "width") {
      const maxWidth = Math.floor(wallWidth / baseWidth) * baseWidth;
      return Math.min(value, maxWidth);
    } else {
      const maxHeight = Math.floor(wallHeight / baseHeight) * baseHeight;
      return Math.min(value, maxHeight);
    }
  };

  // Enhanced manual input handlers
  const handleScreenWidthChange = (value) => {
    if (!isCustomMode) return;
    const validatedValue = validateScreenInput(value, "width");
    setScreenWidth(validatedValue);
  };

  const handleScreenHeightChange = (value) => {
    if (!isCustomMode) return;
    const validatedValue = validateScreenInput(value, "height");
    setScreenHeight(validatedValue);
  };

  // Enhanced manual input handlers for cabinet count
  const handleCabinetWidthChange = (value) => {
    if (!isCustomMode) return;

    const newCabinetCount = Math.round(Math.max(1, value));
    const maxColumns = Math.floor(wallWidth / baseWidth);
    const validatedCount = Math.min(newCabinetCount, maxColumns);

    const newScreenWidth = validatedCount * baseWidth;
    setScreenWidth(newScreenWidth);
  };

  const handleCabinetHeightChange = (value) => {
    if (!isCustomMode) return;

    const newCabinetCount = Math.round(Math.max(1, value));
    const maxRows = Math.floor(wallHeight / baseHeight);
    const validatedCount = Math.min(newCabinetCount, maxRows);

    const newScreenHeight = validatedCount * baseHeight;
    setScreenHeight(newScreenHeight);
  };

  // Calculate maximum possible screen dimensions based on current wall
  const getMaxScreenDimensions = () => {
    const maxWidth = Math.floor(wallWidth / baseWidth) * baseWidth;
    const maxHeight = Math.floor(wallHeight / baseHeight) * baseHeight;
    return { maxWidth, maxHeight };
  };

  // Calculate maximum cabinet count
  const getMaxCabinetCount = () => {
    const maxColumns = Math.floor(wallWidth / baseWidth);
    const maxRows = Math.floor(wallHeight / baseHeight);
    return { maxColumns, maxRows };
  };

  // Enhanced increment handlers - removed warning, just prevent increment
  const handleScreenWidthIncrement = () => {
    if (!canIncreaseScreenWidth) return;
    incrementScreenWidth();
  };

  const handleScreenHeightIncrement = () => {
    if (!canIncreaseScreenHeight) return;
    incrementScreenHeight();
  };

  const handleCabinetWidthIncrement = () => {
    if (!canIncreaseCabinetWidth) return;
    incrementCabinetWidth();
  };

  const handleCabinetHeightIncrement = () => {
    if (!canIncreaseCabinetHeight) return;
    incrementCabinetHeight();
  };

  const NumberInput = ({
    label,
    value,
    onIncrement,
    onDecrement,
    onChange,
    step = 0.01,
    disabled = false,
    canIncrease = true,
    canDecrease = true,
    isInteger = false,
  }) => (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <label className="text-xs text-gray-600">{label}</label>
      </div>
      <div
        className={`flex items-center justify-between w-[110px] h-8 lg:h-auto border rounded bg-white ${
          disabled ? "border-gray-200 bg-gray-50" : "border-gray-300"
        }`}
      >
        <button
          onClick={onDecrement}
          disabled={disabled || !canDecrease}
          className={`px-3 py-2 ${
            disabled || !canDecrease
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          −
        </button>
        <input
          type="number"
          value={isInteger ? Math.round(value) : value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          disabled={disabled || isInteger || !isCustomMode}
          className={`w-full text-center border-none outline-none text-xs
                     
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                      ${
                        disabled || (isInteger && !isCustomMode)
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                          : "text-gray-600"
                      }`}
        />
        <button
          onClick={onIncrement}
          disabled={disabled || !canIncrease}
          className={`px-3 py-2 ${
            disabled || !canIncrease
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );

  const ToggleButton = ({ options, selected, onChange, disabled = false }) => (
    <div className="flex border w-auto border-gray-300 rounded overflow-hidden bg-white">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !disabled && onChange(option)}
          disabled={disabled}
          className={`px-4 py-2 w-full text-xs transition-colors ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : selected === option
              ? "bg-[#3AAFA9] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50 cursor-pointer"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  // Determine if we're in cabinet mode
  const isCabinetMode = screenSize === "Column/Row";

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
          <div className="flex flex-col space-y-2">
            <h3 className="text-base font-medium text-gray-800">Display</h3>

            <div className="flex justify-between lg:flex-row lg:items-end space-y-4 lg:space-y-0 gap-2 lg:space-x-6">
              <div className="flex flex-col space-y-1">
                <label className="text-xs text-gray-600">Screen Size</label>
                <ToggleButton
                  options={["Area", "Column/Row"]}
                  selected={screenSize}
                  onChange={setScreenSize}
                  disabled={!screenControlsEnabled}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <label className="text-xs text-gray-600">Resolution</label>
                </div>
                <ToggleButton
                  options={["Custom", "FHD", "UHD"]}
                  selected={resolution}
                  onChange={setResolution}
                  disabled={!screenControlsEnabled}
                />
              </div>
            </div>

            <div className="flex gap-5 lg:gap-0 lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
              {isCabinetMode ? (
                // Cabinet Mode - Show cabinet counts with enhanced handlers
                <>
                  <NumberInput
                    label="Column Count"
                    value={cabinetCount.horizontal}
                    onIncrement={handleCabinetWidthIncrement}
                    onDecrement={decrementCabinetWidth}
                    onChange={handleCabinetWidthChange} // Tambahkan fungsi ini
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseCabinetWidth && isCustomMode}
                    canDecrease={canDecreaseCabinetWidth && isCustomMode}
                    isInteger={true}
                    showResolutionInfo={true}
                  />
                  <NumberInput
                    label="Row Count"
                    value={cabinetCount.vertical}
                    onIncrement={handleCabinetHeightIncrement}
                    onDecrement={decrementCabinetHeight}
                    onChange={handleCabinetHeightChange} // Tambahkan fungsi ini
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseCabinetHeight && isCustomMode}
                    canDecrease={canDecreaseCabinetHeight && isCustomMode}
                    isInteger={true}
                    showResolutionInfo={true}
                  />
                </>
              ) : (
                // Area Mode - Show screen dimensions with enhanced handlers
                <>
                  <NumberInput
                    label="Screen Width(m)"
                    value={screenWidth}
                    onIncrement={handleScreenWidthIncrement}
                    onDecrement={decrementScreenWidth}
                    onChange={handleScreenWidthChange}
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseScreenWidth && isCustomMode}
                    canDecrease={canDecreaseScreenWidth && isCustomMode}
                    showResolutionInfo={true}
                  />
                  <NumberInput
                    label="Screen Height(m)"
                    value={screenHeight}
                    onIncrement={handleScreenHeightIncrement}
                    onDecrement={decrementScreenHeight}
                    onChange={handleScreenHeightChange}
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseScreenHeight && isCustomMode}
                    canDecrease={canDecreaseScreenHeight && isCustomMode}
                    showResolutionInfo={true}
                  />
                </>
              )}
            </div>
          </div>

          {/* Wall Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-base font-medium text-gray-800">Wall</h3>

            {/* Container utama */}
            <div className="flex flex-col lg:space-y-2">
              {/* Mobile: semua horizontal, Desktop: unit sendiri */}
              <div className="flex space-x-4 lg:space-x-0 space-y-4 lg:space-y-0">
                {/* Unit */}
                <div className="flex flex-col space-y-1 ">
                  <label className="text-xs text-gray-600">Unit</label>
                  <span className="px-4 py-2 text-xs rounded border bg-[#3AAFA9] text-white justify-center text-center w-[110px] lg:w-fit h-[32px] lg:h-auto">
                    Meter
                  </span>
                </div>

                {/* Mobile: Height & Width ikut sejajar, Desktop: dipindah ke bawah */}
                <div className="flex flex-row space-x-4 lg:hidden">
                  <NumberInput
                    label="Wall Width(m)"
                    value={wallWidth}
                    onIncrement={incrementWallWidth}
                    onDecrement={decrementWallWidth}
                    onChange={setWallWidth}
                    step={0.1}
                    disabled={!wallControlsEnabled}
                    canIncrease={canIncreaseWallWidth}
                    canDecrease={canDecreaseWallWidth}
                  />
                  <NumberInput
                    label="Wall Height(m)"
                    value={wallHeight}
                    onIncrement={incrementWallHeight}
                    onDecrement={decrementWallHeight}
                    onChange={setWallHeight}
                    step={0.1}
                    disabled={!wallControlsEnabled}
                    canIncrease={canIncreaseWallHeight}
                    canDecrease={canDecreaseWallHeight}
                  />
                </div>
              </div>

              {/* Desktop: Height & Width horizontal */}
              <div className="hidden lg:flex lg:flex-row lg:space-x-6">
                <NumberInput
                  label="Wall Width(m)"
                  value={wallWidth}
                  onIncrement={incrementWallWidth}
                  onDecrement={decrementWallWidth}
                  onChange={setWallWidth}
                  step={0.1}
                  disabled={!wallControlsEnabled}
                  canIncrease={canIncreaseWallWidth}
                  canDecrease={canDecreaseWallWidth}
                />
                <NumberInput
                  label="Wall Height(m)"
                  value={wallHeight}
                  onIncrement={incrementWallHeight}
                  onDecrement={decrementWallHeight}
                  onChange={setWallHeight}
                  step={0.1}
                  disabled={!wallControlsEnabled}
                  canIncrease={canIncreaseWallHeight}
                  canDecrease={canDecreaseWallHeight}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center lg:flex-col space-y-2 gap-5 lg:gap-0 my-auto">
            <button
              onClick={openModal}
              disabled={!isConfigured()}
              className={`flex items-center justify-center space-x-2 h-8 lg:h-auto px-4 py-2 rounded text-xs transition-colors ${
                isConfigured()
                  ? "cursor-pointer bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  : "cursor-not-allowed bg-gray-100 border border-gray-200 text-gray-400"
              }`}
            >
              <FileDown size={16} />
              <span className="text-xs">Export to PDF</span>
            </button>

            <button
              onClick={() => setIsResultModalOpen(true)}
              disabled={!isConfigured()}
              className={`flex items-center justify-center space-x-2 h-8 lg:h-auto px-4 py-2 rounded text-xs transition-colors ${
                isConfigured()
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
