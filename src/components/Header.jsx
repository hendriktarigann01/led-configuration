import React from "react";
import { FileDown, Eye } from "lucide-react";
import { UseHeaderStore } from "../store/UseHeaderStore";

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
  } = UseHeaderStore();

  const NumberInput = ({
    label,
    value,
    onIncrement,
    onDecrement,
    onChange,
    step = 0.01,
  }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-gray-600">{label}</label>
      <div className="flex items-center justify-between w-[110px] border border-gray-300 rounded bg-white">
        <button
          onClick={onDecrement}
          className="px-3 py-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          className="w-full text-center border-none outline-none appearance-none text-xs"
        />
        <button
          onClick={onIncrement}
          className="px-3 py-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50"
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
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );

  return (
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
            />

            <NumberInput
              label="Screen Width(m)"
              value={screenWidth}
              onIncrement={incrementScreenWidth}
              onDecrement={decrementScreenWidth}
              onChange={setScreenWidth}
            />
          </div>
        </div>

        {/* Wall Section */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-base font-medium text-gray-800">Wall</h3>

          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-600">Unit</label>
            <span className="px-4 py-2 text-xs rounded border bg-teal-500 text-white w-fit">
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
            />

            <NumberInput
              label="Wall Width(m)"
              value={wallWidth}
              onIncrement={incrementWallWidth}
              onDecrement={decrementWallWidth}
              onChange={setWallWidth}
              step={0.1}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 my-auto">
          <button className="flex items-center justify-center space-x-2 w-[144px] px-4 py-2 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors">
            <FileDown size={16} />
            <span className="text-xs">Export to PDF</span>
          </button>

          <button className="flex items-center justify-center space-x-2 w-[144px] px-4 py-2 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-colors">
            <Eye size={16} />
            <span className="text-xs">View Result</span>
          </button>
        </div>
      </div>
    </div>
  );
}