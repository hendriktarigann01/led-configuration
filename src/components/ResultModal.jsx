import React from "react";
import { X } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseCalculatorStore } from "../store/UseCalculatorStore";
import { UseNavbarStore } from "../store/UseNavbarStore";

export const ResultModal = ({ isOpen, onClose }) => {
  const {
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

  // Early returns for invalid states
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

  // Calculate display area
  const displayArea = (
    actualScreenSize.width * actualScreenSize.height
  ).toFixed(2);

  // Check if this is Video Wall type
  const isVideoWall = displayType.includes("Video Wall");

  // Helper functions for dynamic labels
  const getUnitName = () => {
    if (displayType.includes("Cabinet") || displayType.includes("Outdoor")) {
      return "Cabinets";
    } else if (displayType.includes("Module")) {
      return "Modules";
    } else if (displayType.includes("Video Wall")) {
      return "screens";
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

  // Specification sections data
  const sections = [
    {
      title: "Display Requirements",
      items: [
        {
          label: "Screen Configuration",
          value: `${unitCount.horizontal} x ${unitCount.vertical}`,
        },
        {
          label: `Number of ${getUnitName()}`,
          value: `${totalUnits} pcs`,
        },
        // Only show resolution for non-Video Wall types
        ...(!isVideoWall
          ? [
              {
                label: "Resolution",
                value:
                  resolutionPerUnit.width > 0 && resolutionPerUnit.height > 0
                    ? `${resolutionPerUnit.width} x ${resolutionPerUnit.height} dots`
                    : "N/A",
              },
            ]
          : []),
      ],
    },
    {
      title: "Display Wall",
      items: [
        {
          label: "Real Size",
          value: `${screenWidth.toFixed(3)} (${baseWidth.toFixed(
            isVideoWall ? 3 : 2
          )}) x ${screenHeight.toFixed(3)} (${baseHeight.toFixed(
            isVideoWall ? 3 : 2
          )})`,
        },
        {
          label: "SQM",
          value: `${displayArea} m${isVideoWall ? "2" : "²"}`,
        },
        // Only show weight for non-Video Wall types
        ...(!isVideoWall
          ? [
              {
                label: getWeightLabel(),
                value: totalWeight > 0 ? `${totalWeight} kg` : "N/A",
              },
            ]
          : []),
      ],
    },
    // Only show power section if model has power_consumption
    ...(modelData.power_consumption
      ? [
          {
            title: "Power Requirements",
            items: [
              {
                label: "Max Power",
                value:
                  totalPower.max > 0 ? `${totalPower.max.toFixed(0)} W` : "N/A",
              },
              // Only show average power for non-Video Wall types
              ...(!isVideoWall
                ? [
                    {
                      label: "Average Power",
                      value:
                        totalPower.average > 0
                          ? `${totalPower.average.toFixed(0)} W`
                          : "N/A",
                    },
                  ]
                : []),
            ],
          },
        ]
      : []),
  ];

  // Render specification item
  const renderSpecItem = (item, index) => (
    <div key={index}>
      <h4 className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
        {item.label}
      </h4>
      <p
        className={`text-sm lg:text-base text-gray-600 ${
          isVideoWall ? "font-medium" : ""
        }`}
      >
        {item.value}
      </p>
    </div>
  );

  // Render specification section
  const renderSection = (section, sectionIndex) => (
    <div key={sectionIndex}>
      {/* Add divider for non-first sections in non-Video Wall */}
      {!isVideoWall && sectionIndex > 0 && (
        <div className="border-t-2 border-gray-200"></div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-8">
        <div>
          <h3
            className={`text-sm lg:text-lg font-medium text-gray-700 mb-2 ${
              isVideoWall ? "lg:mb-0" : "lg:mb-4"
            }`}
          >
            {section.title}
          </h3>
        </div>
        <div className={`space-y-${isVideoWall ? "3 lg:space-y-4" : "2"}`}>
          {section.items.map(renderSpecItem)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-99 overflow-hidden">
      <div
        className={`bg-white rounded-xl shadow-2xl w-[380px] lg:w-full ${
          isVideoWall ? "max-w-xl" : "max-w-2xl"
        } max-h-[90vh] overflow-hidden`}
      >
        <div className="p-6 h-full">
          {/* Header */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex mb-5 justify-center lg:justify-start">
            <h2 className="text-md lg:text-xl font-normal lg:font-medium text-gray-800">
              Specification
            </h2>
          </div>

          {/* Content */}
          <div
            className={`space-y-${
              isVideoWall ? "6 lg:space-y-4" : "4 lg:space-y-1"
            }`}
          >
            {sections.map(renderSection)}
          </div>
        </div>
      </div>
    </div>
  );
};
