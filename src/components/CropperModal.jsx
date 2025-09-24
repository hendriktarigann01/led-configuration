import React, { useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { UseCropperStore } from "../store/UseCropperStore";
import { UseCanvasStore } from "../store/UseCanvasStore";

export const CropperModal = () => {
  const {
    isOpen,
    originalImageUrl,
    onComplete,
    cropState,
    closeCropper,
    setCropState,
    updateCropState,
  } = UseCropperStore();

  const { wallWidth, wallHeight } = UseCanvasStore();

  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const modalRef = useRef(null);

  // Get dynamic canvas dimensions
  const getDynamicCanvasSize = () => {
    const maxWidth =
      window.innerWidth < 768 ? 280 : window.innerWidth < 1024 ? 450 : 550;
    const maxHeight =
      window.innerWidth < 768 ? 200 : window.innerWidth < 1024 ? 280 : 320;
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

    return { width: Math.round(canvasW), height: Math.round(canvasH) };
  };

  const dynamicCanvas = getDynamicCanvasSize();

  // Initialize image and crop state
  const initializeImage = () => {
    if (!originalImageUrl || !imageRef.current) return;

    imageRef.current.onload = () => {
      const img = imageRef.current;
      const containerWidth = dynamicCanvas.width;
      const containerHeight = dynamicCanvas.height;

      const scaleX = containerWidth / img.naturalWidth;
      const scaleY = containerHeight / img.naturalHeight;
      const initialScale = Math.max(scaleX, scaleY);

      setCropState({
        scale: initialScale,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
      });
    };

    imageRef.current.src = originalImageUrl;
  };

  // Canvas drawing
  const drawCanvas = () => {
    if (!canvasRef.current || !imageRef.current || !imageRef.current.complete)
      return;

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

  // Get touch position relative to canvas
  const getTouchPosition = (touch) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  // Event handlers - Mouse
  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    updateCropState((prev) => ({
      ...prev,
      isDragging: true,
      dragStart: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    }));
  };

  const handleMouseMove = (e) => {
    if (!cropState.isDragging) return;
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    updateCropState((prev) => ({
      ...prev,
      offsetX: prev.offsetX + (x - prev.dragStart.x),
      offsetY: prev.offsetY + (y - prev.dragStart.y),
      dragStart: { x, y },
    }));
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    updateCropState((prev) => ({ ...prev, isDragging: false }));
  };

  // Event handlers - Touch
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = getTouchPosition(e.touches[0]);
      updateCropState((prev) => ({
        ...prev,
        isDragging: true,
        dragStart: touch,
      }));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && cropState.isDragging) {
      e.preventDefault();
      e.stopPropagation();
      const touch = getTouchPosition(e.touches[0]);

      updateCropState((prev) => ({
        ...prev,
        offsetX: prev.offsetX + (touch.x - prev.dragStart.x),
        offsetY: prev.offsetY + (touch.y - prev.dragStart.y),
        dragStart: touch,
      }));
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateCropState((prev) => ({ ...prev, isDragging: false }));
  };

  // Zoom controls
  const handleZoomChange = (newScale) => {
    const centerX = dynamicCanvas.width / 2;
    const centerY = dynamicCanvas.height / 2;

    const scaleDiff = newScale / cropState.scale;
    const newOffsetX = centerX - (centerX - cropState.offsetX) * scaleDiff;
    const newOffsetY = centerY - (centerY - cropState.offsetY) * scaleDiff;

    setCropState({
      ...cropState,
      scale: newScale,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    });
  };

  const zoomIn = () => {
    const newScale = Math.min(5, cropState.scale * 1.2);
    handleZoomChange(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(0.1, cropState.scale * 0.8);
    handleZoomChange(newScale);
  };

  // Action handlers
  const handleCropConfirm = () => {
    if (!canvasRef.current || !onComplete) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          onComplete(croppedUrl);
          closeCropper();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleCropCancel = () => {
    closeCropper();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCropCancel();
    }
  };

  // Effects
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          handleCropCancel();
        }
      };
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [cropState, isOpen, dynamicCanvas]);

  useEffect(() => {
    if (isOpen && originalImageUrl) {
      setTimeout(initializeImage, 100);
    }
  }, [isOpen, originalImageUrl]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      style={{ touchAction: "none" }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Position Your Image
          </h3>
          <button
            onClick={handleCropCancel}
            className="text-gray-500 hover:text-gray-700 p-1"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {/* Canvas Container */}
          <div className="mb-4 flex justify-center">
            <div
              className="relative border-2 border-gray-200 rounded"
              style={{
                width: `${dynamicCanvas.width}px`,
                height: `${dynamicCanvas.height}px`,
              }}
            >
              <canvas
                ref={canvasRef}
                width={dynamicCanvas.width}
                height={dynamicCanvas.height}
                className={`w-full h-full touch-none select-none ${
                  cropState.isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: "none" }}
              />
              <img
                ref={imageRef}
                alt="Crop source"
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center gap-3 h-auto lg:h-7">
              <button
                type="button"
                onClick={zoomOut}
                className="flex-shrink-0 p-2 border border-gray-300 rounded hover:bg-gray-50"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>

              <div className="flex-1 px-2">
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={cropState.scale}
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3AAFA9 0%, #3AAFA9 ${
                      ((cropState.scale - 0.1) / 4.9) * 100
                    }%, #d1d5db ${
                      ((cropState.scale - 0.1) / 4.9) * 100
                    }%, #d1d5db 100%)`,
                    touchAction: "manipulation",
                  }}
                />
              </div>

              <button
                type="button"
                onClick={zoomIn}
                className="flex-shrink-0 p-2 border border-gray-300 rounded hover:bg-gray-50"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 mb-4 space-y-1 p-3 bg-gray-50 rounded">
            <p>
              <strong>How to use:</strong>
            </p>
            <p>• Use the slider above to zoom in/out</p>
            <p>• Drag the image to position it</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCropCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCropConfirm}
              className="px-4 py-2 bg-[#3AAFA9] text-white rounded hover:bg-teal-600"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3aafa9;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3aafa9;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};
