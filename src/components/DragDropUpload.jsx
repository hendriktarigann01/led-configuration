import React, { useRef, useState } from "react";

export const DragDropUpload = ({
  onFileSelect,
  maxSize = 3 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
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

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-2 border-2 border-dashed h-40 cursor-pointer transition-colors ${
        isDragOver
          ? "border-[#3AAFA9] bg-teal-50"
          : "border-gray-600 hover:border-gray-700"
      }`}
    >
      <div className="flex flex-col justify-center items-center h-full text-center">
        <img src="/icons/icon-upload.svg" alt="upload-icon" />
        <p className="text-sm text-gray-700 mt-2">
          Drag and Drop file here or choose file
        </p>
      </div>

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
