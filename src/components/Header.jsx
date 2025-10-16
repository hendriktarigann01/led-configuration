import React, { useState, useEffect } from "react";
import { FileDown, Eye, Info, ChevronDown, Check } from "lucide-react";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseExportStore } from "../store/UseExportStore";
import { ExportModal } from "./ExportModal";
import { ResultModal } from "./ResultModal";
import { processor } from "./canvas/ProcessorDropdown";

export const Header = () => {
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isProcessorDropdownOpen, setIsProcessorDropdownOpen] = useState(false);
  const [selectedProcessor, setSelectedProcessor] = useState(processor[0]);

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

  // Initialize defaults and sync on component mount
  useEffect(() => {
    initializeDefaults();
    syncWithCanvas();
  }, [initializeDefaults, syncWithCanvas]);

  // Get actual screen size and cabinet count for validation
  const actualScreenSize = getActualScreenSize();
  const cabinetCount = getCabinetCount();
  const configured = isConfigured();

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

  // Enhanced manual input handlers for cabinet count
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

  // Wall dimension handlers
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

  // Enhanced increment handlers
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

  const handleProcessorSelect = (proc) => {
    if (!configured) return;
    setSelectedProcessor(proc);
    setIsProcessorDropdownOpen(false);
  };

  const Tooltip = ({ children, text, show }) => {
    if (!show) return children;

    return (
      <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
        </div>
      </div>
    );
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
    readOnly = false,
    showTooltip = false,
    tooltipText = "",
  }) => (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <label className="text-xs text-gray-600">{label}</label>
      </div>
      <Tooltip text={tooltipText} show={showTooltip && disabled}>
        <div
          className={`flex items-center justify-between w-28 h-8 border rounded bg-white ${
            disabled ? "border-gray-200 bg-gray-50" : "border-gray-300"
          }`}
        >
          <button
            onClick={onDecrement}
            disabled={disabled || !canDecrease}
            className={`px-2 py-2 ${
              disabled || !canDecrease
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-600 cursor-pointer"
            }`}
          >
            −
          </button>

          <input
            type="number"
            value={isInteger ? Math.round(value) : value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            step={step}
            disabled={disabled}
            readOnly={readOnly || (isInteger && !isCustomMode)}
            className={`w-full text-center border-none outline-none text-xs
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                      ${
                        disabled || readOnly || (isInteger && !isCustomMode)
                          ? "text-gray-600"
                          : "text-gray-600"
                      }`}
          />
          <button
            onClick={onIncrement}
            disabled={disabled || !canIncrease}
            className={`px-3 py-2 ${
              disabled || !canIncrease
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-600 cursor-pointer"
            }`}
          >
            +
          </button>
        </div>
      </Tooltip>
    </div>
  );

  const ToggleButton = ({
    options,
    selected,
    onChange,
    disabled = false,
    showTooltip = false,
    tooltipText = "",
  }) => (
    <Tooltip text={tooltipText} show={showTooltip && disabled}>
      <div className="flex border w-auto border-gray-300 rounded overflow-hidden bg-white">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => !disabled && onChange(option)}
            disabled={disabled}
            className={`px-3 lg:px-4 py-2 w-full text-xs transition-colors ${
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
    </Tooltip>
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
                  disabled={!screenControlsEnabled || isMoveMode}
                  showTooltip={isMoveMode}
                  tooltipText="Disabled during Move Screen mode"
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
                  disabled={!screenControlsEnabled || isMoveMode}
                  showTooltip={isMoveMode}
                  tooltipText="Disabled during Move Screen mode"
                />
              </div>
            </div>

            <div className="flex gap-5 lg:gap-0 lg:flex-row lg:items-end space-y-4 lg:space-y-0 space-x-3 lg:space-x-6">
              {isCabinetMode ? (
                // Cabinet Mode - Show cabinet counts (CAN BE MANUALLY INPUT)
                <>
                  <NumberInput
                    label="Column Count"
                    value={cabinetCount.horizontal}
                    onIncrement={handleCabinetWidthIncrement}
                    onDecrement={decrementCabinetWidth}
                    onChange={handleCabinetWidthChange}
                    disabled={controlsDisabled || isMoveMode}
                    canIncrease={
                      canIncreaseCabinetWidth && isCustomMode && !isMoveMode
                    }
                    canDecrease={
                      canDecreaseCabinetWidth && isCustomMode && !isMoveMode
                    }
                    isInteger={true}
                    readOnly={false}
                    showTooltip={isMoveMode}
                    tooltipText="Disabled during Move Screen mode"
                  />

                  <NumberInput
                    label="Row Count"
                    value={cabinetCount.vertical}
                    onIncrement={handleCabinetHeightIncrement}
                    onDecrement={decrementCabinetHeight}
                    onChange={handleCabinetHeightChange}
                    disabled={controlsDisabled || isMoveMode}
                    canIncrease={
                      canIncreaseCabinetHeight && isCustomMode && !isMoveMode
                    }
                    canDecrease={
                      canDecreaseCabinetHeight && isCustomMode && !isMoveMode
                    }
                    isInteger={true}
                    readOnly={false}
                    showTooltip={isMoveMode}
                    tooltipText="Disabled during Move Screen mode"
                  />
                </>
              ) : (
                // Area Mode - Show screen dimensions (READ ONLY - cannot be manually input)
                <>
                  <NumberInput
                    label="Screen Width(m)"
                    value={screenWidth}
                    onIncrement={handleScreenWidthIncrement}
                    onDecrement={decrementScreenWidth}
                    onChange={() => {}}
                    disabled={controlsDisabled || isMoveMode}
                    canIncrease={
                      canIncreaseScreenWidth && isCustomMode && !isMoveMode
                    }
                    canDecrease={
                      canDecreaseScreenWidth && isCustomMode && !isMoveMode
                    }
                    readOnly={true}
                    showTooltip={isMoveMode}
                    tooltipText="Disabled during Move Screen mode"
                  />

                  <NumberInput
                    label="Screen Height(m)"
                    value={screenHeight}
                    onIncrement={handleScreenHeightIncrement}
                    onDecrement={decrementScreenHeight}
                    onChange={() => {}}
                    disabled={controlsDisabled || isMoveMode}
                    canIncrease={
                      canIncreaseScreenHeight && isCustomMode && !isMoveMode
                    }
                    canDecrease={
                      canDecreaseScreenHeight && isCustomMode && !isMoveMode
                    }
                    readOnly={true}
                    showTooltip={isMoveMode}
                    tooltipText="Disabled during Move Screen mode"
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
              <div className="flex space-x-8 lg:space-x-0 space-y-4 lg:space-y-0">
                {/* Unit */}
                <div className="flex flex-col space-y-1 ">
                  <label className="text-xs text-gray-600">Unit</label>
                  <span className="px-4 py-2 text-xs rounded border bg-[#3AAFA9] text-white justify-center text-center w-[90px] lg:w-fit h-8 lg:h-auto">
                    Meter
                  </span>
                </div>

                {/* Mobile: Height & Width ikut sejajar, Desktop: dipindah ke bawah */}
                <div className="flex flex-row space-x-8 lg:hidden">
                  <NumberInput
                    label="Wall Width(m)"
                    value={wallWidth}
                    onIncrement={incrementWallWidth}
                    onDecrement={decrementWallWidth}
                    onChange={handleWallWidthChange}
                    step={0.1}
                    disabled={!wallControlsEnabled || isMoveMode}
                    canIncrease={canIncreaseWallWidth && !isMoveMode}
                    canDecrease={canDecreaseWallWidth && !isMoveMode}
                    readOnly={false}
                    showTooltip={isMoveMode}
                    tooltipText="Disabled during Move Screen mode"
                  />
                  <NumberInput
                    label="Wall Height(m)"
                    value={wallHeight}
                    onIncrement={incrementWallHeight}
                    onDecrement={decrementWallHeight}
                    onChange={handleWallHeightChange}
                    step={0.1}
                    disabled={!wallControlsEnabled || isMoveMode}
                    canIncrease={canIncreaseWallHeight && !isMoveMode}
                    canDecrease={canDecreaseWallHeight && !isMoveMode}
                    readOnly={false}
                    showTooltip={isMoveMode}
                    tooltipText="Disabled during Move Screen mode"
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
                  onChange={handleWallWidthChange}
                  step={0.1}
                  disabled={!wallControlsEnabled || isMoveMode}
                  canIncrease={canIncreaseWallWidth && !isMoveMode}
                  canDecrease={canDecreaseWallWidth && !isMoveMode}
                  readOnly={false}
                  showTooltip={isMoveMode}
                  tooltipText="Disabled during Move Screen mode"
                />
                <NumberInput
                  label="Wall Height(m)"
                  value={wallHeight}
                  onIncrement={incrementWallHeight}
                  onDecrement={decrementWallHeight}
                  onChange={handleWallHeightChange}
                  step={0.1}
                  disabled={!wallControlsEnabled || isMoveMode}
                  canIncrease={canIncreaseWallHeight && !isMoveMode}
                  canDecrease={canDecreaseWallHeight && !isMoveMode}
                  readOnly={false}
                  showTooltip={isMoveMode}
                  tooltipText="Disabled during Move Screen mode"
                />
              </div>
            </div>
          </div>

          {/* Processor Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-base font-medium text-gray-800">
              Control System
            </h3>

            <div className="flex flex-col lg:space-y-2 w-44">
              <div className="flex space-x-4 lg:space-x-0 space-y-4 lg:space-y-0">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs text-gray-600">Processor</label>

                  {/* Processor Image & Info */}
                  <div className="flex w-32 h-w-24 justify-between lg:w-14 lg:h-14">
                    <img
                      src="/processor-1.png"
                      alt="Processor"
                      className={`w-full h-full ${
                        !configured ? "opacity-50 grayscale" : ""
                      }`}
                    />
                    <div className="flex items-center space-x-2 ml-10 lg:ml-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Info
                            size={12}
                            className={
                              configured ? "text-gray-400" : "text-gray-300"
                            }
                          />
                          <p
                            className={`text-xs ${
                              configured ? "text-gray-400" : "text-gray-300"
                            }`}
                          >
                            Detail
                          </p>
                        </div>

                        {/* Mobile Dropdown */}
                        <div className="relative z-40 lg:hidden">
                          <Tooltip
                            text="Please configure a model first"
                            show={!configured}
                          >
                            <button
                              onClick={() =>
                                configured &&
                                setIsProcessorDropdownOpen(
                                  !isProcessorDropdownOpen
                                )
                              }
                              disabled={!configured}
                              className={`w-48 h-8 px-3 py-2 flex items-center justify-between text-xs font-light ${
                                isProcessorDropdownOpen
                                  ? "rounded-t"
                                  : "rounded"
                              } ${
                                configured
                                  ? "bg-[#3AAFA9] text-white cursor-pointer"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              <span>{selectedProcessor.name}</span>
                              <ChevronDown
                                size={18}
                                className={`transition-transform duration-200 ${
                                  isProcessorDropdownOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </Tooltip>

                          {isProcessorDropdownOpen && configured && (
                            <div
                              className="absolute z-10 w-48 bg-[#3AAFA9] rounded-b max-h-64 overflow-y-auto"
                              style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                              }}
                            >
                              <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                              {processor.map((proc) => (
                                <div
                                  key={proc.id}
                                  onClick={() => handleProcessorSelect(proc)}
                                  className={`px-3 py-2 text-xs font-light cursor-pointer transition-colors ${
                                    selectedProcessor.id === proc.id
                                      ? "bg-gray-200 text-[#3AAFA9] flex items-center gap-2 mx-2 my-1"
                                      : "text-white hover:border border-gray-200 mx-2 my-1"
                                  }`}
                                >
                                  {selectedProcessor.id === proc.id && (
                                    <Check size={16} />
                                  )}
                                  <span>{proc.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Dropdown */}
                  <div className="relative z-40 hidden lg:block">
                    <Tooltip
                      text="Please configure a model first"
                      show={!configured}
                    >
                      <button
                        onClick={() =>
                          configured &&
                          setIsProcessorDropdownOpen(!isProcessorDropdownOpen)
                        }
                        disabled={!configured}
                        className={`w-40 h-8 px-3 py-2 flex items-center justify-between text-xs font-light ${
                          isProcessorDropdownOpen ? "rounded-t" : "rounded"
                        } ${
                          configured
                            ? "bg-[#3AAFA9] text-white cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <span>{selectedProcessor.name}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${
                            isProcessorDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </Tooltip>

                    {isProcessorDropdownOpen && configured && (
                      <div
                        className="absolute z-10 w-40 bg-[#3AAFA9] rounded-b max-h-64 overflow-y-auto"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                        {processor.map((proc) => (
                          <div
                            key={proc.id}
                            onClick={() => handleProcessorSelect(proc)}
                            className={`px-2 py-2 text-xs font-light cursor-pointer transition-colors ${
                              selectedProcessor.id === proc.id
                                ? "bg-gray-200 text-[#3AAFA9] flex items-center gap-2 mx-2 my-1"
                                : "text-white hover:border border-gray-200 mx-2 my-1"
                            }`}
                          >
                            {selectedProcessor.id === proc.id && (
                              <Check size={16} />
                            )}
                            <span>{proc.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
