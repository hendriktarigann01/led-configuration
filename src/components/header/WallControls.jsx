import React from "react";

export const WallControls = ({
  wallWidth,
  wallHeight,
  onWallWidthChange,
  onWallHeightChange,
  onWallWidthIncrement,
  onWallHeightIncrement,
  onWallWidthDecrement,
  onWallHeightDecrement,
  canIncreaseWallWidth,
  canDecreaseWallWidth,
  canIncreaseWallHeight,
  canDecreaseWallHeight,
  wallControlsEnabled,
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
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
            className={`w-full text-center border-none outline-none text-xs
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                      ${
                        disabled || readOnly ? "text-gray-600" : "text-gray-600"
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

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-base font-medium text-gray-800">Wall</h3>

      <div className="flex flex-col lg:space-y-2">
        {/* Mobile: semua horizontal, Desktop: unit sendiri */}
        <div className="flex space-x-6 lg:space-x-0 space-y-4 lg:space-y-0">
          {/* Unit */}
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-600">Unit</label>
            <span className="px-4 py-2 text-xs rounded border bg-[#3AAFA9] text-white justify-center text-center w-[90px] lg:w-fit h-8 lg:h-auto">
              Meter
            </span>
          </div>

          {/* Mobile: Height & Width ikut sejajar */}
          <div className="flex flex-row space-x-6 lg:hidden">
            <NumberInput
              label="Wall Width(m)"
              value={wallWidth}
              onIncrement={onWallWidthIncrement}
              onDecrement={onWallWidthDecrement}
              onChange={onWallWidthChange}
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
              onIncrement={onWallHeightIncrement}
              onDecrement={onWallHeightDecrement}
              onChange={onWallHeightChange}
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
            onIncrement={onWallWidthIncrement}
            onDecrement={onWallWidthDecrement}
            onChange={onWallWidthChange}
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
            onIncrement={onWallHeightIncrement}
            onDecrement={onWallHeightDecrement}
            onChange={onWallHeightChange}
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
  );
};
