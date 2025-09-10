export const CanvasUtils = {
  // Calculate canvas dimensions based on wall size
  getCanvasDimensions: (
    wallWidth,
    wallHeight,
    containerWidth = 550,
    containerHeight = 300
  ) => {
    const maxWallWidth = 10;
    const maxWallHeight = 5.5;

    const wallScaleX = Math.min(1, wallWidth / maxWallWidth);
    const wallScaleY = Math.min(1, wallHeight / maxWallHeight);

    const effectiveCanvasWidth = containerWidth * wallScaleX;
    const effectiveCanvasHeight = containerHeight * wallScaleY;

    return { effectiveCanvasWidth, effectiveCanvasHeight };
  },

  // Calculate image dimensions based on screen to wall ratio
  getImageDimensions: (
    actualScreenSize,
    wallWidth,
    wallHeight,
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => {
    const screenToWallRatioX = actualScreenSize.width / wallWidth;
    const screenToWallRatioY = actualScreenSize.height / wallHeight;

    const imageWidth = Math.min(
      effectiveCanvasWidth * screenToWallRatioX,
      effectiveCanvasWidth * 1.5
    );
    const imageHeight = Math.min(
      effectiveCanvasHeight * screenToWallRatioY,
      effectiveCanvasHeight * 1.5
    );

    return { imageWidth, imageHeight };
  },

  // Calculate measurement values for display
  getMeasurementValues: (
    actualScreenSize,
    wallWidth,
    wallHeight,
    imageWidth,
    imageHeight,
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => {
    const horizontalMeasureLength = Math.min(imageWidth, effectiveCanvasWidth);
    const verticalMeasureLength = Math.min(imageHeight, effectiveCanvasHeight);

    const remainingWallHeight = (wallHeight - actualScreenSize.height) / 2;
    const remainingWallWidth = (wallWidth - actualScreenSize.width) / 2;

    return {
      horizontalMeasureLength,
      verticalMeasureLength,
      remainingWallHeight,
      remainingWallWidth,
    };
  },

  // Calculate human dimensions for scale reference
  getHumanDimensions: (wallHeight, baseCanvasHeight = 300) => {
    const humanRealHeight = 1.7; // 170 cm in meters
    const humanToWallRatio = humanRealHeight / wallHeight;
    const humanDisplayHeight = baseCanvasHeight * humanToWallRatio;
    const minHumanHeight = 8; // minimum 8px for very tall walls
    const finalHumanHeight = Math.max(minHumanHeight, humanDisplayHeight);

    return { finalHumanHeight, humanToWallRatio };
  },

  // Get content source based on selected content
  getContentSource: (selectedContent, customImageUrl) => {
    switch (selectedContent) {
      case "Default Image":
        return "/canvas/canvas-bg.webp";
      case "Default Video":
        return "/canvas/canvas-bg-video.mp4";
      case "No Content":
        return "/canvas/no-content.png";
      case "Custom":
        return customImageUrl || "/canvas/canvas-bg.webp";
      default:
        return "/canvas/canvas-bg.webp";
    }
  },

  // Render measurement lines component
  renderMeasurementLines: (horizontalMeasureLength, verticalMeasureLength) => {
    const transformValues = {
      verticalRight: "translateX(80%) translateY(-100%)",
      verticalLeft: "translateX(-80%) translateY(-100%)",
      horizontalTop: "translateY(100%) translateX(-100%)",
      horizontalBottom: "translateY(100%) translateX(-100%)",
    };

    return (
      <>
        {/* Vertical Right Measure */}
        <div
          className="absolute top-0 right-[1px] border-l border-dashed z-10 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.verticalRight,
            height: `${verticalMeasureLength + 180}px`,
          }}
        />

        {/* Vertical Left Measure */}
        <div
          className="absolute top-0 left-[1px] border-l border-dashed z-10 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.verticalLeft,
            height: `${verticalMeasureLength + 180}px`,
          }}
        />

        {/* Horizontal Top Measure */}
        <div
          className="absolute top-0 left-0 border-t border-dashed z-10 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.horizontalTop,
            width: `${horizontalMeasureLength + 250}px`,
          }}
        />

        {/* Horizontal Bottom Measure */}
        <div
          className="absolute bottom-0 left-0 border-t border-dashed z-10 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.horizontalBottom,
            width: `${horizontalMeasureLength + 250}px`,
          }}
        />
      </>
    );
  },

  // Render bezel overlay for multi-cabinet displays
  renderBezelOverlay: (cabinetCount) => {
    if (cabinetCount.horizontal <= 1 && cabinetCount.vertical <= 1) return null;

    return (
      <div className="absolute inset-0 z-30 pointer-events-none border-1 border-[#D9D9D9]/40">
        {/* Vertical bezel lines */}
        {cabinetCount.horizontal > 1 &&
          Array.from({ length: cabinetCount.horizontal - 1 }, (_, i) => (
            <div
              key={`vertical-${i}`}
              className="absolute top-0 bottom-0 border-l-1 border-[#D9D9D9]/40"
              style={{
                left: `${((i + 1) / cabinetCount.horizontal) * 100}%`,
              }}
            />
          ))}

        {/* Horizontal bezel lines */}
        {cabinetCount.vertical > 1 &&
          Array.from({ length: cabinetCount.vertical - 1 }, (_, i) => (
            <div
              key={`horizontal-${i}`}
              className="absolute left-0 right-0 border-t-1 border-[#D9D9D9]/40"
              style={{
                top: `${((i + 1) / cabinetCount.vertical) * 100}%`,
              }}
            />
          ))}
      </div>
    );
  },

  // Render canvas to wall measurements
  renderCanvasToWallMeasurements: (
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => (
    <>
      {/* Horizontal Bottom Measure Canvas to Wall */}
      <div
        className="absolute z-10 left-0 border-t border-dashed border-teal-400 pointer-events-none"
        style={{
          bottom: "36px",
          transform: "translateX(-75%) translateY(100%)",
          width: `${effectiveCanvasWidth + 100}px`,
        }}
      />

      {/* Vertical Right Measure Canvas to Wall */}
      <div
        className="absolute z-10 top-0 border-l border-dashed border-teal-400 pointer-events-none"
        style={{
          right: "52px",
          transform: "translateX(100%) translateY(-75%)",
          height: `${effectiveCanvasHeight + 100}px`,
        }}
      />
    </>
  ),

  // Render wall measurements with centered values
  renderWallMeasurements: (remainingWallHeight, remainingWallWidth) => (
    <>
      {/* Height measurements - Left Side */}
      <div className="absolute left-4 top-[25%] -translate-y-1/2 flex flex-col items-center justify-center z-50">
        <span
          className="text-xs text-gray-700 text-center"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {remainingWallHeight.toFixed(2)} m
        </span>
      </div>

      <div className="absolute left-4 top-[75%] -translate-y-1/2 flex flex-col items-center justify-center z-50">
        <span
          className="text-xs text-gray-700 text-center"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {remainingWallHeight.toFixed(2)} m
        </span>
      </div>

      {/* Width measurements - Top */}
      <div className="absolute top-2 lg:top-0 left-[25%] -translate-x-1/2 flex flex-col items-center justify-center z-50">
        <span className="text-xs text-gray-700 text-center">
          {remainingWallWidth.toFixed(2)} m
        </span>
      </div>

      <div className="absolute top-2 lg:top-0 right-[25%] translate-x-1/2 flex flex-col items-center justify-center z-50">
        <span className="text-xs text-gray-700 text-center">
          {remainingWallWidth.toFixed(2)} m
        </span>
      </div>
    </>
  ),

  // Render info displays (resolution and human height)
  renderInfoDisplays: (resolutionString, humanHeight = "170 cm") => (
    <>
      {/* Resolution Info Display */}
      <div className="absolute bottom-1 left-13 flex flex-col items-start justify-center z-50">
        <span className="text-xs text-gray-700">
          Resolution: {resolutionString}
        </span>
      </div>

      {/* Human Info Height */}
      <div className="absolute bottom-1 right-1 flex flex-col items-start justify-center z-50">
        <span className="text-xs text-gray-700">{humanHeight}</span>
      </div>
    </>
  ),

  // Render human silhouette
  renderHumanSilhouette: (finalHumanHeight, humanToWallRatio) => (
    <div
      className="absolute -right-22 bottom-8 z-50"
      style={{
        width: "150px",
        height: "auto",
        alignItems: "flex-end",
      }}
    >
      <div className="relative flex flex-col">
        <img
          src="/human.webp"
          alt={`Human Scale Reference (1.7m) - ${(
            humanToWallRatio * 100
          ).toFixed(1)}% of wall`}
          style={{
            height: `${finalHumanHeight}px`,
            width: "auto",
            objectFit: "contain",
            maxWidth: "80px",
          }}
        />
      </div>
    </div>
  ),
};
