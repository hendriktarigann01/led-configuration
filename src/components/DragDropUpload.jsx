import React, { useRef, useState } from "react";
import { X } from "lucide-react";

export const DragDropUpload = ({
  onFileSelect,
  maxSize = 3 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      alert("Please select a JPG or PNG file only.");
      return false;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 3MB.");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
      onFileSelect(fileUrl);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = "";
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
    onFileSelect(null);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-2 border-2 border-dashed h-40 cursor-pointer transition-colors relative overflow-hidden ${
        isDragOver
          ? "border-[#3AAFA9] bg-teal-50"
          : "border-gray-500 hover:border-gray-500"
      }`}
    >
      {previewImage ? (
        /* Show uploaded image */
        <div className="relative w-full h-full">
          <img
            src={previewImage}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          {/* Remove button */}
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 z-50 w-6 h-6 border border-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-100 transition-colors text-xs font-bold"
          >
            <X size={12} />
          </button>
          {/* Overlay text */}
          <div className="absolute inset-0  hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <p className="text-white text-sm opacity-0 hover:opacity-100 transition-opacity">
              Click to change image
            </p>
          </div>
        </div>
      ) : (
        /* Show upload prompt */
        <div className="flex flex-col justify-center items-center h-full text-center">
          <img src="/icons/icon-upload.svg" alt="upload-icon" />
          <p className="text-sm text-gray-500 mt-2">
            Drag and Drop file here or choose file
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};
