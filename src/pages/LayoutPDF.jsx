import React, { useState } from "react";

// Layout PDF Component
const LayoutPDF = ({ children }) => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
};

// Base Page Component
export const BasePage = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white shadow-lg mb-8 relative overflow-hidden ${className}`}
      style={{ width: "210mm", height: "297mm", minHeight: "297mm" }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-0 left-0 w-16 h-16 bg-teal-200 transform rotate-45 -translate-x-8 -translate-y-8"></div>
        <div className="absolute top-4 left-4 w-24 h-24 bg-teal-500 transform rotate-45 -translate-x-12 -translate-y-12"></div>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-teal-200 transform rotate-45 translate-x-8 translate-y-8"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-teal-500 transform rotate-45 translate-x-12 translate-y-12"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-6 right-8">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-8 bg-teal-600"></div>
            <div className="w-3 h-6 bg-teal-400 mt-2"></div>
            <div className="w-3 h-4 bg-teal-300 mt-4"></div>
          </div>
          <div className="text-xs text-gray-600">
            <div className="font-bold">MJ</div>
            <div>SOLUTION</div>
            <div>INDONESIA</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>

      {/* Footer */}
      <div className="absolute bottom-6 left-8 text-xs text-gray-600">
        <div className="font-semibold">MJ Solution Indonesia</div>
        <div>
          The Mansion Bougenville Kemayoran Tower Fontana Zona I Lantai 50
          Kemayoran Jakarta Utara
        </div>
        <div className="flex items-center space-x-4 mt-1">
          <div className="flex items-center space-x-1">
            <span>📧</span>
            <span>mjsolution.co.id</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📞</span>
            <span>(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </div>
  );
};
