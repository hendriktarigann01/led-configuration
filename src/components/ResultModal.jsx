import React from "react";
import { X } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";

export const ResultModal = ({ isOpen, onClose }) => {
  const {
    getCabinetCount,
    getActualScreenSize,
    baseWidth,
    baseHeight,
    wallWidth,
    wallHeight,
    isConfigured,
  } = UseCanvasStore();

  if (!isOpen || !isConfigured()) return null;

  const cabinetCount = getCabinetCount();
  const actualScreenSize = getActualScreenSize();
  const totalUnits = cabinetCount.horizontal * cabinetCount.vertical;
  const displayArea = (
    actualScreenSize.width * actualScreenSize.height
  ).toFixed(2);

  // Kalkulasi tambahan
  const resolutionPerCabinet = 512; // Asumsi resolusi per cabinet
  const totalResolutionWidth = cabinetCount.horizontal * resolutionPerCabinet;
  const totalResolutionHeight = cabinetCount.vertical * resolutionPerCabinet;
  const weightPerCabinet = 25; 
  const totalWeight = totalUnits * weightPerCabinet;
  const maxPower = totalUnits * 180;
  const averagePower = Math.round(maxPower * 0.6); // Asumsi average power 60% dari max power

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
                    {cabinetCount.horizontal} x {cabinetCount.vertical}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Number of Cabinets
                  </h4>
                  <p className="text-gray-800">{totalUnits} pcs</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Display Resolution
                  </h4>
                  <p className="text-gray-800">
                    {totalResolutionWidth > 0
                      ? `${totalResolutionWidth} x ${totalResolutionHeight}`
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
                    {actualScreenSize.width.toFixed(3)} x{" "}
                    {actualScreenSize.height.toFixed(3)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Display Area
                  </h4>
                  <p className="text-gray-800">{displayArea} m2</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Weight Cabinets
                  </h4>
                  <p className="text-gray-800">
                    {totalWeight > 0 ? `${totalWeight.toFixed(1)} kg` : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Power Requirements */}
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
                    {maxPower > 0 ? `${maxPower} W` : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">
                    Average Power
                  </h4>
                  <p className="text-gray-800">
                    {averagePower > 0 ? `${averagePower} W` : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
