import React, { useRef, useState, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { ArrowRight, Image, Video, Upload, X, CirclePlus } from "lucide-react";
import { DragDropUpload } from "./DragDropUpload";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseModalStore } from "../store/UseModalStore";
import { UseCanvasStore } from "../store/UseCanvasStore";

export const Navbar = () => {
  const [height, setHeight] = useState(200);
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();

  const minHeight = 80;
  const maxHeight =
    typeof window !== "undefined" ? window.innerHeight * 0.7 : 400; // 70% of screen height max

  const {
    activeTab,
    selectedModel,
    selectedContent,
    setActiveTab,
    setSelectedModel,
    setSelectedContent,
    setCustomImageUrl,
    roomImageUrl,
    setRoomImageUrl,
  } = UseNavbarStore();

  const { isConfigured } = UseCanvasStore();

  const { openModal, selectDisplayType } = UseModalStore();

  const fileInputRef = useRef(null);

  const contentOptions = [
    { id: "Default Image", label: "Default Image", icon: Image },
    { id: "Default Video", label: "Default Video", icon: Video },
    { id: "Custom", label: "Custom", icon: Upload },
    { id: "No Content", label: "No Content", icon: X },
  ];

  const handleDrag = (event, info) => {
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, height - info.delta.y)
    );
    setHeight(newHeight);
  };

  const handleDragEnd = (event, info) => {
    const velocity = info.velocity.y;
    const shouldExpand =
      velocity < -500 ||
      (velocity > -500 && velocity < 500 && height > maxHeight * 0.4);

    if (shouldExpand) {
      setHeight(maxHeight);
      setIsExpanded(true);
    } else {
      setHeight(minHeight);
      setIsExpanded(false);
    }
  };

  const handleChangeModel = (e) => {
    // Prevent event bubbling if this button is inside a larger clickable area
    e.preventDefault();
    e.stopPropagation();

    // Don't proceed if not configured
    if (!isConfigured()) return;

    if (selectedModel && selectedModel.displayTypeId) {
      // Open modal with pre-selected display type
      selectDisplayType(selectedModel.displayTypeId);
      openModal();
    } else {
      // Open modal from beginning
      openModal();
    }
  };

  const handleContentSelection = (optionId) => {
    // Don't proceed if not configured
    if (!isConfigured()) return;

    if (optionId === "Custom") {
      // Trigger file input for custom content
      fileInputRef.current?.click();
    } else {
      setSelectedContent(optionId);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type and size
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 3 * 1024 * 1024; // 3MB

      if (!validTypes.includes(file.type)) {
        alert("Please select a JPG or PNG file only.");
        return;
      }

      if (file.size > maxSize) {
        alert("File size must be less than 3MB.");
        return;
      }

      // Create object URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);

      // Set custom content and store the file URL in Zustand store
      setSelectedContent("Custom");
      setCustomImageUrl(fileUrl);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleRoomImageUpload = (fileUrl) => {
    setRoomImageUrl(fileUrl);
  };

  const handleModalOpen = () => {
    // Don't proceed if not configured
    if (!isConfigured()) return;
    openModal();
  };

  // Content component that will be reused
  const NavbarContent = () => (
    <>
      {/* Model Section */}
      <div>
        <h3 className="text-sm font-normal text-gray-700 mb-2">Model</h3>

        {/* Model Display */}
        <div
          onClick={!selectedModel ? openModal : handleChangeModel}
          className="border border-gray-300 hover:border-gray-400 w-full h-36 lg:h-32 rounded-xs mb-4 flex items-center justify-center cursor-pointer"
        >
          {!selectedModel ? (
            /* Empty Model */
            <div className="flex items-center justify-center w-full h-full">
              <div className="space-y-1">
                <CirclePlus className="w-4 h-4 mx-auto text-gray-500" />
                <p className="text-xs text-gray-700">Select Model</p>
              </div>
            </div>
          ) : (
            /* Fill Model */
            <div className="flex items-center justify-between w-full m-3">
              <div>
                <p className="text-xs text-gray-500">{selectedModel.name}</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedModel.code}
                </p>
                <div className="flex items-center mt-4 space-x-2 text-gray-500 group">
                  <span className="text-xs gxtext-gray-700">Change Model</span>
                  <ArrowRight className="w-4 h-4 text-gray-700" />
                </div>
              </div>
              <div className="w-20 h-20 bg-white flex items-center justify-center">
                <img
                  src={selectedModel.image || "/product/model/indoor.svg"}
                  alt=""
                  className="w-auto h-auto max-w-full max-h-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div>
        <h3 className="text-sm font-normal text-gray-700 mb-2">Content</h3>

        {/* Content Options Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {contentOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedContent === option.id;
            const isDisabled = !isConfigured();

            return (
              <button
                key={option.id}
                onClick={() => handleContentSelection(option.id)}
                disabled={isDisabled}
                className={`flex items-center justify-center h-10 border space-x-2 transition-colors ${
                  isDisabled
                    ? "cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                    : isSelected
                    ? "bg-[#3AAFA9] text-white border-[#3AAFA9]"
                    : "bg-white text-gray-500 border-gray-300 hover:border-gray-400 cursor-pointer"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-xs">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileSelect}
          disabled={!isConfigured()}
          className="hidden"
        />

        <p className="text-[10px] text-gray-500 mt-3">
          * JPG or PNG only, Max 3mb
        </p>
      </div>

      {/* Room Setup Section - Moved to bottom */}
      <div>
        <h3 className="text-sm font-normal text-gray-700 mb-2">Room Setup</h3>
        <p className="text-xs text-[#3AAFA9] mb-3">
          Upload a photo of your room for a customized view of your new Radiance
          LED display. For best results, position yourself at least 6 m away
          from the intended surface. Do not zoom in while shooting.
        </p>

        <div
          className={!isConfigured() ? "pointer-events-none opacity-50" : ""}
        >
          <DragDropUpload onFileSelect={handleRoomImageUpload} />
        </div>
        <p className="text-[10px] text-gray-500 mt-3">
          * JPG or PNG only, Max 3mb
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Version - Original Layout */}
      <div className="hidden lg:block w-[350px] lg:h-screen bg-white">
        {/* Header with Logo */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center">
            <img
              src="/logo/mjs_logo_text.png"
              alt="logo"
              className="w-40 h-auto"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-3 space-y-4 max-h-none overflow-y-auto">
          <NavbarContent />
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden">
        {/* Backdrop overlay when expanded */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => {
              setHeight(minHeight);
              setIsExpanded(false);
            }}
          />
        )}

        {/* Bottom Sheet */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50"
          style={{ height }}
          animate={{ height }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 500,
          }}
          drag="y"
          dragControls={dragControls}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          {/* Drag Handle */}
          <div
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Content - Mobile */}
          <div className="px-5 pt-5 pb-10 space-y-6 overflow-y-auto h-full">
            <NavbarContent />
          </div>
        </motion.div>
      </div>
    </>
  );
};
