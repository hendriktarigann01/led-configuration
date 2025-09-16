import React, { useRef, useState } from "react";
import { X, Edit3 } from "lucide-react";
import { UseNavbarStore } from "../store/UseNavbarStore";

export const DragDropUpload = ({
  onFileSelect,
  maxSize = 3 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { roomImageUrl, setRoomImageUrl } = UseNavbarStore();
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
      setRoomImageUrl(fileUrl);
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
    if (roomImageUrl) {
      URL.revokeObjectURL(roomImageUrl);
    }
    setRoomImageUrl(null);
    onFileSelect(null);
  };

  const handleEditImage = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mt-2 border-2 border-dashed w-full h-36 lg:h-32 transition-colors relative cursor-pointer ${
          isDragOver
            ? "border-[#3AAFA9] bg-teal-50"
            : "border-gray-500 hover:border-gray-500"
        }`}
      >
        {roomImageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={roomImageUrl}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
              onLoad={() => console.log("Image loaded successfully")}
              onError={() => console.log("Image failed to load")}
            />

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex space-x-1 cursor-pointer">
              <button
                onClick={handleRemoveImage}
                className="w-6 h-6 bg-red-500 text-white z-50 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 hover:bg-black/30 duration-200 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100 transition-opacity">
              <div className="text-center">
                <p className="font-medium">Click to change image</p>
                <p className="text-xs mt-1">Adjust position in canvas →</p>
              </div>
            </div>
          </div>
        ) : (
          /* Show upload prompt */
          <div className="flex flex-col justify-center items-center h-full text-center">
            <img
              src="/icons/icon-upload.svg"
              className="h-10"
              alt="upload-icon"
            />
            <p className="text-xs text-gray-700 mt-2">
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
    </div>
  );
};
