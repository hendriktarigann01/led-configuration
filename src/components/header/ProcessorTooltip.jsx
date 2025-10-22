import React from "react";
import { Check } from "lucide-react";

export const ProcessorTooltip = ({ processor, formattedConnections, show }) => {
  if (!show || !processor) return null;

  if (processor === "no compatible processor") {
    return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-[180px]">
        <p className="text-center">No information available</p>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black/90"></div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-[180px]">
      <div className="space-y-0">
        {/* Output Capacity Section */}
        {formattedConnections && formattedConnections.length > 0 && (
          <>
            <p>Output Capacity</p>
            {formattedConnections.map((conn, index) => (
              <div key={index} className="flex juitems-center gap-1">
                <span className="text-left">{conn.capacity}</span>
                <span className="flex gap-2 text-left">
                  <span>({conn.type})</span>
                  {conn.isActive && <Check size={12} />}
                </span>
              </div>
            ))}
          </>
        )}

        {/* Additional Processor Details */}
        {processor.maxWidth && processor.maxHeight && (
          <div className="mt-1 font-light">
            <p>Max Resolution</p>
            <p>
              {processor.maxWidth} x {processor.maxHeight}
            </p>
          </div>
        )}

        {processor.lan && (
          <div className="mt-1 font-light">
            <p>LAN</p>
            <p>{processor.lan}</p>
          </div>
        )}

        {processor.layers && (
          <div className="mt-1 font-light">
            <p>Layers</p>
            <p>{processor.layers}</p>
          </div>
        )}

        {processor.storage && (
          <div className="mt-1 font-light">
            <p>Storage</p>
            <p>{processor.storage}</p>
          </div>
        )}

        {processor.os && (
          <div className="mt-1 font-light">
            <p>OS</p>
            <p>{processor.os}</p>
          </div>
        )}

        {processor.input && (
          <div className="mt-1 font-light">
            <p>Input</p>
            <p>{processor.input}</p>
          </div>
        )}

        {processor.output && (
          <div className="mt-1 font-light">
            <p>Output</p>
            <p>{processor.output}</p>
          </div>
        )}

        {processor.maxInputChannels && (
          <div className="mt-1 font-light">
            <p>Max Input Channels</p>
            <p>{processor.maxInputChannels}</p>
          </div>
        )}

        {processor.minInputChannels && (
          <div className="mt-1 font-light">
            <p>Max Input Channels</p>
            <p>{processor.minInputChannels}</p>
          </div>
        )}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black/90"></div>
    </div>
  );
};
