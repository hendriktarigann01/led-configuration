import React from "react";
import { X } from "lucide-react";
import { UseModalStore } from "../store/UseModalStore";

export const ConfigurationModal = () => {
  const {
    isOpen,
    currentStep,
    selectedDisplayTypeId,
    selectedModel,
    getDisplayTypes,
    getSelectedTypeConfigurations,
    getSelectedDisplayType,
    closeModal,
    selectDisplayType,
    selectModel,
    goBack,
    confirmSelection,
  } = UseModalStore();

  if (!isOpen) return null;

  const displayTypes = getDisplayTypes();
  const configurations = getSelectedTypeConfigurations();
  const selectedDisplayType = getSelectedDisplayType();

  const renderSelectStep = () => (
    <div className="p-8">
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

      {/* Display Type Options */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {displayTypes
          .filter((type) => type.id !== 2)
          .map((type) => (
            <div
              key={type.id}
              onClick={() => selectDisplayType(type.id)}
              className={`cursor-pointer p-6 rounded-lg border-2 transition-all hover:border-teal-500 ${
                selectedDisplayTypeId === type.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                {/* Display Type Image */}
                <div className="w-24 h-24 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-gray-400 text-xs">
                    {type.name.includes("Indoor") ? (
                      <img
                        src="/product/model/indoor.svg"
                        alt="Indoor"
                        className="w-20 h-20 inline-block"
                      />
                    ) : type.name.includes("Outdoor") ? (
                      <img
                        src="/product/model/outdoor.svg"
                        alt="Outdoor"
                        className="w-20 h-20 inline-block"
                      />
                    ) : type.name.includes("Video") ? (
                      <img
                        src="/product/model/video_wall.svg"
                        alt="Video Wall"
                        className="w-20 h-20 inline-block"
                      />
                    ) : (
                      "LED"
                    )}
                  </div>
                </div>

                {/* Display Type Name */}
                <h3 className="font-medium text-gray-800">{type.name}</h3>
              </div>
            </div>
          ))}
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Select a model to start configuring your display.
        </p>
        <button
          onClick={() =>
            selectedDisplayTypeId && selectDisplayType(selectedDisplayTypeId)
          }
          disabled={!selectedDisplayTypeId}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            selectedDisplayTypeId
              ? "bg-gray-400 text-white hover:bg-gray-500"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Choose Model
        </button>
      </div>
    </div>
  );

  const renderConfigureStep = () => {
    // Determine table headers based on display type
    const getTableHeaders = () => {
      if (selectedDisplayType?.name.includes("Video Wall")) {
        return ["Inch", "Bezel to Bezel", "Unit Size (mm)", "Brightness"];
      }

      if (selectedDisplayType?.name.includes("Module")) {
        return [
          "Pixel Pitch",
          "Module Size",
          "Module Weight",
          "Brightness",
          "Refresh Rate",
        ];
      }

      // Default for Cabinet and Outdoor
      return [
        "Pixel Pitch",
        "Cabinet Size",
        "Cabinet Weight",
        "Brightness",
        "Refresh Rate",
      ];
    };

    const getTableRow = (config, index) => {
      if (selectedDisplayType?.name.includes("Video Wall")) {
        return (
          <tr
            key={index}
            onClick={() => selectModel(config)}
            className={`cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedModel === config
                ? "bg-blue-50 border-l-4 border-blue-500"
                : ""
            }`}
          >
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

      if (selectedDisplayType?.name.includes("Module")) {
        return (
          <tr
            key={index}
            onClick={() => selectModel(config)}
            className={`cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedModel === config
                ? "bg-blue-50 border-l-4 border-blue-500"
                : ""
            }`}
          >
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

      // Default for Cabinet and Outdoor
      return (
        <tr
          key={index}
          onClick={() => selectModel(config)}
          className={`cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedModel === config
              ? "bg-blue-50 border-l-4 border-blue-500"
              : ""
          }`}
        >
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
      <div className="p-8">
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

        {/* Display Types Row - Now Clickable */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {displayTypes
            .filter((type) => type.id !== 2)
            .map((type) => (
              <div
                key={type.id}
                onClick={() => selectDisplayType(type.id)}
                className={`cursor-pointer p-6 rounded-lg border-2 transition-all hover:border-teal-500 ${
                  type.id === selectedDisplayTypeId
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-gray-400 text-xs">
                      {type.name.includes("Indoor") ? (
                        <img
                          src="/product/model/indoor.svg"
                          alt="Indoor"
                          className="w-20 h-20 inline-block"
                        />
                      ) : type.name.includes("Outdoor") ? (
                        <img
                          src="/product/model/outdoor.svg"
                          alt="Outdoor"
                          className="w-20 h-20 inline-block"
                        />
                      ) : type.name.includes("Video") ? (
                        <img
                          src="/product/model/video_wall.svg"
                          alt="Video Wall"
                          className="w-20 h-20 inline-block"
                        />
                      ) : (
                        "LED"
                      )}
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm">
                    {type.name}
                  </h3>
                  {type.id === selectedDisplayTypeId && (
                    <div className="w-8 h-8 bg-teal-500 rounded-full mt-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Configuration Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {getTableHeaders().map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
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

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={goBack}
            className="px-6 py-3 border-2 border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={confirmSelection}
            disabled={!selectedModel}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              selectedModel
                ? "bg-gray-400 text-white hover:bg-gray-500"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
        {currentStep === "select" && renderSelectStep()}
        {currentStep === "configure" && renderConfigureStep()}
      </div>
    </div>
  );
};