export const CanvasUtils = {
  getDeviceType: () => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  },

  getResponsiveContainerDimensions: () => {
    const deviceType = CanvasUtils.getDeviceType();
    const dimensions = {
      mobile: { containerWidth: 230, containerHeight: 138 },
      tablet: { containerWidth: 450, containerHeight: 250 },
      desktop: { containerWidth: 550, containerHeight: 300 },
    };
    return dimensions[deviceType] || dimensions.desktop;
  },

  getCanvasDimensions: (wallWidth, wallHeight) => {
    const { containerWidth, containerHeight } =
      CanvasUtils.getResponsiveContainerDimensions();
    const maxWallWidth = 10;
    const maxWallHeight = 5.5;

    const wallScaleX = Math.min(1, wallWidth / maxWallWidth);
    const wallScaleY = Math.min(1, wallHeight / maxWallHeight);

    return {
      effectiveCanvasWidth: containerWidth * wallScaleX,
      effectiveCanvasHeight: containerHeight * wallScaleY,
    };
  },

  getImageDimensions: (
    actualScreenSize,
    wallWidth,
    wallHeight,
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => {
    const screenToWallRatioX = actualScreenSize.width / wallWidth;
    const screenToWallRatioY = actualScreenSize.height / wallHeight;

    const idealImageWidth = effectiveCanvasWidth * screenToWallRatioX;
    const idealImageHeight = effectiveCanvasHeight * screenToWallRatioY;

    const safetyMargin = 0.95;
    const maxAllowedWidth = effectiveCanvasWidth * safetyMargin;
    const maxAllowedHeight = effectiveCanvasHeight * safetyMargin;

    let imageWidth = Math.min(idealImageWidth, maxAllowedWidth);
    let imageHeight = Math.min(idealImageHeight, maxAllowedHeight);

    const screenAspectRatio = actualScreenSize.width / actualScreenSize.height;

    if (imageWidth >= maxAllowedWidth) {
      imageHeight = Math.min(imageWidth / screenAspectRatio, maxAllowedHeight);
    }

    if (imageHeight >= maxAllowedHeight) {
      imageWidth = Math.min(imageHeight * screenAspectRatio, maxAllowedWidth);
    }

    const minSize = 20;
    imageWidth = Math.max(imageWidth, minSize);
    imageHeight = Math.max(imageHeight, minSize);

    return { imageWidth, imageHeight };
  },

  getMeasurementValues: (
    actualScreenSize,
    wallWidth,
    wallHeight,
    imageWidth,
    imageHeight,
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => ({
    horizontalMeasureLength: Math.min(imageWidth, effectiveCanvasWidth),
    verticalMeasureLength: Math.min(imageHeight, effectiveCanvasHeight),
    remainingWallHeight: (wallHeight - actualScreenSize.height) / 2,
    remainingWallWidth: (wallWidth - actualScreenSize.width) / 2,
  }),

  getHumanDimensions: (wallHeight, canvasHeight) => {
    const deviceType = CanvasUtils.getDeviceType();
    const humanRealHeight = 1.7; // Selalu 1.7m dalam dunia nyata
    const humanToWallRatio = humanRealHeight / wallHeight;

    const config = {
      mobile: { minHumanHeight: 6 },
      tablet: { minHumanHeight: 7 },
      desktop: { minHumanHeight: 8 },
    };

    const { minHumanHeight } = config[deviceType] || config.desktop;

    // Hitung tinggi human berdasarkan proporsi ke canvas
    const humanDisplayHeight = canvasHeight * humanToWallRatio;

    // Pastikan minimal terlihat, tapi tidak ada batas maksimal
    const finalHumanHeight = Math.max(minHumanHeight, humanDisplayHeight);

    return { finalHumanHeight, humanToWallRatio };
  },

  getContentSource: (selectedContent, customImageUrl) => {
    const sources = {
      "Default Image": "/canvas/canvas-bg.png",
      "Default Video": "/canvas/BumperMJSolution.mp4",
      "No Content": "/canvas/no-content.png",
      Custom: customImageUrl || "/canvas/canvas-bg.png",
    };
    return sources[selectedContent] || sources["Default Image"];
  },

  renderMeasurementLines: (horizontalMeasureLength, verticalMeasureLength) => {
    const deviceType = CanvasUtils.getDeviceType();

    const extensions = {
      mobile: { vertical: 120, horizontal: 150 },
      tablet: { vertical: 150, horizontal: 200 },
      desktop: { vertical: 180, horizontal: 250 },
    };

    const { vertical: verticalExtension, horizontal: horizontalExtension } =
      extensions[deviceType] || extensions.desktop;

    const lineStyle =
      "absolute border-dashed z-50 border-teal-400 pointer-events-none";

    return (
      <>
        <div
          className={`${lineStyle} top-0 right-[1px] border-l`}
          style={{
            transform: "translateX(80%) translateY(-100%)",
            height: `${(verticalMeasureLength + verticalExtension) * 2}px`,
          }}
        />
        <div
          className={`${lineStyle} top-0 left-[0px] border-l`}
          style={{
            transform: "translateX(-80%) translateY(-100%)",
            height: `${(verticalMeasureLength + verticalExtension) * 2}px`,
          }}
        />
        <div
          className={`${lineStyle} top-0 left-0 border-t`}
          style={{
            transform: "translateY(100%) translateX(-100%)",
            width: `${(horizontalMeasureLength + horizontalExtension) * 2}px`,
          }}
        />
        <div
          className={`${lineStyle} bottom-[1px] left-0 border-t`}
          style={{
            transform: "translateY(100%) translateX(-100%)",
            width: `${(horizontalMeasureLength + horizontalExtension) * 2}px`,
          }}
        />
      </>
    );
  },

  renderBezelOverlay: (cabinetCount) => {
    if (cabinetCount.horizontal <= 1 && cabinetCount.vertical <= 1) return null;

    return (
      <div className="absolute inset-0 z-30 pointer-events-none border-1 border-[#D9D9D9]/40">
        {cabinetCount.horizontal > 1 &&
          Array.from({ length: cabinetCount.horizontal - 1 }, (_, i) => (
            <div
              key={`vertical-${i}`}
              className="absolute top-0 bottom-0 border-l-1 border-[#D9D9D9]/40"
              style={{ left: `${((i + 1) / cabinetCount.horizontal) * 100}%` }}
            />
          ))}

        {cabinetCount.vertical > 1 &&
          Array.from({ length: cabinetCount.vertical - 1 }, (_, i) => (
            <div
              key={`horizontal-${i}`}
              className="absolute left-0 right-0 border-t-1 border-[#D9D9D9]/40"
              style={{ top: `${((i + 1) / cabinetCount.vertical) * 100}%` }}
            />
          ))}
      </div>
    );
  },

  renderCanvasToWallMeasurements: (
    effectiveCanvasWidth,
    effectiveCanvasHeight
  ) => {
    const deviceType = CanvasUtils.getDeviceType();

    const extensions = {
      mobile: { horizontal: 100, vertical: 100 },
      tablet: { horizontal: 80, vertical: 80 },
      desktop: { horizontal: 100, vertical: 100 },
    };

    const { horizontal: horizontalExtension, vertical: verticalExtension } =
      extensions[deviceType] || extensions.desktop;

    const baseOffset = {
      mobile: 48,
      tablet: 50,
      desktop: 50,
    };

    const dynamicOffset =
      (baseOffset[deviceType] || baseOffset.desktop) + effectiveCanvasWidth;

    const lineStyle =
      "absolute z-10 border-dashed border-teal-400 pointer-events-none";

    return (
      <>
        <div
          className={`${lineStyle} left-0 border-t`}
          style={{
            bottom: "51px",
            transform: "translateX(-75%) translateY(100%)",
            width: `${effectiveCanvasWidth + horizontalExtension}px`,
          }}
        />
        <div
          className={`${lineStyle} left-0 border-t`}
          style={{
            top: "50px",
            transform: "translateX(-75%) translateY(100%)",
            width: `${effectiveCanvasWidth + horizontalExtension}px`,
          }}
        />
        <div
          className={`${lineStyle} top-0 border-l`}
          style={{
            right: `${dynamicOffset}px`,
            transform: "translateX(100%) translateY(-75%)",
            height: `${effectiveCanvasHeight + verticalExtension}px`,
          }}
        />
        <div
          className={`${lineStyle} top-0 border-l`}
          style={{
            left: `${dynamicOffset}px`,
            transform: "translateX(-100%) translateY(-75%)",
            height: `${effectiveCanvasHeight + verticalExtension}px`,
          }}
        />
      </>
    );
  },

  renderWallMeasurements: (
    dynamicRemainingWall,
    actualScreenSize,
    wallWidth,
    wallHeight,
    screenPosition,
    dynamicCanvas
  ) => {
    const deviceType = CanvasUtils.getDeviceType();

    const margins = {
      mobile: { horizontal: 22, vertical: 18 },
      tablet: { horizontal: 17, vertical: 11 },
      desktop: { horizontal: 16, vertical: 12 },
    };

    const { horizontal: textMarginHorizontal, vertical: textMarginVertical } =
      margins[deviceType] || margins.desktop;

    // Calculate screen position in percentage of canvas
    const screenOffsetXPercent = (screenPosition.x / dynamicCanvas.width) * 100;
    const screenOffsetYPercent =
      (screenPosition.y / dynamicCanvas.height) * 100;

    // Calculate screen size as percentage of canvas
    const pixelToMeterRatioX = dynamicCanvas.width / wallWidth;
    const pixelToMeterRatioY = dynamicCanvas.height / wallHeight;

    const screenWidthPercent =
      ((actualScreenSize.width * pixelToMeterRatioX) / dynamicCanvas.width) *
      100;
    const screenHeightPercent =
      ((actualScreenSize.height * pixelToMeterRatioY) / dynamicCanvas.height) *
      100;

    // ===== CALCULATE BASE POSITIONS (WHEN CENTERED) =====

    // LEFT: Base position when centered
    const leftScreenEdgeBase = 60 - screenWidthPercent / 2;
    const leftTextPositionBase = leftScreenEdgeBase / 2;

    // RIGHT: Base position when centered
    const rightScreenEdgeBase = 40 + screenWidthPercent / 2;
    const rightTextPositionBase = (rightScreenEdgeBase + 100) / 2;

    // TOP: Base position when centered
    const topScreenEdgeBase = 68 - screenHeightPercent / 2;
    const topTextPositionBase = topScreenEdgeBase / 2;

    // BOTTOM: Base position when centered
    const bottomScreenEdgeBase = 35 + screenHeightPercent / 2;
    const bottomTextPositionBase = (bottomScreenEdgeBase + 100) / 2;

    // ===== CONDITIONAL MOVEMENT LOGIC =====
    // Text only moves if screen moves in that direction

    let leftTextPosition = leftTextPositionBase;
    let rightTextPosition = rightTextPositionBase;
    let topTextPosition = topTextPositionBase;
    let bottomTextPosition = bottomTextPositionBase;

    // HORIZONTAL MOVEMENT
    if (screenOffsetXPercent < 0) {
      // Screen bergeser ke KIRI → hanya teks KIRI yang bergerak
      const leftScreenEdge = leftScreenEdgeBase + screenOffsetXPercent;
      leftTextPosition = leftScreenEdge / 2;
    } else if (screenOffsetXPercent > 0) {
      // Screen bergeser ke KANAN → hanya teks KANAN yang bergerak
      const rightScreenEdge = rightScreenEdgeBase + screenOffsetXPercent;
      rightTextPosition = (rightScreenEdge + 100) / 2;
    }

    // VERTICAL MOVEMENT
    if (screenOffsetYPercent < 0) {
      // Screen bergeser ke ATAS → hanya teks ATAS yang bergerak
      const topScreenEdge = topScreenEdgeBase + screenOffsetYPercent;
      topTextPosition = topScreenEdge / 2;
    } else if (screenOffsetYPercent > 0) {
      // Screen bergeser ke BAWAH → hanya teks BAWAH yang bergerak
      const bottomScreenEdge = bottomScreenEdgeBase + screenOffsetYPercent;
      bottomTextPosition = (bottomScreenEdge + 100) / 2;
    }

    // ===== CLAMP TO BOUNDARIES =====
    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

    const leftPos = clamp(
      leftTextPosition,
      textMarginVertical,
      100 - textMarginVertical
    );
    const rightPos = clamp(
      rightTextPosition,
      textMarginVertical,
      100 - textMarginVertical
    );
    const topPos = clamp(
      topTextPosition,
      textMarginHorizontal,
      100 - textMarginHorizontal
    );
    const bottomPos = clamp(
      bottomTextPosition,
      textMarginHorizontal,
      100 - textMarginHorizontal
    );

    const textStyle = "text-[10px] lg:text-xs text-gray-700 text-center";
    const containerStyle =
      "absolute flex flex-col items-center justify-center z-30";

    return (
      <>
        {/* LEFT measurement (vertical - left side) - TOP POSITION */}
        <div
          className={`${containerStyle} left-4`}
          style={{ top: `${topPos}%`, transform: "translateY(-50%)" }}
        >
          <span
            className={textStyle}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {dynamicRemainingWall.bottom.toFixed(2)} m
          </span>
        </div>

        {/* LEFT measurement (vertical - left side) - BOTTOM POSITION */}
        <div
          className={`${containerStyle} left-4`}
          style={{ top: `${bottomPos}%`, transform: "translateY(-50%)" }}
        >
          <span
            className={textStyle}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {dynamicRemainingWall.top.toFixed(2)} m
          </span>
        </div>

        {/* TOP measurement (horizontal - top side) - LEFT POSITION */}
        <div
          className={`${containerStyle} top-4`}
          style={{ left: `${leftPos}%`, transform: "translateX(-50%)" }}
        >
          <span className={textStyle}>
            {dynamicRemainingWall.right.toFixed(2)} m
          </span>
        </div>

        {/* TOP measurement (horizontal - top side) - RIGHT POSITION */}
        <div
          className={`${containerStyle} top-4`}
          style={{ left: `${rightPos}%`, transform: "translateX(-50%)" }}
        >
          <span className={textStyle}>
            {dynamicRemainingWall.left.toFixed(2)} m
          </span>
        </div>
      </>
    );
  },

  renderInfoDisplays: (
    resolutionString,
    aspectRatio = "N/A",
    humanHeight = "1,70 m"
  ) => {
    const deviceType = CanvasUtils.getDeviceType();

    console.log("resolution canvas:", resolutionString);
    const positions = {
      mobile: { left: "left-12", right: "right-0", bottom: "bottom-2" },
      tablet: { left: "left-13", right: "right-1", bottom: "bottom-2" },
      desktop: { left: "left-13", right: "right-1", bottom: "bottom-2" },
    };

    const { left, right, bottom } = positions[deviceType] || positions.desktop;

    return (
      <>
        {/* Resolution + Ratio (kiri) */}
        <div
          className={`absolute ${bottom} ${left} flex flex-col h-5 justify-center z-50`}
        >
          <span className="text-xs text-gray-700">
            Resolution: {resolutionString}
          </span>
          <span className="text-xs text-gray-700">
            Aspect Ratio {aspectRatio}
          </span>
        </div>

        {/* Human Height (kanan) */}
        <div
          className={`absolute bottom-3 ${right} flex flex-col h-5 items-start justify-start z-50`}
        >
          <span className="text-xs text-gray-700">{humanHeight}</span>
        </div>
      </>
    );
  },

  renderHumanSilhouette: (finalHumanHeight, humanToWallRatio) => {
    const deviceType = CanvasUtils.getDeviceType();

    console.log("human height:", { finalHumanHeight });

    const config = {
      mobile: { right: "-right-40", bottom: "bottom-12", maxWidth: 50 },
      tablet: { right: "-right-37", bottom: "bottom-10", maxWidth: 65 },
      desktop: { right: "-right-35", bottom: "bottom-10", maxWidth: 77 },
    };

    const { right, bottom, maxWidth } = config[deviceType] || config.desktop;

    const parentWidth = 200;
    const maxWidthPercent = `${(maxWidth / parentWidth) * 100}%`;

    return (
      <div
        className={`absolute ${right} ${bottom} z-10 flex items-end`}
        style={{ width: `${parentWidth}px` }}
      >
        <img
          src="/human.webp"
          alt={`Human Scale Reference (1.7m) - ${(
            humanToWallRatio * 100
          ).toFixed(1)}% of wall`}
          className="w-full"
          style={{
            height: `${finalHumanHeight}px`,
            objectFit: finalHumanHeight > 170 ? "fill" : "contain",
            maxWidth: maxWidthPercent,
          }}
        />
      </div>
    );
  },
};
