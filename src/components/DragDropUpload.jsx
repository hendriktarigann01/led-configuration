import React, { useRef, useState, useEffect } from "react";
import { X, Edit3 } from "lucide-react";
import { UseNavbarStore } from "../store/UseNavbarStore";
import { UseCanvasStore } from "../store/UseCanvasStore";

export const DragDropUpload = ({
  onFileSelect,
  maxSize = 3 * 1024 * 1024,
  acceptedTypes = ["image/jpeg", "image/png"],
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  const {
    roomImageUrl,
    setRoomImageUrl,
    cropSettings,
    setCropSettings,
    selectedContent,
    customImageUrl,
  } = UseNavbarStore();
  const {
    getCabinetCount,
    isConfigured,
    selectedModel,
    wallWidth,
    wallHeight,
  } = UseCanvasStore();

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Cropping state
  const [cropState, setCropState] = useState({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
  });

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
      setOriginalImageUrl(fileUrl);
      setShowCropper(true);
    }
  };

  // Get dynamic canvas dimensions like Canvas.jsx
  const getDynamicCanvasSize = () => {
    const maxWidth =
      window.innerWidth < 768 ? 300 : window.innerWidth < 1024 ? 450 : 550;
    const maxHeight =
      window.innerWidth < 768 ? 180 : window.innerWidth < 1024 ? 250 : 300;

    const wallAspectRatio = wallWidth / wallHeight;

    let canvasW, canvasH;

    if (wallAspectRatio >= 1) {
      canvasW = Math.min(maxWidth, maxWidth);
      canvasH = canvasW / wallAspectRatio;
      if (canvasH > maxHeight) {
        canvasH = maxHeight;
        canvasW = canvasH * wallAspectRatio;
      }
    } else {
      canvasH = Math.min(maxHeight, maxHeight);
      canvasW = canvasH * wallAspectRatio;
      if (canvasW > maxWidth) {
        canvasW = maxWidth;
        canvasH = canvasW / wallAspectRatio;
      }
    }

    return {
      width: Math.round(canvasW),
      height: Math.round(canvasH),
    };
  };

  const dynamicCanvas = getDynamicCanvasSize();

  const loadImage = () => {
    if (!originalImageUrl || !imageRef.current) return;

    imageRef.current.onload = () => {
      const img = imageRef.current;
      const containerWidth = dynamicCanvas.width;
      const containerHeight = dynamicCanvas.height;

      const scaleX = containerWidth / img.naturalWidth;
      const scaleY = containerHeight / img.naturalHeight;
      const initialScale = Math.max(scaleX, scaleY);

      // RESET to initial state - don't use previous crop settings
      setCropState({
        scale: initialScale,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
      });

      drawCanvas();
    };

    imageRef.current.src = originalImageUrl;
  };

  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = dynamicCanvas.width;
    canvas.height = dynamicCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = img.naturalWidth * cropState.scale;
    const scaledHeight = img.naturalHeight * cropState.scale;

    ctx.drawImage(
      img,
      cropState.offsetX,
      cropState.offsetY,
      scaledWidth,
      scaledHeight
    );

    // Draw selection overlay
    ctx.strokeStyle = "#3AAFA9";
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(58, 175, 169, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setCropState((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    }));
  };

  const handleMouseMove = (e) => {
    if (!cropState.isDragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCropState((prev) => ({
      ...prev,
      offsetX: prev.offsetX + (x - prev.dragStart.x),
      offsetY: prev.offsetY + (y - prev.dragStart.y),
      dragStart: { x, y },
    }));
  };

  const handleMouseUp = () => {
    setCropState((prev) => ({ ...prev, isDragging: false }));
  };

  // Fixed wheel event - using passive: false
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.max(0.1, Math.min(5, cropState.scale * delta));

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleDiff = newScale / cropState.scale;
      const newOffsetX = mouseX - (mouseX - cropState.offsetX) * scaleDiff;
      const newOffsetY = mouseY - (mouseY - cropState.offsetY) * scaleDiff;

      setCropState((prev) => ({
        ...prev,
        scale: newScale,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      }));
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [cropState.scale, cropState.offsetX, cropState.offsetY]);

  // Touch events
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      setCropState((prev) => ({
        ...prev,
        isDragging: true,
        dragStart: {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        },
      }));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && cropState.isDragging) {
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      setCropState((prev) => ({
        ...prev,
        offsetX: prev.offsetX + (x - prev.dragStart.x),
        offsetY: prev.offsetY + (y - prev.dragStart.y),
        dragStart: { x, y },
      }));
    }
  };

  const handleTouchEnd = () => {
    setCropState((prev) => ({ ...prev, isDragging: false }));
  };

  // Effects
  useEffect(() => {
    if (showCropper && imageRef.current?.complete) {
      drawCanvas();
    }
  }, [cropState]);

  useEffect(() => {
    if (showCropper && originalImageUrl) {
      setTimeout(loadImage, 100);
    }
  }, [showCropper, originalImageUrl]);

  // Handlers
  const handleCropConfirm = () => {
    if (!canvasRef.current) return;

    setCropSettings({
      scale: cropState.scale,
      offsetX: cropState.offsetX,
      offsetY: cropState.offsetY,
    });

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          setRoomImageUrl(croppedUrl);
          onFileSelect(croppedUrl);
          setShowCropper(false);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    if (!roomImageUrl && originalImageUrl) {
      URL.revokeObjectURL(originalImageUrl);
      setOriginalImageUrl(null);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (roomImageUrl) URL.revokeObjectURL(roomImageUrl);
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    setRoomImageUrl(null);
    setOriginalImageUrl(null);
    setCropSettings(null);
    onFileSelect(null);
  };

  const handleEditImage = (e) => {
    e.stopPropagation();
    if (originalImageUrl) {
      setShowCropper(true);
    } else if (roomImageUrl) {
      setOriginalImageUrl(roomImageUrl);
      setShowCropper(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  // Get LED preview content
  const getLEDContent = () => {
    if (selectedContent === "Custom" && customImageUrl) return customImageUrl;
    if (selectedContent === "Default Video")
      return "/content/video/video-default.mp4";
    if (selectedContent === "Default Image")
      return "/content/image/image-default.jpg";
    return null;
  };

  // LED Screen Overlay
  const LEDOverlay = () => {
    if (!isConfigured() || !selectedModel || selectedContent === "No Content")
      return null;

    const content = getLEDContent();
    if (!content) return null;

    const cabinetCount = getCabinetCount();
    const isVideo = selectedContent === "Default Video";

    return (
      <div className="absolute top-5 right-5 w-32 h-20 border-2 border-white shadow-lg rounded z-50 pointer-events-none">
        {isVideo ? (
          <video
            src={content}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <img
            src={content}
            alt="LED Preview"
            className="w-full h-full object-cover rounded"
          />
        )}

        {/* Bezel grid */}
        <div
          className="absolute inset-0 grid opacity-40"
          style={{
            gridTemplateColumns: `repeat(${cabinetCount.horizontal}, 1fr)`,
            gridTemplateRows: `repeat(${cabinetCount.vertical}, 1fr)`,
          }}
        >
          {Array.from({
            length: cabinetCount.horizontal * cabinetCount.vertical,
          }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-800"
              style={{ borderWidth: "0.5px" }}
            />
          ))}
        </div>

        <div className="absolute -bottom-5 left-0 right-0 text-center">
          <span className="text-xs text-white bg-black bg-opacity-75 px-2 py-1 rounded">
            LED Preview
          </span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Position Your Image</h3>
              <button
                onClick={handleCropCancel}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4 relative">
              <div
                className="mx-auto relative"
                style={{
                  width: `${dynamicCanvas.width}px`,
                  height: `${dynamicCanvas.height}px`,
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={dynamicCanvas.width}
                  height={dynamicCanvas.height}
                  className={`border-2 border-gray-300 ${
                    cropState.isDragging ? "cursor-grabbing" : "cursor-grab"
                  }`}
                  style={{
                    width: `${dynamicCanvas.width}px`,
                    height: `${dynamicCanvas.height}px`,
                    maxWidth: "100%",
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
                <img
                  ref={imageRef}
                  alt="Crop source"
                  style={{ display: "none" }}
                />
                <LEDOverlay />
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>• Use mouse wheel or pinch to zoom</p>
              <p>• Click and drag to move the image</p>
              <p>
                • The green overlay shows your crop area ({dynamicCanvas.width}×
                {dynamicCanvas.height}px)
              </p>
              <p>• LED preview shows how content will appear</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCropCancel}
                className="px-4 py-2 border cursor-pointer border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-4 py-2 cursor-pointer bg-[#3AAFA9] text-white rounded hover:bg-teal-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) handleFileSelect(files[0]);
        }}
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
            />

            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={handleEditImage}
                className="w-6 h-6 bg-blue-500 z-50 cursor-pointer text-white rounded-full flex items-center justify-center hover:bg-blue-600"
                title="Edit position"
              >
                <Edit3 size={12} />
              </button>
              <button
                onClick={handleRemoveImage}
                className="w-6 h-6 bg-red-500 z-50 cursor-pointer text-white rounded-full flex items-center justify-center hover:bg-red-600"
                title="Remove image"
              >
                <X size={12} />
              </button>
            </div>

            <div className="absolute inset-0 hover:bg-black/30 duration-200 flex items-center justify-center text-white text-sm opacity-0 hover:opacity-100">
              <div className="text-center">
                <p className="font-medium">Click to change image</p>
                <p className="text-xs mt-1">Adjust position in canvas →</p>
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
