import React from "react";
import { Check } from "lucide-react";

export const ProcessorTooltip = ({ processor, formattedConnections, show }) => {
  if (!show || !processor || !formattedConnections) return null;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-[180px]">
      <div className="space-y-1">
        <p className="font-light mb-2">Output Capacity</p>
        {formattedConnections.map((conn, index) => (
          <div key={index} className="flex justify-start font-light items-center gap-1">
            <span className="text-left">{conn.capacity}</span>
            <span className="flex gap-2 text-left">
              <span>({conn.type})</span>
              {conn.isActive && <Check size={12} />}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-black/90"></div>
    </div>
  );
};
