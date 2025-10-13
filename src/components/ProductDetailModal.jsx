import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  getIndoorSpecifications,
  getOutdoorSpecifications,
  getVideoWallSpecifications,
} from "../constants/SpecificationData";
import { UseNavbarStore } from "../store/UseNavbarStore";

export const ProductDetailModal = ({ isOpen, onClose }) => {
  const { selectedModel } = UseNavbarStore();
  const [activeTab, setActiveTab] = useState("Basic Specifications");

  if (!selectedModel || !isOpen) return null;

  // Determine which specifications to display based on model type
  const getSpecifications = () => {
    switch (selectedModel.displayTypeId) {
      case "indoor":
        return getIndoorSpecifications(selectedModel.specs);
      case "outdoor":
        return getOutdoorSpecifications(selectedModel.specs);
      case "videowall":
        return getVideoWallSpecifications(selectedModel.specs);
      default:
        return getIndoorSpecifications(selectedModel.specs);
    }
  };

  const specifications = getSpecifications();
  const categories = specifications.map((spec) => spec.category);
  const activeCategory = specifications.find(
    (spec) => spec.category === activeTab
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50 overflow-hidden"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Product Detail
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="px-8 py-6 border-b border-gray-100">
                <div className="grid grid-cols-3 gap-8">
                  {activeCategory?.items.slice(0, 3).map((item, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {item.label}
                      </p>
                      <p className="text-base font-semibold text-gray-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="px-8 pt-6 pb-0">
                <div className="flex gap-1 border-b border-gray-200">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveTab(category)}
                      className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === category
                          ? "text-gray-900 border-[#3AAFA9]"
                          : "text-gray-600 border-transparent hover:text-gray-900"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="px-8 py-6">
                {activeCategory && (
                  <div className="grid grid-cols-2 gap-8">
                    {activeCategory.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          {item.label}
                        </p>
                        <p className="text-base font-semibold text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
