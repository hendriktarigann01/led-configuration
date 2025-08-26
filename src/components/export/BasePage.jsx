import React from "react";

export const BasePage = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-lg relative overflow-hidden ${className}`}
      style={{ width: "210mm", height: "297mm", minHeight: "297mm" }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-52">
        <img src="/top_pdf.png" alt="top" />
      </div>
      <div className="absolute bottom-0 right-0 w-52">
        <img src="/bottom_pdf.png" alt="bottom" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
