import React from "react";
import { X } from "lucide-react";
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
  // Video Wall
  if (selectedDisplayType?.name.includes("Video Wall")) {
    return ["Inch", "Bezel to Bezel", "Unit Size (mm)", "Brightness"];
  }
  // Outdoor
  if (selectedDisplayType?.name.includes("Outdoor")) {
    return [
      "Pixel Pitch",
      "Cabinet Size",
      "Module Weight",
      "Brightness",
      "Refresh Rate",
    ];
  }
  // Indoor
  if (selectedSubTypeId === 2) {
    return [
      "Pixel Pitch",
      "Module Size",
      "Module Weight",
      "Brightness",
      "Refresh Rate",
    ];
  }
  return [
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
    return [config.inch, config.b2b, config.unit_size_mm, config.brightness];
  }
  // Outdoor
  if (selectedDisplayType?.name.includes("Outdoor")) {
    return [
      config.pixel_pitch,
      config.cabinet_size,
      config.module_weight,
      config.brightness,
      config.refresh_rate,
    ];
  }
  // Indoor
  if (selectedSubTypeId === 2) {
    return [
      config.pixel_pitch,
      config.module_size,
      config.module_weight,
      config.brightness,
      config.refresh_rate,
    ];
  }
  return [
    config.pixel_pitch,
    config.cabinet_size,
    config.cabinet_weight || config.module_weight,
    config.brightness,
    config.refresh_rate,
  ];
};

export const ConfigurationModal = () => {
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

  // Modal Header Component
  const ModalHeader = () => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-medium text-gray-800">
        Choose Display Configurator
      </h2>
      <button
        onClick={closeModal}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>
    </div>
  );

  // Display Type Grid Component
  const DisplayTypeGrid = ({ clickable = true }) => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {displayTypes
        .filter((type) => type.id !== 2)
        .map((type) => (
          <div
            key={type.id}
            onClick={clickable ? () => selectDisplayType(type.id) : undefined}
            className={`rounded-lg bg-white flex flex-col items-center text-center ${
              clickable ? "cursor-pointer" : ""
            }`}
          >
            <div className="w-28 h-28 rounded-lg mb-3 flex items-center justify-center">
              {getDisplayTypeIcon(type.name) ? (
                <img
                  src={getDisplayTypeIcon(type.name)}
                  alt={type.name}
                  className="w-full h-full"
                />
              ) : (
                <div className="text-gray-400 text-xs">LED</div>
              )}
            </div>

            <div
              className={`px-3 py-2 w-full rounded-md text-xs font-medium transition-colors ${
                type.id === selectedDisplayTypeId
                  ? "bg-[#3AAFA9] text-white border border-[#3AAFA9]"
                  : "text-gray-600 border border-transparent hover:border-[#3AAFA9]"
              }`}
            >
              {type.name}
            </div>
          </div>
        ))}
    </div>
  );

  // Subtype Selection Component
  const SubtypeSelection = () => (
    <div className="flex-1 flex flex-col justify-center items-center">
      <p className="text-gray-600 mb-4 text-center text-sm px-4">
        Choose your preferred configuration method, start by arranging
        individual modules for detailed customisation, or use cabinet-based
        setup for a quicker and structured layout.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-lg">
        {[
          { id: 1, name: "Cabinet", image: "/cabinet.webp" },
          { id: 2, name: "Modul", image: "/modul.webp" },
        ].map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-white  ">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-auto mb-3 flex items-center justify-center">
                <img src={item.image} alt={`${item.name}-Image`} />
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => selectSubType(item.id)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${
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

      <div className="flex justify-between w-full max-w-lg gap-4">
        <button
          onClick={goBack}
          className="flex-1 py-2 border-2 border-[#3AAFA9] text-[#3AAFA9] rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!selectedSubTypeId}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedSubTypeId
              ? "bg-[#3AAFA9] text-white hover:bg-teal-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Configuration Table Component
  const ConfigurationTable = () => (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="bg-white overflow-hidden mb-4 flex-1">
        <div
          className="overflow-y-auto max-h-64 
                    [&::-webkit-scrollbar]:w-1 
                    [&::-webkit-scrollbar-track]:bg-gray-100 
                    [&::-webkit-scrollbar-thumb]:bg-[#3AAFA9] 
                    [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white">
              <tr>
                {getTableHeaders(selectedDisplayType, selectedSubTypeId).map(
                  (header, index) => (
                    <th
                      key={index}
                      className="py-2 text-left sticky border-b-2 border-gray-300 text-xs font-medium text-gray-700"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) => (
                <tr
                  key={index}
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
                      className={`py-2 text-xs w-64 ${
                        dataIndex === 0
                          ? "text-gray-900 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {data}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center gap-6">
        <button
          onClick={goBack}
          className="w-32 py-2 border-2 border-[#3AAFA9] text-[#3AAFA9] rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={confirmSelection}
          disabled={!selectedModel}
          className={`w-32 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedModel
              ? "bg-gray-400 text-white hover:bg-gray-500"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Choose Model
        </button>
      </div>
    </div>
  );

  // Render Steps
  const renderSelectStep = () => (
    <div className="h-full flex flex-col">
      <ModalHeader />
      <DisplayTypeGrid />
      {currentStep === "subtype" ? (
        <SubtypeSelection />
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-gray-600 text-sm">
            Select a model to start configuring your display.
          </p>
        </div>
      )}
    </div>
  );

  const renderConfigureStep = () => (
    <div className="h-full flex flex-col">
      <ModalHeader />
      <DisplayTypeGrid clickable={true} />
      <ConfigurationTable />
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[600px] overflow-hidden">
        <div className="p-6 h-full">
          {currentStep === "select" || currentStep === "subtype"
            ? renderSelectStep()
            : renderConfigureStep()}
        </div>
      </div>
    </div>
  );
};
