import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { UseProcessorStore } from "../../store/UseProcessorStore";

export const ProcessorDropdown = ({ disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { selectedProcessor, setSelectedProcessor, getAvailableProcessors } =
    UseProcessorStore();

  const availableProcessors = getAvailableProcessors();

  const handleSelect = (proc) => {
    if (disabled) return;
    setSelectedProcessor(proc);
    setIsOpen(false);
  };

  const Tooltip = ({ children, text, show }) => {
    if (!show) return children;

    return (
      <div className="relative group">
        {children}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative z-40">
      <Tooltip text="Please configure a model first" show={disabled}>
        <button
          onClick={() =>
            !disabled &&
            selectedProcessor !== "no compatible processor" &&
            setIsOpen(!isOpen)
          }
          disabled={disabled || selectedProcessor === "no compatible processor"}
          className={`w-40 h-8 px-3 py-2 flex items-center justify-between text-xs font-light ${
            isOpen ? "rounded-t" : "rounded"
          } ${
            disabled || selectedProcessor === "no compatible processor"
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#3AAFA9] text-white cursor-pointer"
          }`}
        >
          <span>
            {selectedProcessor === "no compatible processor"
              ? "No Compatible"
              : selectedProcessor?.name || "Select Processor"}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </Tooltip>

      {isOpen && !disabled && (
        <div
          className="absolute z-10 w-40 bg-[#3AAFA9] rounded-b max-h-72 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {availableProcessors.map((proc) => (
            <div
              key={proc.id}
              onClick={() => handleSelect(proc)}
              className={`px-2 py-2  h-8 text-xs font-light cursor-pointer transition-colors ${
                selectedProcessor?.id === proc.id
                  ? "bg-gray-200 text-[#3AAFA9] flex items-center gap-2 mx-2 my-2"
                  : "text-white hover:border hover:border-gray-200 mx-2 my-2"
              }`}
            >
              {selectedProcessor?.id === proc.id && <Check size={16} />}
              <span>{proc.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
