import React, { useRef, useState } from "react";
import { X, Edit3 } from "lucide-react";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseCropperStore } from "../store/UseCropperStore";

export const DragDropUpload = ({
  onFileSelect,
  maxSize = 3 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const { roomImageUrl, setRoomImageUrl } = UseNavbarStore();
  const { openCropper } = UseCropperStore();

  const fileInputRef = useRef(null);

  // File validation
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

      // Open cropper with callback to handle the result
      openCropper(fileUrl, (croppedUrl) => {
        setRoomImageUrl(croppedUrl);
        onFileSelect(croppedUrl);
        // Clean up the original file URL
        URL.revokeObjectURL(fileUrl);
      });
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (roomImageUrl) {
      URL.revokeObjectURL(roomImageUrl);
      setRoomImageUrl(null);
      onFileSelect(null);
    }
  };

  const handleEditImage = (e) => {
    e.stopPropagation();
    if (roomImageUrl) {
      // Open cropper with existing image
      openCropper(roomImageUrl, (croppedUrl) => {
        setRoomImageUrl(croppedUrl);
        onFileSelect(croppedUrl);
      });
    } else {
      // No image exists, trigger file select
      fileInputRef.current?.click();
    }
  };

  const handleDragEvents = {
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setIsDragOver(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) handleFileSelect(files[0]);
    },
  };

  return (
    <div>
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`mt-2 border-2 border-dashed w-full h-36 lg:h-32 transition-colors relative cursor-pointer ${
          isDragOver
            ? "border-[#3AAFA9] bg-teal-50"
            : "border-gray-500 hover:border-gray-500"
        }`}
        {...handleDragEvents}
      >
        {roomImageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={roomImageUrl}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                type="button"
                onClick={handleEditImage}
                className="w-6 h-6 bg-blue-500 z-50 text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                title="Edit position"
              >
                <Edit3 size={12} />
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-6 h-6 bg-red-500 z-50 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>

            <div className="absolute inset-0 hover:bg-black/30 duration-200 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100">
              <div className="text-center">
                <p className="font-medium">Click to change image</p>
              </div>
            </div>
          </div>
        ) : (
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
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) handleFileSelect(file);
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};
