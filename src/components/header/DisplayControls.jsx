import React from "react";

export const DisplayControls = ({
  screenSize,
  setScreenSize,
  resolution,
  setResolution,
  screenWidth,
  screenHeight,
  cabinetCount,
  onScreenWidthIncrement,
  onScreenHeightIncrement,
  onScreenWidthDecrement,
  onScreenHeightDecrement,
  onCabinetWidthIncrement,
  onCabinetHeightIncrement,
  onCabinetWidthDecrement,
  onCabinetHeightDecrement,
  onCabinetWidthChange,
  onCabinetHeightChange,
  canIncreaseScreenWidth,
  canDecreaseScreenWidth,
  canIncreaseScreenHeight,
  canDecreaseScreenHeight,
  canIncreaseCabinetWidth,
  canDecreaseCabinetWidth,
  canIncreaseCabinetHeight,
  canDecreaseCabinetHeight,
  // FIXED: Separate disabled states for toggle buttons vs number inputs
  toggleButtonsDisabled,
  numberInputsDisabled,
  isMoveMode,
}) => {
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
            readOnly={readOnly || (isInteger && resolution !== "Custom")}
            className={`w-full text-center border-none outline-none text-xs
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                      ${
                        disabled ||
                        readOnly ||
                        (isInteger && resolution !== "Custom")
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

  const isCabinetMode = screenSize === "Column/Row";

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-base font-medium text-gray-800">Display</h3>

      <div className="flex justify-between lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-600">Screen Size</label>
          <ToggleButton
            options={["Area", "Column/Row"]}
            selected={screenSize}
            onChange={setScreenSize}
            disabled={toggleButtonsDisabled || isMoveMode}
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
            disabled={toggleButtonsDisabled || isMoveMode}
            showTooltip={isMoveMode}
            tooltipText="Disabled during Move Screen mode"
          />
        </div>
      </div>

      <div className="flex gap-5 lg:gap-0 lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-6">
        {isCabinetMode ? (
          <>
            <NumberInput
              label="Column Count"
              value={cabinetCount.horizontal}
              onIncrement={onCabinetWidthIncrement}
              onDecrement={onCabinetWidthDecrement}
              onChange={onCabinetWidthChange}
              disabled={numberInputsDisabled}
              canIncrease={
                canIncreaseCabinetWidth &&
                resolution === "Custom" &&
                !isMoveMode
              }
              canDecrease={
                canDecreaseCabinetWidth &&
                resolution === "Custom" &&
                !isMoveMode
              }
              isInteger={true}
              readOnly={false}
              showTooltip={isMoveMode}
              tooltipText="Disabled during Move Screen mode"
            />

            <NumberInput
              label="Row Count"
              value={cabinetCount.vertical}
              onIncrement={onCabinetHeightIncrement}
              onDecrement={onCabinetHeightDecrement}
              onChange={onCabinetHeightChange}
              disabled={numberInputsDisabled}
              canIncrease={
                canIncreaseCabinetHeight &&
                resolution === "Custom" &&
                !isMoveMode
              }
              canDecrease={
                canDecreaseCabinetHeight &&
                resolution === "Custom" &&
                !isMoveMode
              }
              isInteger={true}
              readOnly={false}
              showTooltip={isMoveMode}
              tooltipText="Disabled during Move Screen mode"
            />
          </>
        ) : (
          <>
            <NumberInput
              label="Screen Width(m)"
              value={screenWidth}
              onIncrement={onScreenWidthIncrement}
              onDecrement={onScreenWidthDecrement}
              onChange={() => {}}
              disabled={numberInputsDisabled}
              canIncrease={
                canIncreaseScreenWidth && resolution === "Custom" && !isMoveMode
              }
              canDecrease={
                canDecreaseScreenWidth && resolution === "Custom" && !isMoveMode
              }
              readOnly={true}
              showTooltip={isMoveMode}
              tooltipText="Disabled during Move Screen mode"
            />

            <NumberInput
              label="Screen Height(m)"
              value={screenHeight}
              onIncrement={onScreenHeightIncrement}
              onDecrement={onScreenHeightDecrement}
              onChange={() => {}}
              disabled={numberInputsDisabled}
              canIncrease={
                canIncreaseScreenHeight &&
                resolution === "Custom" &&
                !isMoveMode
              }
              canDecrease={
                canDecreaseScreenHeight &&
                resolution === "Custom" &&
                !isMoveMode
              }
              readOnly={true}
              showTooltip={isMoveMode}
              tooltipText="Disabled during Move Screen mode"
            />
          </>
        )}
      </div>
    </div>
  );
};
