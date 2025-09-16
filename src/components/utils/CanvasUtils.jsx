export const CanvasUtils = {
  // Helper to detect device type based on window size
  getDeviceType: () => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  },

  // Get responsive container dimensions based on device
  getResponsiveContainerDimensions: () => {
    const deviceType = CanvasUtils.getDeviceType();

    switch (deviceType) {
      case "mobile":
        return { containerWidth: 300, containerHeight: 180 };
      case "tablet":
        return { containerWidth: 450, containerHeight: 250 };
      default: // desktop
        return { containerWidth: 550, containerHeight: 300 };
    }
  },

  // Calculate canvas dimensions based on wall size with responsive containers
  getCanvasDimensions: (wallWidth, wallHeight) => {
    const { containerWidth, containerHeight } =
      CanvasUtils.getResponsiveContainerDimensions();
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

  // Calculate human dimensions for scale reference with responsive sizing
  getHumanDimensions: (wallHeight) => {
    const deviceType = CanvasUtils.getDeviceType();
    const humanRealHeight = 1.7;
    const humanToWallRatio = humanRealHeight / wallHeight;

    // Different base canvas heights for different devices
    let baseCanvasHeight;
    switch (deviceType) {
      case "mobile":
        baseCanvasHeight = 180;
        break;
      case "tablet":
        baseCanvasHeight = 250;
        break;
      default: // desktop
        baseCanvasHeight = 300;
    }

    const humanDisplayHeight = baseCanvasHeight * humanToWallRatio;

    // Different minimum heights for different devices
    let minHumanHeight;
    switch (deviceType) {
      case "mobile":
        minHumanHeight = 6; // minimum 6px for mobile
        break;
      case "tablet":
        minHumanHeight = 7; // minimum 7px for tablet
        break;
      default: // desktop
        minHumanHeight = 8; // minimum 8px for desktop
    }

    const finalHumanHeight = Math.max(minHumanHeight, humanDisplayHeight);

    return { finalHumanHeight, humanToWallRatio };
  },

  // Get content source based on selected content
  getContentSource: (selectedContent, customImageUrl) => {
    switch (selectedContent) {
      case "Default Image":
        return "/canvas/canvas-bg.png";
      case "Default Video":
        return "/canvas/BumperMJSolution.mp4";
      case "No Content":
        return "/canvas/no-content.png";
      case "Custom":
        return customImageUrl || "/canvas/canvas-bg.png";
      default:
        return "/canvas/canvas-bg.png";
    }
  },

  // Render measurement lines component with responsive adjustments
  renderMeasurementLines: (horizontalMeasureLength, verticalMeasureLength) => {
    const deviceType = CanvasUtils.getDeviceType();

    // Adjust measurement line extensions based on device
    let verticalExtension, horizontalExtension;
    switch (deviceType) {
      case "mobile":
        verticalExtension = 120;
        horizontalExtension = 150;
        break;
      case "tablet":
        verticalExtension = 150;
        horizontalExtension = 200;
        break;
      default: // desktop
        verticalExtension = 180;
        horizontalExtension = 250;
    }

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
          className="absolute top-0 right-[1px] border-l border-dashed z-50 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.verticalRight,
            height: `${verticalMeasureLength + verticalExtension}px`,
          }}
        />

        {/* Vertical Left Measure */}
        <div
          className="absolute top-0 left-[1px] border-l border-dashed z-50 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.verticalLeft,
            height: `${verticalMeasureLength + verticalExtension}px`,
          }}
        />

        {/* Horizontal Top Measure */}
        <div
          className="absolute top-0 left-0 border-t border-dashed z-50 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.horizontalTop,
            width: `${horizontalMeasureLength + horizontalExtension}px`,
          }}
        />

        {/* Horizontal Bottom Measure */}
        <div
          className="absolute bottom-[1px] left-0 border-t border-dashed z-50 border-teal-400 pointer-events-none"
          style={{
            transform: transformValues.horizontalBottom,
            width: `${horizontalMeasureLength + horizontalExtension}px`,
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

  // Render canvas to wall measurements with responsive adjustments
  renderCanvasToWallMeasurements: (
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => {
    const deviceType = CanvasUtils.getDeviceType();

    // Adjust extensions based on device
    let horizontalExtension, verticalExtension;
    switch (deviceType) {
      case "mobile":
        horizontalExtension = 60;
        verticalExtension = 60;
        break;
      case "tablet":
        horizontalExtension = 80;
        verticalExtension = 80;
        break;
      default: // desktop
        horizontalExtension = 100;
        verticalExtension = 100;
    }

    return (
      <>
        {/* Horizontal Bottom Measure Screen */}
        <div
          className="absolute z-10 left-0 border-t border-dashed border-teal-400 pointer-events-none"
          style={{
            bottom:
              deviceType === "mobile"
                ? "36px"
                : deviceType === "tablet"
                ? "36px"
                : "51px",
            transform: "translateX(-75%) translateY(100%)",
            width: `${effectiveCanvasWidth + horizontalExtension}px`,
          }}
        />

        {/* Horizontal Top Measure Screen */}
        <div
          className="absolute z-10 left-0 border-t border-dashed border-teal-400 pointer-events-none"
          style={{
            top:
              deviceType === "mobile"
                ? "36px"
                : deviceType === "tablet"
                ? "36px"
                : "50px",
            transform: "translateX(-75%) translateY(100%)",
            width: `${effectiveCanvasWidth + horizontalExtension}px`,
          }}
        />

        {/* Vertical Right Measure Screen */}
        <div
          className="absolute z-10 top-0 border-l border-dashed border-teal-400 pointer-events-none"
          style={{
            right:
              deviceType === "mobile"
                ? "50px"
                : deviceType === "tablet"
                ? "52px"
                : "52px",
            transform: "translateX(100%) translateY(-75%)",
            height: `${effectiveCanvasHeight + verticalExtension}px`,
          }}
        />

        {/* Vertical Left Measure Screen */}
        <div
          className="absolute z-10 top-0 border-l border-dashed border-teal-400 pointer-events-none"
          style={{
            left:
              deviceType === "mobile"
                ? "50px"
                : deviceType === "tablet"
                ? "52px"
                : "50px",
            transform: "translateX(100%) translateY(-75%)",
            height: `${effectiveCanvasHeight + verticalExtension}px`,
          }}
        />
      </>
    );
  },

  // Render wall measurements with centered values and responsive positioning
  renderWallMeasurements: (remainingWallHeight, remainingWallWidth) => {
    const deviceType = CanvasUtils.getDeviceType();

    // Adjust positioning based on device
    const leftOffset = deviceType === "mobile" ? "left-2" : "left-4";
    const topOffset =
      deviceType === "mobile"
        ? "top-1"
        : deviceType === "tablet"
        ? "top-1.5"
        : "top-2 lg:top-2";

    return (
      <>
        {/* Height measurements - Left Side */}
        <div
          className={`absolute ${leftOffset} top-[25%] -translate-y-1/2 flex flex-col items-center justify-center z-50`}
        >
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

        <div
          className={`absolute ${leftOffset} top-[75%] -translate-y-1/2 flex flex-col items-center justify-center z-50`}
        >
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

        {/* Width measurements - Top Left */}

        <div
          className={`absolute ${topOffset} left-[25%] -translate-x-1/2 flex flex-col items-center justify-center z-50`}
        >
          <span className="text-xs text-gray-700 text-center">
            {remainingWallWidth.toFixed(2)} m
          </span>
        </div>

        {/* Width measurements - Top Right */}
        <div
          className={`absolute ${topOffset} right-[25%] translate-x-1/2 flex flex-col items-center justify-center z-50`}
        >
          <span className="text-xs text-gray-700 text-center">
            {remainingWallWidth.toFixed(2)} m
          </span>
        </div>
      </>
    );
  },

  // Render info displays with responsive positioning
  renderInfoDisplays: (resolutionString, humanHeight = "1,70 m") => {
    const deviceType = CanvasUtils.getDeviceType();

    // Adjust positioning and spacing based on device
    const leftPosition = deviceType === "mobile" ? "left-1" : "left-13";
    const rightPosition = deviceType === "mobile" ? "right-0" : "right-1";
    const bottomPosition = deviceType === "mobile" ? "bottom-0.5" : "bottom-1";

    return (
      <>
        {/* Resolution Info Display */}
        <div
          className={`absolute ${bottomPosition} ${leftPosition} flex flex-col items-start justify-center z-50`}
        >
          <span className="text-xs text-gray-700">
            Resolution: {resolutionString}
          </span>
        </div>

        {/* Human Info Height */}
        <div
          className={`absolute ${bottomPosition} ${rightPosition} flex flex-col items-start justify-center z-50`}
        >
          <span className="text-xs text-gray-700">{humanHeight}</span>
        </div>
      </>
    );
  },

  // Render human silhouette with responsive positioning and sizing
  renderHumanSilhouette: (finalHumanHeight, humanToWallRatio) => {
    const deviceType = CanvasUtils.getDeviceType();

    // Adjust positioning and max width based on device
    let rightPosition, bottomPosition, maxWidth;
    switch (deviceType) {
      case "mobile":
        rightPosition = "-right-27";
        bottomPosition = "bottom-8";
        maxWidth = "50px";
        break;
      case "tablet":
        rightPosition = "-right-24";
        bottomPosition = "bottom-8";
        maxWidth = "65px";
        break;
      default: // desktop
        rightPosition = "-right-22";
        bottomPosition = "bottom-8";
        maxWidth = "80px";
    }

    return (
      <div
        className={`absolute ${rightPosition} ${bottomPosition} z-50`}
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
              width: "100%",
              objectFit: "contain",
              maxWidth: maxWidth,
            }}
          />
        </div>
      </div>
    );
  },
};
