import React from "react";
import { ArrowRight, Image, Video, Upload, X } from "lucide-react";
import { UseNavbarStore } from "../store/UseNavbarStore";

export const Navbar = () => {
  const {
    activeTab,
    selectedApplication,
    selectedModel,
    selectedContent,
    setActiveTab,
    setSelectedApplication,
    setSelectedModel,
    setSelectedContent,
  } = UseNavbarStore();

  const applications = [
    "Control Room",
    "Meeting Room/Conference",
    "Public Display/Lobby",
    "Other",
  ];

  const contentOptions = [
    { id: "Default Image", label: "Default Image", icon: Image },
    { id: "Default Video", label: "Default Video", icon: Video },
    { id: "Custom", label: "Custom", icon: Upload },
    { id: "No Content", label: "No Content", icon: X },
  ];

  return (
    <div className="w-[350px] h-full bg-white">
      {/* Header with Logo */}
      <div className="p-8">
        <div className="flex items-center space-x-3">
          <img
            src="/logo/mjs_logo_text.png"
            alt="logo"
            className="w-36 h-auto mx-auto flex"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("LED Setup")}
          className={`flex-1 py-4 px-6 text-sm font-medium ${
            activeTab === "LED Setup"
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          LED Setup
        </button>
        <button
          onClick={() => setActiveTab("Room Setup")}
          className={`flex-1 py-4 px-6 text-sm font-medium ${
            activeTab === "Room Setup"
              ? "bg-teal-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-200"
          }`}
        >
          Room Setup
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Application Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Application
          </h3>
          <div className="space-y-3">
            {applications.map((app) => (
              <label
                key={app}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="application"
                  value={app}
                  checked={selectedApplication === app}
                  onChange={(e) => setSelectedApplication(e.target.value)}
                  className="w-4 h-4 border-2 border-gray-300 rounded-full 
                            appearance-none cursor-pointer relative
                            checked:border-teal-500
                            before:content-[''] before:w-2 before:h-2 before:rounded-full 
                            before:absolute before:top-1/2 before:left-1/2 
                            before:-translate-x-1/2 before:-translate-y-1/2 
                            checked:before:bg-teal-500 before:hidden checked:before:block"
                />
                <span className="text-sm text-gray-700">{app}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Model Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Model</h3>

          {/* Model Display */}
          <div className="border-2 border-gray-100 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{selectedModel.name}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedModel.code}
                </p>
                <button className="flex items-center mt-8 space-x-2 text-gray-600 hover:text-gray-800">
                  <span className="text-sm">Change Model</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* image */}
              <div className="w-24 h-w-24 bg-white flex items-center justify-center">
                <img
                  src="/product/model/indoor.svg"
                  alt=""
                  className="w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>

          {/* Content Options Grid */}
          <div className="grid grid-cols-2 gap-3">
            {contentOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedContent(option.id)}
                  className={`flex items-center justify-center h-10 border space-x-2 transition-colors ${
                    selectedContent === option.id
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-xs">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* File Upload Note */}
          <p className="text-xs text-gray-500 mt-3">
            * JPG or PNG only, Max 3mb
          </p>
        </div>
      </div>
    </div>
  );
};
