import React, { useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import {
  ArrowRight,
  Image,
  Video,
  Upload,
  X,
  CirclePlus,
  Info,
} from "lucide-react";
import { DragDropUpload } from "./DragDropUpload";
import { ProductDetailModal } from "./ProductDetailModal";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseModalStore } from "../store/UseModalStore";
import { UseCanvasStore } from "../store/UseCanvasStore";

export const Navbar = () => {
  const [height, setHeight] = useState(80);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const dragControls = useDragControls();

  const minHeight = 80;
  const maxHeight =
    typeof window !== "undefined" ? window.innerHeight * 0.7 : 400;

  const {
    selectedModel,
    selectedContent,
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
    e.preventDefault();
    e.stopPropagation();

    if (!isConfigured()) return;

    if (selectedModel && selectedModel.displayTypeId) {
      selectDisplayType(selectedModel.displayTypeId);
      openModal();
    } else {
      openModal();
    }
  };

  const handleContentSelection = (optionId) => {
    if (!isConfigured()) return;

    if (optionId === "Custom") {
      fileInputRef.current?.click();
    } else {
      setSelectedContent(optionId);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      const maxSize = 3 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        alert("Please select a JPG or PNG file only.");
        return;
      }

      if (file.size > maxSize) {
        alert("File size must be less than 3MB.");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setSelectedContent("Custom");
      setCustomImageUrl(fileUrl);
    }
    event.target.value = "";
  };

  const handleRoomImageUpload = (fileUrl) => {
    setRoomImageUrl(fileUrl);
  };

  const NavbarContent = () => (
    <>
      {/* Model Section */}
      <div>
        <h3 className="text-sm font-normal text-gray-700 mb-2">Model</h3>

        <div
          onClick={!selectedModel ? openModal : handleChangeModel}
          className="border border-gray-300 hover:border-gray-400 w-full h-36 lg:h-28 rounded-xs mb-4 flex items-center justify-center cursor-pointer"
        >
          {!selectedModel ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="space-y-1">
                <CirclePlus className="w-4 h-4 mx-auto text-gray-500" />
                <p className="text-xs text-gray-700">Select Model</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full m-3">
              <div>
                <p className="text-xs text-gray-500">{selectedModel.name}</p>
                <p className="text-sm font-semibold text-gray-700">
                  {selectedModel.code}
                </p>
                <div className="flex items-center mt-4 space-x-2 text-gray-500 group">
                  <span className="text-xs text-gray-700">Change Model</span>
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

      <button
        onClick={() => setIsProductDetailOpen(true)}
        className="flex w-auto items-center cursor-pointer hover:opacity-70 transition-opacity"
      >
        <Info size={14} className="mr-2 text-gray-400" />
        <div className="text-sm font-normal text-gray-400">Product Detail</div>
      </button>

      {/* Content Section */}
      <div>
        <h3 className="text-sm font-normal text-gray-700 mb-2">Content</h3>

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

      {/* Room Setup Section */}
      <div className="m-0">
        <h3 className="text-sm font-normal text-gray-700 mb-2">Room Setup</h3>
        <p className="text-xs text-[#3AAFA9] mb-3">
          Upload a room photo for a custom Radiance LED preview. Stand about 6 m
          from the surface and avoid zooming.
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

      <div className="visible lg:invisible w-auto p-3 lg:p-0 mt-1 lg:mt-0 text-xs text-gray-500 text-center">
        <p>© 2025 MJ Solution Indonesia</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block w-[350px] lg:h-screen bg-white">
        <div className="px-6 pt-6">
          <div className="flex items-center justify-center">
            <img
              src="/logo/mjs_logo_text.png"
              alt="logo"
              className="w-32 h-auto"
            />
          </div>
        </div>

        <div className="px-5 py-3 space-y-4 max-h-none overflow-y-auto">
          <NavbarContent />
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden">
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
          <div
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing shadow-[0_-6px_6px_-6px_rgba(0,0,0,0.1)]"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-5 pt-5 pb-10 z-50 space-y-6 overflow-y-auto h-full">
            <NavbarContent />
          </div>
        </motion.div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isProductDetailOpen}
        onClose={() => setIsProductDetailOpen(false)}
      />
    </>
  );
};
