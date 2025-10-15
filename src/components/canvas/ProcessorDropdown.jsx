import React, { useState } from "react";
import { ChevronDown, Check, Info } from "lucide-react";

// Data processor
export const processor = [
  {
    id: 1,
    name: "VX400",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 2,
    name: "VX600",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 3,
    name: "VX1000",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 4,
    name: "H2",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 5,
    name: "H5",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 6,
    name: "H9",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 7,
    name: "TB30",
    max_resolution_width: "",
    max_resolution_height: "",
  },
  {
    id: 8,
    name: "TB60",
    max_resolution_width: "",
    max_resolution_height: "",
  },
];

export const ProcessorDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProcessor, setSelectedProcessor] = useState(processor[0]);

  const handleSelect = (proc) => {
    setSelectedProcessor(proc);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-xs text-gray-600">Processor</label>

      {/* Processor Image & Info */}
      <div className="flex w-14 h-14">
        <img src="/processor-1.png" alt="Processor" className="w-full h-full" />
        <div className="flex items-center space-x-1 ml-2 mt-1">
          <Info size={12} className="text-gray-400" />
          <p className="text-xs text-gray-400">Details</p>
        </div>
      </div>

      {/* Dropdown */}
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-40 h-8 bg-teal-500 text-white px-3 py-2 flex items-center justify-between text-xs font-light ${
            isOpen ? "rounded-t" : "rounded"
          }`}
        >
          <span>{selectedProcessor.name}</span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 w-40 bg-teal-500 rounded-b shadow-lg">
            {processor.map((proc) => (
              <div
                key={proc.id}
                onClick={() => handleSelect(proc)}
                className={`px-3 py-2 text-xs font-light cursor-pointer transition-colors ${
                  selectedProcessor.id === proc.id
                    ? "bg-gray-200 text-teal-500 flex items-center gap-2 mx-2 rounded"
                    : "text-white hover:bg-teal-600"
                }`}
              >
                {selectedProcessor.id === proc.id && <Check size={16} />}
                <span>{proc.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Processor Info (Optional) */}
      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
        <p className="text-gray-600">
          Selected:{" "}
          <span className="font-medium">{selectedProcessor.name}</span>
        </p>
      </div>
    </div>
  );
};