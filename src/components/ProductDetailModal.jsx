import React, { useMemo } from "react";
import { X } from "lucide-react";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { getDetailSpec } from "../utils/ProductDetailSpec";

export const ProductDetailModal = ({ isOpen, onClose }) => {
  const { selectedModel } = UseNavbarStore();

  const specifications = useMemo(() => {
    if (!selectedModel) return [];
    return getDetailSpec(selectedModel.modelData, selectedModel.name);
  }, [selectedModel]);

  if (!selectedModel || !isOpen || specifications.length === 0) return null;

  // Get Basic Specifications (always first)
  const basicSpecs = specifications[0];

  // Get Module and Cabinet specs
  const moduleSpecs = specifications.find((spec) => spec.category === "Module");
  const cabinetSpecs = specifications.find(
    (spec) => spec.category === "Cabinet"
  );

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-[380px] lg:w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-2 h-full">
          {/* Header */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex mb- justify-center">
            <h2 className="text-lg:text-xl font-normal lg:font-medium text-gray-800">
              Export Calculator Simulation
            </h2>
          </div>

          {/* Basic Specifications at Top */}
          <div className="px-12 py-2 bg-white">
            <div className="grid grid-cols-1 gap-2">
              {basicSpecs?.items.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <p className="text-xs font-medium text-gray-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mx-12" />

          {/* Module and Cabinet Section */}
          <div className="px-12 py-2">
            <div className="grid grid-cols-2 gap-16">
              {/* Module Section */}
              {moduleSpecs && (
                <div>
                  <h3 className="text-lg:text-xl font-normal lg:font-medium text-gray-800 mb-1 text-center">
                    Module
                  </h3>

                  {/* Module Image Placeholder */}
                  <div className="bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-1"></div>
                     
                    </div>
                  </div>

                  {/* Module Specs */}
                  <div className="space-y-1">
                    {moduleSpecs.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1">
                        <p className="text-xs text-gray-600">{item.label}</p>
                        <p className="text-xs font-medium text-gray-900 text-right">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cabinet Section */}
              {cabinetSpecs && (
                <div>
                  <h3 className="text-lg:text-xl font-normal lg:font-medium text-gray-800 mb-1 text-center">
                    Cabinet
                  </h3>

                  {/* Cabinet Image Placeholder */}
                  <div className="bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded mx-auto mb-1"></div>
                      
                    </div>
                  </div>

                  {/* Cabinet Specs */}
                  <div className="space-y-1">
                    {cabinetSpecs.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1">
                        <p className="text-xs text-gray-600">{item.label}</p>
                        <p className="text-xs font-medium text-gray-900 text-right">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
