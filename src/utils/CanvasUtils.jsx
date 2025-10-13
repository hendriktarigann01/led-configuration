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
            height: `${verticalMeasureLength + verticalExtension}px`,
          }}
        />
        <div
          className={`${lineStyle} top-0 left-[0px] border-l`}
          style={{
            transform: "translateX(-80%) translateY(-100%)",
            height: `${verticalMeasureLength + verticalExtension}px`,
          }}
        />
        <div
          className={`${lineStyle} top-0 left-0 border-t`}
          style={{
            transform: "translateY(100%) translateX(-100%)",
            width: `${horizontalMeasureLength + horizontalExtension}px`,
          }}
        />
        <div
          className={`${lineStyle} bottom-[1px] left-0 border-t`}
          style={{
            transform: "translateY(100%) translateX(-100%)",
            width: `${horizontalMeasureLength + horizontalExtension}px`,
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
    remainingWallHeight,
    remainingWallWidth,
    actualScreenSize,
    wallWidth,
    wallHeight
  ) => {
    const deviceType = CanvasUtils.getDeviceType();

    const margins = {
      mobile: { horizontal: 22, vertical: 18 },
      tablet: { horizontal: 17, vertical: 13 },
      desktop: { horizontal: 16, vertical: 10 },
    };

    const { horizontal: textMarginHorizontal, vertical: textMarginVertical } =
      margins[deviceType] || margins.desktop;

    const screenToWallRatioX = (actualScreenSize.width / wallWidth) * 0.7;
    const screenToWallRatioY = (actualScreenSize.height / wallHeight) * 0.5;

    const remainingSpaceRatioX = (1 - screenToWallRatioX) / 2;
    const remainingSpaceRatioY = (1 - screenToWallRatioY) / 2;

    const rawLeftPercentage = (remainingSpaceRatioX / 2) * 115;
    const rawRightPercentage = (1 - remainingSpaceRatioX / 2) * 95;
    const rawTopPercentage = (remainingSpaceRatioY / 2) * 120;
    const rawBottomPercentage = (1 - remainingSpaceRatioY / 2) * 100;

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

    const leftPercentage = clamp(
      rawLeftPercentage,
      textMarginVertical,
      Math.max(
        textMarginVertical,
        remainingSpaceRatioX * 100 - textMarginVertical
      )
    );

    const rightPercentage = clamp(
      rawRightPercentage,
      Math.min(
        100 - textMarginVertical,
        (1 - remainingSpaceRatioX) * 100 + textMarginVertical
      ),
      100 - textMarginVertical
    );

    const topPercentage = clamp(
      rawTopPercentage,
      textMarginHorizontal,
      Math.max(
        textMarginHorizontal,
        remainingSpaceRatioY * 100 - textMarginHorizontal
      )
    );

    const bottomPercentage = clamp(
      rawBottomPercentage,
      Math.min(
        100 - textMarginHorizontal,
        (1 - remainingSpaceRatioY) * 100 + textMarginHorizontal
      ),
      100 - textMarginHorizontal
    );

    const textStyle = "text-[10px] lg:text-xs text-gray-700 text-center";
    const containerStyle =
      "absolute flex flex-col items-center justify-center z-50";

    return (
      <>
        <div
          className={`${containerStyle} left-4`}
          style={{ top: `${topPercentage}%`, transform: "translateY(-50%)" }}
        >
          <span
            className={textStyle}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {remainingWallHeight.toFixed(2)} m
          </span>
        </div>

        <div
          className={`${containerStyle} left-4`}
          style={{ top: `${bottomPercentage}%`, transform: "translateY(-50%)" }}
        >
          <span
            className={textStyle}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {remainingWallHeight.toFixed(2)} m
          </span>
        </div>

        <div
          className={`${containerStyle} top-4`}
          style={{ left: `${leftPercentage}%`, transform: "translateX(-50%)" }}
        >
          <span className={textStyle}>{remainingWallWidth.toFixed(2)} m</span>
        </div>

        <div
          className={`${containerStyle} top-4`}
          style={{ left: `${rightPercentage}%`, transform: "translateX(-50%)" }}
        >
          <span className={textStyle}>{remainingWallWidth.toFixed(2)} m</span>
        </div>
      </>
    );
  },

  renderInfoDisplays: (resolutionString, humanHeight = "1,70 m") => {
    const deviceType = CanvasUtils.getDeviceType();

    const positions = {
      mobile: { left: "left-12", right: "right-0", bottom: "bottom-5" },
      tablet: { left: "left-13", right: "right-1", bottom: "bottom-5" },
      desktop: { left: "left-13", right: "right-1", bottom: "bottom-5" },
    };

    const { left, right, bottom } = positions[deviceType] || positions.desktop;

    return (
      <>
        <div
          className={`absolute ${bottom} ${left} flex flex-col items-start justify-center z-50`}
        >
          <span className="text-xs text-gray-700">
            Resolution: {resolutionString}
          </span>
        </div>

        <div
          className={`absolute ${bottom} ${right} flex flex-col items-start justify-center z-50`}
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
