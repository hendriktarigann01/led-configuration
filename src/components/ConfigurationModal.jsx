import React, { useState, useRef } from "react";
import { X, ChevronDown, ChevronUp, Info } from "lucide-react";
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
  // Indoor - merged table with combined size and weight columns
  return window.innerWidth < 1024
    ? ["Pixel Pitch", "Size"]
    : ["Pixel Pitch", "Size", "Weight", "Brightness", "Refresh Rate"];
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

  // Indoor - PERBAIKAN: Cek apakah data cabinet ada
  const moduleSize = config.module_size || "320*160mm";
  const cabinetSize = config.cabinet_size || "640*480mm";

  // Jika ada data cabinet, tampilkan keduanya
  // Jika tidak ada, hanya tampilkan module
  const combinedSize = config.cabinet_size
    ? `${moduleSize} (Module)\n${cabinetSize} (Cabinet)`
    : `${moduleSize} (Module)`;

  const moduleWeight = config.module_weight || "0.48kg/pcs";
  const cabinetWeight = config.cabinet_weight || "7.8kg/pcs";

  // Sama dengan size, cek apakah cabinet weight ada
  const combinedWeight = config.cabinet_weight
    ? `${moduleWeight} (Module)\n${cabinetWeight} (Cabinet)`
    : `${moduleWeight} (Module)`;

  return window.innerWidth < 1024
    ? [config.pixel_pitch, combinedSize]
    : [
        config.pixel_pitch,
        combinedSize,
        combinedWeight,
        config.brightness,
        config.refresh_rate,
      ];
};

export const ConfigurationModal = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const scrollContainerRef = useRef(null);
  const modalContentRef = useRef(null);

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
    // Di desktop, tidak perlu nextStep() karena sudah otomatis ke configure di store
  };

  // Handle click outside tooltip to close it
  const handleModalContentClick = (e) => {
    // Cek apakah klik terjadi di luar tombol info dan tooltip
    if (
      showTooltip !== null &&
      !e.target.closest('button[type="button"]') &&
      !e.target.closest('[role="tooltip"]')
    ) {
      setShowTooltip(null);
    }
  };

  // Handle next for mobile display type selection
  const handleMobileDisplayNext = () => {
    // Semua display type langsung ke configuration
    nextStep();
  };

  // Toggle row expansion for mobile
  const toggleRowExpansion = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  // Handle model selection with scroll position preservation
  const handleSelectModel = (config) => {
    // Store current scroll position
    const currentScrollTop = scrollContainerRef.current?.scrollTop || 0;

    // Select the model
    selectModel(config);

    // Restore scroll position after state update
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = currentScrollTop;
      }
    }, 0);
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

    // Indoor - PERBAIKAN: Format yang lebih baik untuk mobile
    const moduleSize = config.module_size || "320*160mm";
    const cabinetSize = config.cabinet_size || "640*480mm";

    const combinedSize = config.cabinet_size
      ? `${moduleSize} (Module), ${cabinetSize} (Cabinet)`
      : `${moduleSize} (Module)`;

    const moduleWeight = config.module_weight || "0.48kg/pcs";
    const cabinetWeight = config.cabinet_weight || "7.8kg/pcs";

    const combinedWeight = config.cabinet_weight
      ? `${moduleWeight} (Module), ${cabinetWeight} (Cabinet)`
      : `${moduleWeight} (Module)`;

    return [
      { label: "Weight", value: combinedWeight },
      { label: "Brightness", value: config.brightness },
      { label: "Refresh Rate", value: config.refresh_rate },
    ];
  };

  const getTooltipMessage = (imageSrc) => {
    if (imageSrc.includes("cabinet")) {
      return "Cabinet is a series of LED modules arranged in a single panel unit.";
    } else if (imageSrc.includes("modul")) {
      return "Module is a small LED unit that can be assembled as needed for flexible sizing and easy maintenance.";
    }
    return "";
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

        {currentStep === "subtype" && (
          <h2 className="flex lg:hidden text-md font-normal text-gray-800">
            Choose Configuration Method
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
                {type.id === 1 ? "Indoor LED Fixed" : type.name}
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
                <div className="w-32 lg:w-40 h-auto mb-3 relative">
                  <img
                    src={item.image}
                    alt={`${item.name}-Image`}
                    className="w-full h-auto"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onMouseEnter={() => setShowTooltip(item.id)}
                      onMouseLeave={() => setShowTooltip(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(
                          showTooltip === item.id ? null : item.id
                        );
                      }}
                      type="button"
                    >
                      <Info size={16} className="text-gray-700" />
                    </button>

                    {showTooltip === item.id && (
                      <div
                        role="tooltip"
                        className="absolute w-40 lg:w-48 z-10 inline-block px-3 py-2 text-xs font-medium text-white transition-opacity duration-300 bg-[#3AAFA9] rounded-sm shadow-sm opacity-100 -right-2 top-8"
                      >
                        {getTooltipMessage(item.image)}
                        <div className="absolute w-2 h-2 bg-[#3AAFA9] transform rotate-45 -top-1 right-3"></div>
                      </div>
                    )}
                  </div>
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
        {/* Choose Model */}
        <button
          onClick={confirmSelection}
          disabled={!selectedSubTypeId}
          className={`flex-1 py-2 rounded-lg text-sm w-full font-medium transition-colors ${
            selectedSubTypeId
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

  // Configuration Table Component
  const ConfigurationTable = () => (
    <div className="flex-1 overflow-hidden flex flex-col">
      <p className="mb-4 lg:hidden font-light text-center">
        {selectedDisplayType?.name}
      </p>
      <div className="bg-white overflow-auto mb-4 flex-1 mt-0 lg:mt-10">
        <div
          ref={scrollContainerRef}
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
                      className={`p-3 text-left text-xs font-medium text-gray-700 ${
                        index === 0 ? "w-20 lg:w-24" : "w-36"
                      }`}
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
                    onClick={() => handleSelectModel(config)}
                    className={`cursor-pointer transition-colors ${
                      selectedModel === config
                        ? "bg-[#E0F2F0]"
                        : "hover:bg-[#c5e1de]"
                    }`}
                  >
                    {getTableRowData(
                      config,
                      selectedDisplayType,
                      selectedSubTypeId
                    ).map((data, dataIndex) => (
                      <td
                        key={dataIndex}
                        className={`py-0 px-3 lg:p-3 text-[10px] lg:text-xs text-gray-700 whitespace-pre-line ${
                          dataIndex === 0 ? "w-20 lg:w-24" : "w-36"
                        }`}
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
                      onClick={() => handleSelectModel(config)}
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
                        <div className="px-3 rounded-lg mb-2">
                          <div className="grid grid-cols-1 gap-2">
                            {getAllRowData(
                              config,
                              selectedDisplayType,
                              selectedSubTypeId
                            ).map((item, itemIndex) => (
                              <div key={itemIndex} className="flex">
                                <span className="text-[10px] w-[145px] py-1 text-gray-700">
                                  {item.label}:
                                </span>
                                <span className="text-[10px] w-[145px] py-1 text-gray-700">
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
        {/* Next button for Indoor to go to subtype selection */}
        {selectedDisplayTypeId === 1 ? (
          <button
            onClick={nextStep}
            disabled={!selectedModel}
            className={`flex-1 py-2 rounded-lg text-sm w-full font-medium transition-colors ${
              selectedModel
                ? "bg-[#3AAFA9] text-white hover:bg-teal-600 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={confirmSelection}
            disabled={!selectedModel}
            className={`flex-1 py-2 rounded-lg text-sm w-full font-medium transition-colors ${
              selectedModel
                ? "bg-[#3AAFA9] text-white hover:bg-teal-600 cursor-pointer"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Choose Model
          </button>
        )}

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
        {currentStep === "configure" ? (
          <div className="hidden lg:block flex-1">
            <ConfigurationTable />
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

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white mx-5 rounded-xl shadow-2xl w-[380px] lg:w-full max-w-[820px] h-[90vh] max-h-[600px] overflow-auto">
        <div
          ref={modalContentRef}
          onClick={handleModalContentClick}
          className="p-6 h-full"
        >
          {currentStep === "select" && renderSelectStep()}
          {currentStep === "configure" && renderConfigureStep()}
          {currentStep === "subtype" && renderSubtypeStep()}
        </div>
      </div>
    </div>
  );
};
