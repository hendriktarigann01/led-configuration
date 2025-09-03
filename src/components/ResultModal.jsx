import React from "react";
import { X } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseCalculatorStore } from "../store/UseCalculatorStore";
import { UseNavbarStore } from "../store/UseNavbarStore";

export const ResultModal = ({ isOpen, onClose }) => {
  const {
    getCabinetCount,
    getActualScreenSize,
    baseWidth,
    baseHeight,
    wallWidth,
    wallHeight,
    isConfigured,
    screenWidth,
    screenHeight,
  } = UseCanvasStore();

  const calculator = UseCalculatorStore();
  const { selectedModel } = UseNavbarStore();

  if (!isOpen || !isConfigured() || !selectedModel) return null;

  const modelData = selectedModel.modelData;
  const displayType = selectedModel.name;

  // Get comprehensive calculation results
  const results = calculator.getCalculationResults(
    modelData,
    displayType,
    screenWidth,
    screenHeight,
    baseWidth,
    baseHeight
  );

  if (!results) return null;

  const {
    unitCount,
    totalUnits,
    actualScreenSize,
    resolutionPerUnit,
    totalPower,
    totalWeight,
  } = results;

  const displayArea = (
    actualScreenSize.width * actualScreenSize.height
  ).toFixed(2);

  // Format display names based on type
  const getUnitName = () => {
    if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
      return "Cabinets";
    } else if (displayType.includes("Module")) {
      return "Modules";
    } else if (displayType.includes("Video Wall")) {
      return "Units";
    }
    return "Units";
  };

  const getWeightLabel = () => {
    if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
      return "Weight Cabinets";
    } else if (displayType.includes("Module")) {
      return "Weight Modules";
    } else if (displayType.includes("Video Wall")) {
      return "Weight Units";
    }
    return "Weight";
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-99 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-gray-800">
              Specification
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Display Requirements */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Display Requirements
                </h3>
              </div>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Screen Configuration
                  </h4>
                  <p className="text-gray-800">
                    {unitCount.horizontal} x {unitCount.vertical}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Number of {getUnitName()}
                  </h4>
                  <p className="text-gray-800">{totalUnits} pcs</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Total Display Resolution
                  </h4>
                  <p className="text-gray-800">
                    {resolutionPerUnit.width > 0 && resolutionPerUnit.height > 0
                      ? `${resolutionPerUnit.width} x ${resolutionPerUnit.height} dots`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Display Wall */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Display Wall
                </h3>
              </div>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Dimensions
                  </h4>
                  <p className="text-gray-800">
                    {screenWidth.toFixed(3)} x {screenHeight.toFixed(3)} m
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Display Area
                  </h4>
                  <p className="text-gray-800">{displayArea} m²</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    {getWeightLabel()}
                  </h4>
                  <p className="text-gray-800">
                    {totalWeight > 0 ? `${totalWeight.toFixed(1)} kg` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Power Requirements - Only show if model has power_consumption */}
            {modelData.power_consumption && (
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Power Requirements
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      Max Power
                    </h4>
                    <p className="text-gray-800">
                      {totalPower.max > 0
                        ? `${totalPower.max.toFixed(0)} W`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      Average Power
                    </h4>
                    <p className="text-gray-800">
                      {totalPower.average > 0
                        ? `${totalPower.average.toFixed(0)} W`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
