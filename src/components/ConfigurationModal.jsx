import React from "react";
import { X } from "lucide-react";
import { UseModalStore } from "../store/UseModalStore";

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

  // Common modal header
  const ModalHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-medium text-gray-800">
        Choose Display Configurator
      </h2>
      <button
        onClick={closeModal}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={24} />
      </button>
    </div>
  );

  // Display type selection grid (reusable)
  const DisplayTypeGrid = ({ clickable = true }) => (
    <div className="grid grid-cols-3 gap-6 mb-8">
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
            <div className="w-40 h-40 rounded-lg mb-4 flex items-center justify-center">
              <div className="text-gray-400 text-xs">
                {type.name.includes("Indoor") ? (
                  <img
                    src="/product/model/indoor.svg"
                    alt="Indoor"
                    className="w-full h-full inline-block"
                  />
                ) : type.name.includes("Outdoor") ? (
                  <img
                    src="/product/model/outdoor.svg"
                    alt="Outdoor"
                    className="w-full h-full inline-block"
                  />
                ) : type.name.includes("Video") ? (
                  <img
                    src="/product/model/video_wall.svg"
                    alt="Video Wall"
                    className="w-full h-full inline-block"
                  />
                ) : (
                  "LED"
                )}
              </div>
            </div>

            <div
              className={`mt-1 px-4 py-3 w-full rounded-md text-sm font-medium transition-colors
                        ${
                          type.id === selectedDisplayTypeId
                            ? "bg-teal-500 text-white border border-teal-500"
                            : "text-gray-600 border border-transparent hover:border-teal-500"
                        }`}
            >
              {type.name}
            </div>
          </div>
        ))}
    </div>
  );

  const renderSelectStep = () => (
    <div className="w-full h-[600px] p-8 flex flex-col">
      <ModalHeader />
      <DisplayTypeGrid />

      {/* Show subtype selection if Indoor LED is selected */}
      {currentStep === "subtype" ? (
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-gray-600 mb-6 text-center">
            Choose your preferred configuration method, start by arranging
            individual modules for detailed customisation, or use cabinet-based
            setup for a quicker and structured layout.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-8 max-w-2xl">
            <div
              onClick={() => selectSubType(1)}
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all hover:border-teal-500 ${
                selectedSubTypeId === 1
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-auto mb-4 flex items-center justify-center">
                  <img src="/cabinet.webp" alt="Cabinet-Image" />
                </div>
                <h3 className="font-medium text-gray-800">Cabinet</h3>
                {selectedSubTypeId === 1 && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full mt-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            <div
              onClick={() => selectSubType(2)}
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all hover:border-teal-500 ${
                selectedSubTypeId === 2
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-40 h-auto mb-4 flex items-center justify-center">
                  <img src="/modul.webp" alt="Modul-Image" />
                </div>
                <h3 className="font-medium text-gray-800">Modul</h3>
                {selectedSubTypeId === 2 && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full mt-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full max-w-2xl">
            <button
              onClick={goBack}
              className="px-6 py-3 border-2 border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedSubTypeId}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                selectedSubTypeId
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-gray-600 mb-6">
            Select a model to start configuring your display.
          </p>
        </div>
      )}
    </div>
  );

  const renderConfigureStep = () => {
    // Dynamic table headers
    const getTableHeaders = () => {
      if (selectedDisplayType?.name.includes("Video Wall")) {
        return ["Inch", "Bezel to Bezel", "Unit Size (mm)", "Brightness"];
      }
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

    // Dynamic table row
    const getTableRow = (config, index) => {
      const commonProps = {
        key: index,
        onClick: () => selectModel(config),
        className: `cursor-pointer transition-colors rounded-lg
    ${
      selectedModel === config
        ? "bg-[#E0F2F0]"
        : "hover:bg-gray-50 border border-transparent"
    }`,
      };

      if (selectedDisplayType?.name.includes("Video Wall")) {
        return (
          <tr {...commonProps}>
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
              {config.inch}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.bezel_to_bezel}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.unit_size_mm}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.brightness}
            </td>
          </tr>
        );
      }

      if (selectedSubTypeId === 2) {
        return (
          <tr {...commonProps}>
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
              {config.pixel_pitch}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.module_size}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.module_weight}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.brightness}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
              {config.refresh_rate}
            </td>
          </tr>
        );
      }

      return (
        <tr {...commonProps}>
          <td className="px-4 py-3 text-sm text-gray-900 font-medium">
            {config.pixel_pitch}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {config.cabinet_size}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {config.cabinet_weight || config.module_weight}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {config.brightness}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">
            {config.refresh_rate}
          </td>
        </tr>
      );
    };

    return (
      <div className="w-[900px] h-[600px] p-8 overflow-x-hidden">
        <ModalHeader />
        <DisplayTypeGrid clickable={true} />

        <div className="bg-white rounded-lg  overflow-hidden mb-6">
          <table className="w-full">
            <thead>
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left border-b-2 border-gray-300 text-sm font-medium text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {configurations.map((config, index) =>
                getTableRow(config, index)
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-10">
          <button
            onClick={goBack}
            className="w-40 px-3 py-3 border-2 border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={confirmSelection}
            disabled={!selectedModel}
            className={`w-40 px-3 py-3 rounded-lg font-medium transition-colors ${
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
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {currentStep === "select" || currentStep === "subtype"
          ? renderSelectStep()
          : renderConfigureStep()}
      </div>
    </div>
  );
};
