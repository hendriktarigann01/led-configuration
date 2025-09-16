import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { UseModalStore } from "../store/UseModalStore";

// Helper untuk mendapatkan icon display type
const getDisplayTypeIcon = (typeName) => {
  if (typeName.includes("Indoor")) return "/product/model/indoor.svg";
  if (typeName.includes("Outdoor")) return "/product/model/outdoor.svg";
  if (typeName.includes("Video")) return "/product/model/video_wall.svg";
  return null;
};

// Helper untuk table headers
const getTableHeaders = (selectedDisplayType, selectedSubTypeId) => {
  // Video Wall - mobile only shows 2 columns
  if (selectedDisplayType?.name.includes("Video Wall")) {
    return window.innerWidth < 1024
      ? ["Inch", "Unit Size (mm)"]
      : ["Inch", "Bezel to Bezel", "Unit Size (mm)", "Brightness"];
  }
  // Outdoor - mobile only shows 2 columns
  if (selectedDisplayType?.name.includes("Outdoor")) {
    return window.innerWidth < 1024
      ? ["Pixel Pitch", "Cabinet Size"]
      : [
          "Pixel Pitch",
          "Cabinet Size",
          "Module Weight",
          "Brightness",
          "Refresh Rate",
        ];
  }
  // Indoor
  if (selectedSubTypeId === 2) {
    return window.innerWidth < 1024
      ? ["Pixel Pitch", "Module Size"]
      : [
          "Pixel Pitch",
          "Module Size",
          "Module Weight",
          "Brightness",
          "Refresh Rate",
        ];
  }
  return window.innerWidth < 1024
    ? ["Pixel Pitch", "Cabinet Size"]
    : [
        "Pixel Pitch",
        "Cabinet Size",
        "Cabinet Weight",
        "Brightness",
        "Refresh Rate",
      ];
};

// Helper untuk table row data
const getTableRowData = (config, selectedDisplayType, selectedSubTypeId) => {
  // Video Wall
  if (selectedDisplayType?.name.includes("Video Wall")) {
    return window.innerWidth < 1024
      ? [config.inch, config.unit_size_mm]
      : [config.inch, config.b2b, config.unit_size_mm, config.brightness];
  }
  // Outdoor
  if (selectedDisplayType?.name.includes("Outdoor")) {
    return window.innerWidth < 1024
      ? [config.pixel_pitch, config.cabinet_size]
      : [
          config.pixel_pitch,
          config.cabinet_size,
          config.module_weight,
          config.brightness,
          config.refresh_rate,
        ];
  }
  // Indoor
  if (selectedSubTypeId === 2) {
    return window.innerWidth < 1024
      ? [config.pixel_pitch, config.module_size]
      : [
          config.pixel_pitch,
          config.module_size,
          config.module_weight,
          config.brightness,
          config.refresh_rate,
        ];
  }
  return window.innerWidth < 1024
    ? [config.pixel_pitch, config.cabinet_size]
    : [
        config.pixel_pitch,
        config.cabinet_size,
        config.cabinet_weight || config.module_weight,
        config.brightness,
        config.refresh_rate,
      ];
};

export const ConfigurationModal = () => {
  const [expandedRow, setExpandedRow] = useState(null);

  const {
    isOpen,
    currentStep,
    selectedDisplayTypeId,
    selectedSubTypeId,
    selectedModel,
    getDisplayTypes,
    getSelectedTypeConfigurations,
    getSelectedDisplayType,
    closeModal,
    selectDisplayType,
    selectSubType,
    selectModel,
    goBack,
    confirmSelection,
    nextStep,
  } = UseModalStore();

  if (!isOpen) return null;

  const displayTypes = getDisplayTypes();
  const configurations = getSelectedTypeConfigurations();
  const selectedDisplayType = getSelectedDisplayType();

  // Enhanced selectDisplayType for mobile flow
  const handleSelectDisplayType = (typeId) => {
    selectDisplayType(typeId);
    // Di desktop, langsung pindah ke step selanjutnya
    if (window.innerWidth >= 1024) {
      if (typeId === 1) {
        // Indoor LED - perlu subtype selection
        // Akan otomatis pindah ke subtype step
      } else {
        // Outdoor atau Video Wall - langsung ke configuration
        nextStep();
      }
    }
  };

  // Handle next for mobile display type selection
  const handleMobileDisplayNext = () => {
    if (selectedDisplayTypeId === 1) {
      // Indoor LED - perlu subtype selection
      nextStep();
    } else {
      // Outdoor atau Video Wall - langsung ke configuration
      nextStep();
    }
  };

  // Toggle row expansion for mobile
  const toggleRowExpansion = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Get all row data for expanded view
  const getAllRowData = (config, selectedDisplayType, selectedSubTypeId) => {
    // Video Wall
    if (selectedDisplayType?.name.includes("Video Wall")) {
      return [
        { label: "Inch", value: config.inch },
        { label: "Bezel to Bezel", value: config.b2b },
        { label: "Unit Size (mm)", value: config.unit_size_mm },
        { label: "Brightness", value: config.brightness },
      ];
    }
    // Outdoor
    if (selectedDisplayType?.name.includes("Outdoor")) {
      return [
        { label: "Pixel Pitch", value: config.pixel_pitch },
        { label: "Cabinet Size", value: config.cabinet_size },
        { label: "Module Weight", value: config.module_weight },
        { label: "Brightness", value: config.brightness },
        { label: "Refresh Rate", value: config.refresh_rate },
      ];
    }
    // Indoor
    if (selectedSubTypeId === 2) {
      return [
        { label: "Pixel Pitch", value: config.pixel_pitch },
        { label: "Module Size", value: config.module_size },
        { label: "Module Weight", value: config.module_weight },
        { label: "Brightness", value: config.brightness },
        { label: "Refresh Rate", value: config.refresh_rate },
      ];
    }
    return [
      { label: "Pixel Pitch", value: config.pixel_pitch },
      { label: "Cabinet Size", value: config.cabinet_size },
      {
        label: "Cabinet Weight",
        value: config.cabinet_weight || config.module_weight,
      },
      { label: "Brightness", value: config.brightness },
      { label: "Refresh Rate", value: config.refresh_rate },
    ];
  };

  // Modal Header Component
  const ModalHeader = () => (
    <>
      {/* Close button */}
      <div className="flex justify-end">
        <button
          onClick={closeModal}
          className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X size={24} />
        </button>
      </div>

      {/* Title */}
      <div className="flex mb-2 justify-center lg:justify-start">
        {/* Mobile titles */}
        {currentStep === "select" && (
          <h2 className="flex lg:hidden text-md font-normal text-gray-800">
            Choose Display Type Based on Installation Needs
          </h2>
        )}

        {currentStep === "configure" && (
          <h2 className="flex lg:hidden text-md font-normal text-gray-800">
            Choose Display Configurator
          </h2>
        )}

        {/* Desktop title */}
        <h2 className="hidden lg:flex text-md lg:text-xl font-normal lg:font-medium text-gray-800">
          Choose Display Configurator
        </h2>
      </div>
    </>
  );

  // Display Type Grid Component
  const DisplayTypeGrid = ({ clickable = true }) => (
    <div className="grid lg:grid-cols-3 mb-0 lg:mb-6">
      {displayTypes
        .filter((type) => type.id !== 2)
        .map((type) => (
          <div
            key={type.id}
            onClick={
              clickable
                ? () => {
                    if (window.innerWidth >= 1024) {
                      handleSelectDisplayType(type.id);
                    } else {
                      selectDisplayType(type.id);
                    }
                  }
                : undefined
            }
            className={`rounded-lg bg-white flex flex-row items-center text-left h-28 lg:flex-col lg:items-center lg:text-center lg:p-0
                      ${clickable ? "cursor-pointer" : ""}
                      ${
                        type.id === selectedDisplayTypeId
                          ? "border-2 border-[#3AAFA9] lg:border-none"
                          : "border border-transparent"
                      }
                    `}
          >
            {/* Image Container */}
            <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-lg mb-0 mr-4 lg:mb-3 lg:mr-0 flex items-center justify-center flex-shrink-0">
              {getDisplayTypeIcon(type.name) ? (
                <img
                  src={getDisplayTypeIcon(type.name)}
                  alt={type.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-xs">LED</div>
              )}
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-between lg:block">
              {/* Title */}
              <div
                className={`py-2 lg:w-[200px] rounded-md text-xs font-medium transition-colors
                            ${
                              type.id === selectedDisplayTypeId
                                ? "lg:bg-[#3AAFA9] lg:text-white text-gray-600"
                                : "text-gray-600"
                            }
                          `}
              >
                {type.name}
              </div>

              {/* Description */}
              <div className="block lg:hidden text-xs text-gray-500 mt-2">
                {type.description ||
                  "Suitable for indoor use with a modular and flexible design."}
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  // Subtype Selection Component
  const SubtypeSelection = () => (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col lg:justify-center items-center">
        <p className="text-gray-600 mb-4 text-center text-sm px-4">
          Choose your preferred configuration method, start by arranging
          individual modules for detailed customisation, or use cabinet-based
          setup for a quicker and structured layout.
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {[
            { id: 1, name: "Cabinet", image: "/cabinet.webp" },
            { id: 2, name: "Modul", image: "/modul.webp" },
          ].map((item) => (
            <div
              onClick={() => selectSubType(item.id)}
              key={item.id}
              className="p-4 rounded-lg bg-white cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-auto mb-3 flex items-center justify-center">
                  <img src={item.image} alt={`${item.name}-Image`} />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedSubTypeId === item.id
                        ? "border-[#3AAFA9]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedSubTypeId === item.id && (
                      <div className="w-1.5 h-1.5 bg-[#3AAFA9] rounded-full"></div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {item.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="lg:flex space-y-3 w-full max-w-lg lg:w-[200px] mx-auto">
        {/* Back button - hanya tampil di mobile */}
        <button
          onClick={nextStep}
          disabled={!selectedSubTypeId}
          className={`flex-1 py-2 rounded-lg text-sm w-full font-medium transition-colors ${
            selectedSubTypeId
              ? "bg-[#3AAFA9] text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
        <button
          onClick={goBack}
          className="flex-1 lg:hidden py-2 border-2 border-[#3AAFA9] text-[#3AAFA9] rounded-lg text-sm w-full font-medium hover:bg-teal-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Configuration Table Component
  const ConfigurationTable = () => (
    <div className="flex-1 overflow-hidden flex flex-col">
      <p className="mb-4 lg:hidden font-light text-center">
        {selectedDisplayType?.name}
      </p>
      <div className="bg-white overflow-hidden mb-4 flex-1 mt-0 lg:mt-10">
        <div
          className="overflow-y-auto max-h-96 lg:max-h-full 
                    [&::-webkit-scrollbar]:w-1 
                    [&::-webkit-scrollbar-track]:bg-gray-200 
                    [&::-webkit-scrollbar-thumb]:bg-[#3AAFA9] 
                    [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <table className="w-full h-10 text-xs">
            <thead className="sticky top-0 bg-white border-b-2 border-gray-300">
              <tr>
                {getTableHeaders(selectedDisplayType, selectedSubTypeId).map(
                  (header, index) => (
                    <th
                      key={index}
                      className="p-3 w-32 text-left text-xs font-medium text-gray-700"
                    >
                      {header}
                    </th>
                  )
                )}
                {/* Mobile: Add chevron column */}
                <th className="lg:hidden py-3 w-8 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) => (
                <React.Fragment key={index}>
                  <tr
                    onClick={() => selectModel(config)}
                    className={`cursor-pointer transition-colors ${
                      selectedModel === config
                        ? "bg-[#E0F2F0]"
                        : "hover:bg-[#E0F2F0]"
                    }`}
                  >
                    {getTableRowData(
                      config,
                      selectedDisplayType,
                      selectedSubTypeId
                    ).map((data, dataIndex) => (
                      <td
                        key={dataIndex}
                        className="py-0 lg:p-3 w-32 text-[11px] lg:text-xs text-gray-700"
                      >
                        {data}
                      </td>
                    ))}
                    {/* Mobile: Chevron icon */}
                    <td className="lg:hidden py-3 w-8 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpansion(index);
                        }}
                        className="text-gray-700"
                      >
                        {expandedRow === index ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Mobile: Expanded row details */}
                  {expandedRow === index && window.innerWidth < 1024 && (
                    <tr
                      onClick={() => selectModel(config)}
                      className={`lg:hidden cursor-pointer transition-colors ${
                        selectedModel === config
                          ? "bg-[#E0F2F0]"
                          : "hover:bg-[#E0F2F0]"
                      }`}
                    >
                      <td
                        colSpan={
                          getTableHeaders(
                            selectedDisplayType,
                            selectedSubTypeId
                          ).length + 1
                        }
                      >
                        <div className="px-2 rounded-lg mb-2">
                          <div className="grid grid-cols-1 gap-2">
                            {getAllRowData(
                              config,
                              selectedDisplayType,
                              selectedSubTypeId
                            ).map((item, itemIndex) => (
                              <div key={itemIndex} className="flex">
                                <span className="text-[11px] w-[145px] py-1 text-gray-700">
                                  {item.label}:
                                </span>
                                <span className="text-[11px] w-[145px] py-1 text-gray-700">
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="lg:flex space-y-3 w-full max-w-lg lg:w-[200px] mx-auto">
        {/* Choose Model */}
        <button
          onClick={confirmSelection}
          disabled={!selectedModel}
          className={`flex-1 py-2 rounded-lg text-sm w-full font-medium transition-colors ${
            selectedModel
              ? "bg-[#3AAFA9] text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Choose Model
        </button>

        {/* Back button - hanya tampil di mobile */}
        <button
          onClick={goBack}
          className="flex-1 lg:hidden py-2 border-2 border-[#3AAFA9] text-[#3AAFA9] rounded-lg text-sm w-full font-medium hover:bg-teal-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render Steps
  const renderSelectStep = () => (
    <div className="h-full flex flex-col">
      <ModalHeader />
      {/* Di mobile: hanya tampilkan DisplayTypeGrid pada step select */}
      {/* Di desktop: selalu tampilkan DisplayTypeGrid */}
      <div className="flex-1 flex flex-col">
        <div className="block lg:block">
          <DisplayTypeGrid />
        </div>
        {currentStep === "subtype" ? (
          <div className="hidden lg:block flex-1">
            <SubtypeSelection />
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center">
            <p className="hidden lg:block text-gray-600 text-sm">
              Select a model to start configuring your display.
            </p>
          </div>
        )}
      </div>

      {/* Mobile Next Button - at bottom */}
      {currentStep === "select" && (
        <div className="flex lg:hidden justify-center mt-6">
          <button
            onClick={handleMobileDisplayNext}
            disabled={!selectedDisplayTypeId}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDisplayTypeId
                ? "bg-[#3AAFA9] text-white hover:bg-[#2d9e98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderSubtypeStep = () => (
    <div className="h-full flex flex-col">
      <ModalHeader />
      {/* Di desktop: tampilkan DisplayTypeGrid */}
      <div className="hidden lg:block">
        <DisplayTypeGrid clickable={true} />
      </div>
      <SubtypeSelection />
    </div>
  );

  const renderConfigureStep = () => (
    <div className="h-full flex flex-col">
      <ModalHeader />
      {/* Di desktop: tampilkan DisplayTypeGrid */}
      <div className="hidden lg:block">
        <DisplayTypeGrid clickable={true} />
      </div>
      <ConfigurationTable />
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white mx-5 rounded-xl shadow-2xl w-[380px] lg:w-full max-w-[820px] h-[90vh] max-h-[600px] overflow-hidden">
        <div className="p-6 h-full">
          {currentStep === "select" && renderSelectStep()}
          {currentStep === "subtype" && renderSubtypeStep()}
          {currentStep === "configure" && renderConfigureStep()}
        </div>
      </div>
    </div>
  );
};
