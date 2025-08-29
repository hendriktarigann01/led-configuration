import React from "react";
import { FileDown, Eye } from "lucide-react";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseExportStore } from "../store/UseExportStore";
import { ExportModal } from "./ExportModal";

export const Header = () => {
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
  } = UseHeaderStore();

  const { baseWidth, baseHeight, getActualScreenSize } = UseCanvasStore();

  const { openModal } = UseExportStore();

  // Get actual screen size for validation
  const actualScreenSize = getActualScreenSize();

  // Validation rules - Wall always bigger than Screen
  const canIncreaseScreenWidth =
    actualScreenSize.width + baseWidth <= wallWidth;
  const canDecreaseScreenWidth = actualScreenSize.width > baseWidth;
  const canIncreaseScreenHeight =
    actualScreenSize.height + baseHeight <= wallHeight;
  const canDecreaseScreenHeight = actualScreenSize.height > baseHeight;

  // Wall validation - Screen always smaller than Wall
  const canIncreaseWallWidth = true; // Wall can always increase
  const canDecreaseWallWidth = wallWidth > actualScreenSize.width + 1; // Keep 1m minimum margin
  const canIncreaseWallHeight = true; // Wall can always increase
  const canDecreaseWallHeight = wallHeight > actualScreenSize.height + 1; // Keep 1m minimum margin

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
  }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
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
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          disabled={disabled}
          className={`w-full text-center border-none outline-none text-xs
                    appearance-none
                    [appearance:textfield]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-outer-spin-button]:appearance-none
                    ${
                      disabled
                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                        : ""
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

  const ToggleButton = ({ options, selected, onChange }) => (
    <div className="flex border border-gray-300 rounded overflow-hidden bg-white">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 py-2 text-xs transition-colors ${
            selected === option
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
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs text-gray-600">Resolution</label>
                <ToggleButton
                  options={["FHD", "UHD"]}
                  selected={resolution}
                  onChange={setResolution}
                />
              </div>
            </div>

            <div className="flex items-end space-x-6">
              <NumberInput
                label="Screen Height(m)"
                value={screenHeight}
                onIncrement={incrementScreenHeight}
                onDecrement={decrementScreenHeight}
                onChange={setScreenHeight}
                disabled={!screenControlsEnabled}
                canIncrease={canIncreaseScreenHeight}
                canDecrease={canDecreaseScreenHeight}
              />

              <NumberInput
                label="Screen Width(m)"
                value={screenWidth}
                onIncrement={incrementScreenWidth}
                onDecrement={decrementScreenWidth}
                onChange={setScreenWidth}
                disabled={!screenControlsEnabled}
                canIncrease={canIncreaseScreenWidth}
                canDecrease={canDecreaseScreenWidth}
              />
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

            <button className="flex items-center justify-center space-x-2 w-[144px] px-4 py-2 cursor-pointer bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors">
              <Eye size={16} />
              <span className="text-xs">View Result</span>
            </button>
          </div>
        </div>
      </div>

      <ExportModal />
    </>
  );
};
