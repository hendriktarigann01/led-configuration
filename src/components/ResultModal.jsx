import React from "react";
import { X } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseCalculatorStore } from "../store/UseCalculatorStore";
import { UseNavbarStore } from "../store/UseNavbarStore";

export const ResultModal = ({ isOpen, onClose }) => {
  const { baseWidth, baseHeight, isConfigured, screenWidth, screenHeight } =
    UseCanvasStore();

  const calculator = UseCalculatorStore();
  const { selectedModel } = UseNavbarStore();

  // Early returns for invalid states
  if (!isOpen || !isConfigured() || !selectedModel) return null;

  const modelData = selectedModel.modelData;
  const displayType = selectedModel.name;

  // Get comprehensive calculation results (without totalPower)
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
    totalWeight,
  } = results;

  const sqm = (actualScreenSize.width * actualScreenSize.height).toFixed(2);

  // Check if this is Video Wall type
  const isVideoWall = displayType.includes("Video Wall");

  // Get pixel pitch or inch from model data
  const getPixelPitchOrInch = () => {
    if (modelData.pixel_pitch) {
      return modelData.pixel_pitch;
    } else if (modelData.inch) {
      return modelData.inch;
    }
    return "N/A";
  };

  // Get unit name based on display type
  const getUnitName = () => {
    if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
      return "Cabinets";
    } else if (displayType.includes("Module")) {
      return "Module";
    } else if (displayType.includes("Video Wall")) {
      return "Units";
    }
    return "Units";
  };

  // Format the modal title
  const getModalTitle = () => {
    const pixelPitch = getPixelPitchOrInch();
    if (displayType.includes("Video Wall")) {
      return `${displayType} - ${pixelPitch}`;
    } else if (displayType.includes("Module")) {
      return `LED ${displayType.replace("LED ", "")} - ${pixelPitch}`;
    } else {
      return `LED ${displayType.replace("LED ", "")} - ${pixelPitch}`;
    }
  };

  // Get resolution display format
  const getResolutionDisplay = () => {
    const totalResolutionWidth =
      unitCount.horizontal * (resolutionPerUnit.width / totalUnits);
    const totalResolutionHeight =
      unitCount.vertical * (resolutionPerUnit.height / totalUnits);
    return `${Math.round(totalResolutionWidth)} x ${Math.round(
      totalResolutionHeight
    )}`;
  };

  // Get unit configuration
  const getUnitConfiguration = () => {
    return `${unitCount.horizontal}(W) x ${unitCount.vertical}(H) ${totalUnits} Pcs`;
  };

  // Calculate power consumption - DIFFERENT for Video Wall
  const calculatePowerConsumption = () => {
    if (!modelData.power_consumption) return { max: 0, average: 0 };

    const powerData = calculator.parsePowerConsumption(
      modelData.power_consumption
    );

    // For Video Wall: totalUnits x powerConsumption
    // For other types: screenArea x powerConsumption
    if (isVideoWall) {
      return {
        max: totalUnits * powerData.max,
        average: totalUnits * powerData.average,
      };
    } else {
      // Calculate screen area in square meters
      const screenArea = actualScreenSize.width * actualScreenSize.height;

      return {
        max: screenArea * powerData.max,
        average: screenArea * powerData.average,
      };
    }
  };

  const powerConsumption = calculatePowerConsumption();

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-99 overflow-hidden">
      <div
        className={`bg-white rounded-xl shadow-2xl w-[380px] lg:w-full ${
          isVideoWall ? "max-w-xl" : "max-w-2xl"
        }  overflow-hidden`}
      >
        <div className="p-6">
          {/* Header with close button */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg  text-gray-800 pr-4">{getModalTitle()}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content - Table Format with Rowspan */}
          <div className="space-y-0">
            {/* Product Section */}
            <div className="grid grid-cols-12 gap-x-4 text-sm">
              {/* Product Label with Rowspan Effect */}
              <div className="col-span-6 text-gray-700 font-medium py-3 flex items-start">
                Product
              </div>

              {/* Product Data - Vertical Layout */}
              <div className="col-span-6 py-3">
                <div className="space-y-4">
                  <div className="mb-2">
                    <div className="text-gray-600 mb-1">
                      {isVideoWall ? "Inch" : "Pixel Pitch"}
                    </div>
                    <div className="text-gray-800">{getPixelPitchOrInch()}</div>
                  </div>

                  <div className="mb-2">
                    <div className="text-gray-600 mb-1">Resolution</div>
                    <div className="text-gray-800">
                      {getResolutionDisplay()}
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-gray-600 mb-1">{`Number of ${getUnitName()}`}</div>
                    <div className="text-gray-800">
                      {getUnitConfiguration()}
                    </div>
                  </div>

                  {/* SQM - HIDDEN for Video Wall */}
                  {!isVideoWall && (
                    <div className="mb-2">
                      <div className="text-gray-600 mb-1">SQM</div>
                      <div className="text-gray-800">{sqm} m2</div>
                    </div>
                  )}

                  {/* Real Size - HIDDEN for Video Wall */}
                  {!isVideoWall && (
                    <div className="mb-2">
                      <div className="text-gray-600 mb-1">Real Size</div>
                      <div className="text-gray-800">
                        {actualScreenSize.width.toFixed(3)} (
                        {baseWidth.toFixed(3)}) x{" "}
                        {actualScreenSize.height.toFixed(3)} (
                        {baseHeight.toFixed(3)})
                      </div>
                    </div>
                  )}

                  {/* Weight - only for non-Video Wall types */}
                  {!isVideoWall && totalWeight > 0 && (
                    <div className="mb-2">
                      <div className="text-gray-600 mb-1">{`Weight ${getUnitName()}`}</div>
                      <div className="text-gray-800">
                        {totalWeight.toFixed(0)} kg
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Power Consumption - SHOW for ALL types including Video Wall */}
            {modelData.power_consumption && (
              <div className="grid grid-cols-12 gap-x-4 text-sm border-t border-gray-100">
                {/* Power Label with Rowspan Effect */}
                <div className="col-span-6 text-gray-700 font-medium py-3 flex items-start">
                  Power Consumption
                </div>

                {/* Power Data - Vertical Layout */}
                <div className="col-span-6 py-3">
                  <div className="space-y-4">
                    <div className="mb-2">
                      <div className="text-gray-600 mb-1">Max Power</div>
                      <div className="text-gray-800">
                        {powerConsumption.max > 0
                          ? isVideoWall
                            ? `${Math.floor(
                                powerConsumption.max
                              ).toLocaleString("id-ID")} W ~ ${Math.round(
                                powerConsumption.max
                              ).toLocaleString("id-ID")} W`
                            : `${Math.floor(
                                powerConsumption.max
                              ).toLocaleString("id-ID")} W ~ ${(
                                Math.ceil(powerConsumption.max / 500) * 500
                              ).toLocaleString("id-ID")} W`
                          : "N/A"}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="text-gray-600 mb-1">Average Power</div>
                      <div className="text-gray-800">
                        {powerConsumption.average > 0
                          ? isVideoWall
                            ? `${Math.floor(
                                powerConsumption.average
                              ).toLocaleString("id-ID")} W`
                            : `${Math.floor(
                                powerConsumption.average
                              ).toLocaleString("id-ID")} W ~ ${(
                                Math.ceil(powerConsumption.average / 500) * 500
                              ).toLocaleString("id-ID")} W`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Material */}
            <div className="grid grid-cols-12 gap-x-4 text-sm border-t border-gray-100">
              <div className="col-span-6 text-gray-700 font-medium py-3 flex items-start">
                Material
              </div>

              {/* Power Data - Vertical Layout */}
              <div className="col-span-6 py-3">
                <div className="space-y-4">
                  <div className="mb-2">
                    <div className="text-gray-600 mb-1">Processor</div>
                    <div className="text-gray-800">VX400</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
