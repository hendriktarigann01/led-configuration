import React from "react";
import { Info } from "lucide-react";
import { ProcessorDropdown } from "./ProcessorDropdown";
import { ProcessorTooltip } from "./ProcessorTooltip";
import { UseProcessorStore } from "../../store/UseProcessorStore";

export const ProcessorSection = ({ configured }) => {
  const { selectedProcessor, getFormattedConnections } = UseProcessorStore();

  const formattedConnections = selectedProcessor
    ? getFormattedConnections(selectedProcessor)
    : [];

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-base font-medium text-gray-800">Control System</h3>

      <div className="flex flex-col lg:space-y-2 w-44">
        <div className="flex space-x-4 lg:space-x-0 space-y-4 lg:space-y-0">
          <div className="flex flex-col space-y-1">
            <label className="text-xs text-gray-600">Processor</label>

            {/* Processor Image & Info */}
            <div className="flex w-24 h-w-24 justify-between lg:w-14 lg:h-14">
              <img
                src="/processor-1.png"
                alt="Processor"
                className={`w-full h-full ${
                  !configured ? "opacity-50 grayscale" : ""
                }`}
              />
              <div className="flex items-center space-x-2 ml-10 lg:ml-2">
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <Info
                        size={12}
                        className={
                          configured ? "text-gray-400" : "text-gray-300"
                        }
                      />
                      <p
                        className={`text-xs ${
                          configured ? "text-gray-400" : "text-gray-300"
                        }`}
                      >
                        Detail
                      </p>
                    </div>

                    {configured && (
                      <ProcessorTooltip
                        processor={selectedProcessor}
                        formattedConnections={formattedConnections}
                        show={configured}
                      />
                    )}
                  </div>

                  {/* Mobile Dropdown */}
                  <div className="lg:hidden">
                    <ProcessorDropdown disabled={!configured} />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Dropdown */}
            <div className="hidden lg:block">
              <ProcessorDropdown disabled={!configured} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
