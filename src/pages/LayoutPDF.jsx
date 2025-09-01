import React, { useState } from "react";
import { FirstPage } from "../components/export/FirstPage";
import { ModelPage } from "../components/export/ModelPage";
import { IndoorOutdoorConfig } from "../components/export/spec-config/IndoorOutdoor";
import { VideoWallConfig } from "../components/export/spec-config/VideoWall";
import { Indoor } from "../components/export/spec-default/Indoor";
import { Outdoor } from "../components/export/spec-default/Outdoor";
import { VideoWall } from "../components/export/spec-default/VideoWall";
import { LastPage } from "../components/export/LastPage";

const LayoutPDF = () => {
  const [currentPage, setCurrentPage] = useState("first");

  const pages = [
    { id: "first", name: "First Page", component: FirstPage },
    { id: "model", name: "Model", component: ModelPage },
    {
      id: "spec-config-1",
      name: "Spec Config Indoor Outdoor",
      component: IndoorOutdoorConfig,
    },
    {
      id: "spec-config-2",
      name: "Spec Config Video Wall",
      component: VideoWallConfig,
    },
    {
      id: "spec-default-1",
      name: "Spec Default Indoor",
      component: Indoor,
    },
    {
      id: "spec-default-2",
      name: "Spec Default Outdoor",
      component: Outdoor,
    },
    {
      id: "spec-default-3",
      name: "Spec Default VideoWall",
      component: VideoWall,
    },
    { id: "last", name: "Last Page", component: LastPage },
  ];

  const CurrentComponent = pages.find((p) => p.id === currentPage)?.component;

  return (
    <div>
      {/* Navigation */}
      <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">Pages:</div>
        <div className="space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm ${
                currentPage === page.id
                  ? "bg-[#3AAFA9] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">Size: A4 (210mm x 297mm)</div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          {CurrentComponent && <CurrentComponent />}
        </div>
      </div>
    </div>
  );
};

export default LayoutPDF;
