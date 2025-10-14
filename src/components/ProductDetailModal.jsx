import React, { useMemo } from "react";
import { X } from "lucide-react";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { getDetailSpec } from "../utils/ProductDetailSpec";

const IndoorOutdoorModal = ({ basicSpecs, moduleSpecs, cabinetSpecs }) => (
  <div className="px-12 py-2 h-full">
    {/* Basic Specifications */}
    <div className="bg-white">
      <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-xs">
        {basicSpecs?.items.map((item, idx) => (
          <div key={idx} className="items-center w-28 text-center gap-1">
            <p className="text-xs text-gray-600">{item.label}:</p>
            <p className="font-medium text-xs text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="h-px bg-gray-200 my-3" />

    {/* Module and Cabinet */}
    <div className="grid grid-cols-2 gap-16">
      {moduleSpecs && (
        <div>
          <p className="text-lg lg:text-base font-normal lg:font-medium text-gray-800 mb-0 text-center">
            Module
          </p>
          <div className="rounded-lg flex items-center justify-center mb-4">
            <img
              src={moduleSpecs.imagePath || "https://placehold.co/128x128"}
              alt="Module"
              className="w-28 h-28 object-contain mx-auto rounded"
            />
          </div>
          <div className="space-y-3">
            {moduleSpecs.items.map((item, idx) => (
              <div key={idx} className="flex">
                <p className="text-xs w-48 text-gray-600">{item.label}</p>
                <p className="text-xs w-auto font-medium text-gray-900 text-right">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {cabinetSpecs && (
        <div>
          <p className="text-lg lg:text-base font-normal lg:font-medium text-gray-800 mb-0 text-center">
            Cabinet
          </p>
          <div className="rounded-lg flex items-center justify-center mb-4">
            <img
              src={cabinetSpecs.imagePath || "https://placehold.co/128x128"}
              alt="Cabinet"
              className="w-28 h-28 object-contain mx-auto rounded"
            />
          </div>
          <div className="space-y-3">
            {cabinetSpecs.items.map((item, idx) => (
              <div key={idx} className="flex">
                <p className="text-xs w-48 text-gray-600">{item.label}</p>
                <p className="text-xs w-auto font-medium text-gray-900 text-right">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

const VideoWallModal = ({ specs, imagePath }) => {
  const basicSpecs = specs.find((s) => s.category === "Basic Specifications");
  const otherSpecs = specs.filter((s) => s.category !== "Basic Specifications");

  // Build three separate columns
  const col1Items = [];
  const col2Items = [];
  const col3Items = [];

  // Basic specs: TD1=Label, TD2=Value, TD3=Empty
  basicSpecs?.items.forEach((item) => {
    col1Items.push(item.label);
    col2Items.push(item.value);
    col3Items.push("");
  });

  // Other specs: TD1=Category, TD2=Label, TD3=Value
  otherSpecs.forEach((spec) => {
    spec.items.forEach((item, itemIndex) => {
      const isFirstItem = itemIndex === 0;

      col1Items.push(isFirstItem ? spec.category : "");
      col2Items.push(item.label || "");
      col3Items.push(item.value || "");
    });
  });

  return (
    <div className="h-full">
      {/* Product Image */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-center bg-white h-56">
          <img
            src={imagePath || "https://placehold.co/500x200"}
            alt="Product"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      {/* Three Column Table Layout */}
      <div className="flex gap-0 px-6 pt-4">
        {/* TD1: Basic=Label, Others=Category */}
        <div className="flex-1 px-4">
          <div className="space-y-1 w-64">
            {col1Items.map((item, idx) => (
              <p key={idx} className="text-xs text-gray-700 h-6">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* TD2: Basic=Value, Others=Label */}
        <div className="flex-1 px-4">
          <div className="space-y-1 w-64">
            {col2Items.map((item, idx) => (
              <p key={idx} className="text-xs text-gray-700 h-6">
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* TD3: Basic=Empty, Others=Value */}
        <div className="flex-1 px-4">
          <div className="space-y-1 w-64">
            {col3Items.map((item, idx) => (
              <p key={idx} className="text-xs text-gray-900 font-medium h-6">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetailModal = ({ isOpen, onClose }) => {
  const { selectedModel } = UseNavbarStore();

  const specifications = useMemo(() => {
    if (!selectedModel) return [];
    return getDetailSpec(selectedModel.modelData, selectedModel.name);
  }, [selectedModel]);

  if (!selectedModel || !isOpen || specifications.length === 0) return null;

  const basicSpecs = specifications[0];
  const moduleSpecs = specifications.find((s) => s.category === "Module");
  const cabinetSpecs = specifications.find((s) => s.category === "Cabinet");
  const isIndoorOutdoor = moduleSpecs || cabinetSpecs;

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-[380px] lg:w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="relative flex items-center justify-center">
            <p className="text-lg lg:text-xl font-medium text-gray-800">
              Product Detail
            </p>
            <button
              onClick={onClose}
              className="absolute right-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}

          {isIndoorOutdoor ? (
            <IndoorOutdoorModal
              basicSpecs={basicSpecs}
              moduleSpecs={moduleSpecs}
              cabinetSpecs={cabinetSpecs}
            />
          ) : (
            <VideoWallModal
              specs={specifications}
              imagePath={selectedModel?.modelData?.image_path}
            />
          )}
        </div>
      </div>
    </div>
  );
};
