import React, { useState, useEffect } from "react";
import { FileDown, Eye, Info } from "lucide-react";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseExportStore } from "../store/UseExportStore";
import { ExportModal } from "./ExportModal";
import { ResultModal } from "./ResultModal";

export const Header = () => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const {
    screenSize,
    resolution,
    screenHeight,
    screenWidth,
    unit,
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
    getResolutionInfo,
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
  const resolutionInfo = getResolutionInfo();

  // Validation rules - Wall always bigger than Screen
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

  // Wall validation with minimum limits (5m width, 3m height)
  const canIncreaseWallWidth = true; // Wall can always increase
  const canDecreaseWallWidth =
    wallWidth > 5 && wallWidth > actualScreenSize.width + 1; // Cannot go below 5m and must keep margin
  const canIncreaseWallHeight = true; // Wall can always increase
  const canDecreaseWallHeight =
    wallHeight > 3 && wallHeight > actualScreenSize.height + 1; // Cannot go below 3m and must keep margin

  // Check if controls are interactive based on resolution mode
  const isCustomMode = resolution === "Custom";
  const controlsDisabled = !isScreenControlsEnabled() || !isCustomMode;

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
    isInteger = false, // New prop for cabinet count display
    showResolutionInfo = false, // New prop to show resolution mode info
  }) => (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <label className="text-xs text-gray-600">{label}</label>
      </div>
      <div
        className={`flex items-center justify-between w-[110px] border rounded bg-white ${
          disabled ? "border-gray-200 bg-gray-50" : "border-gray-300"
        }`}
      >
        <button
          onClick={onDecrement}
          disabled={disabled || !canDecrease}
          className={`px-3 py-2 ${
            disabled || !canDecrease
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          −
        </button>
        <input
          type="number"
          value={isInteger ? Math.round(value) : value.toFixed(1)}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          disabled={disabled || isInteger || !isCustomMode} // Disable input for cabinet count or non-custom mode
          className={`w-full text-center border-none outline-none text-xs
                    appearance-none
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none
                    ${
                      disabled || isInteger || !isCustomMode
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
              : "text-gray-500 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          +
        </button>
      </div>
    </div>
  );

  const ToggleButton = ({ options, selected, onChange, disabled = false }) => (
    <div className="flex border border-gray-300 rounded overflow-hidden bg-white">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !disabled && onChange(option)}
          disabled={disabled}
          className={`px-4 py-2 text-xs transition-colors ${
            disabled
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : selected === option
              ? "bg-[#3AAFA9] text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  const screenControlsEnabled = isScreenControlsEnabled();
  const wallControlsEnabled = isWallControlsEnabled();

  // Determine if we're in cabinet mode
  const isCabinetMode = screenSize === "Column/Row";

  return (
    <>
      <div className="bg-white border-gray-200 p-4">
        <div className="flex items-start justify-between w-full mx-auto">
          {/* Display Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-base font-medium text-gray-800">Display</h3>

            <div className="flex items-end space-x-6">
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

            <div className="flex items-end space-x-6">
              {isCabinetMode ? (
                // Cabinet Mode - Show cabinet counts
                <>
                  <NumberInput
                    label="Row Count"
                    value={cabinetCount.horizontal}
                    onIncrement={incrementCabinetWidth}
                    onDecrement={decrementCabinetWidth}
                    onChange={() => {}} // No direct input for cabinet count
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseCabinetWidth && isCustomMode}
                    canDecrease={canDecreaseCabinetWidth && isCustomMode}
                    isInteger={true}
                    showResolutionInfo={true}
                  />
                  <NumberInput
                    label="Column Count"
                    value={cabinetCount.vertical}
                    onIncrement={incrementCabinetHeight}
                    onDecrement={decrementCabinetHeight}
                    onChange={() => {}} // No direct input for cabinet count
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseCabinetHeight && isCustomMode}
                    canDecrease={canDecreaseCabinetHeight && isCustomMode}
                    isInteger={true}
                    showResolutionInfo={true}
                  />
                </>
              ) : (
                // Area Mode - Show screen dimensions in meters
                <>
                  <NumberInput
                    label="Screen Width(m)"
                    value={screenWidth}
                    onIncrement={incrementScreenWidth}
                    onDecrement={decrementScreenWidth}
                    onChange={setScreenWidth}
                    disabled={controlsDisabled}
                    canIncrease={canIncreaseScreenWidth && isCustomMode}
                    canDecrease={canDecreaseScreenWidth && isCustomMode}
                    showResolutionInfo={true}
                  />
                  <NumberInput
                    label="Screen Height(m)"
                    value={screenHeight}
                    onIncrement={incrementScreenHeight}
                    onDecrement={decrementScreenHeight}
                    onChange={setScreenHeight}
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

            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-600">Unit</label>
              <span className="px-4 py-2 text-xs rounded border bg-[#3AAFA9] text-white w-fit">
                Meter
              </span>
            </div>

            <div className="flex items-end space-x-6">
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

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 my-auto">
            <button
              onClick={openModal}
              className="flex items-center justify-center space-x-2 w-[144px] px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FileDown size={16} />
              <span className="text-xs">Export to PDF</span>
            </button>

            <button
              onClick={() => setIsResultModalOpen(true)}
              disabled={!isConfigured()}
              className={`flex items-center justify-center space-x-2 w-[144px] px-4 py-2 rounded text-xs transition-colors ${
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
