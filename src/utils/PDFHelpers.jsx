import {
  PRODUCT_IMAGE_PATHS,
  DISPLAY_TYPES,
  DISPLAY_TITLES,
  CANVAS_DEFAULTS,
} from "../constants/PDFConfig";

export const getProductImage = (displayType) => {
  if (!displayType) return PRODUCT_IMAGE_PATHS.indoor;
  if (displayType.includes(DISPLAY_TYPES.VIDEO_WALL)) return PRODUCT_IMAGE_PATHS.videoWall;
  if (displayType.includes(DISPLAY_TYPES.OUTDOOR)) return PRODUCT_IMAGE_PATHS.outdoor;
  return PRODUCT_IMAGE_PATHS.indoor;
};

export const getDisplayTitle = (displayType) => {
  if (!displayType) return DISPLAY_TITLES[DISPLAY_TYPES.INDOOR];
  if (displayType.includes(DISPLAY_TYPES.VIDEO_WALL)) return DISPLAY_TITLES[DISPLAY_TYPES.VIDEO_WALL];
  if (displayType.includes(DISPLAY_TYPES.OUTDOOR)) return DISPLAY_TITLES[DISPLAY_TYPES.OUTDOOR];
  return DISPLAY_TITLES[DISPLAY_TYPES.INDOOR];
};

export const getPixelPitch = (data) => {
  if (!data) return "P 1.8";
  if (data.pixelPitch && data.pixelPitch !== "N/A") return data.pixelPitch;
  if (data.inch && data.inch !== "N/A") return `${data.inch}`;
  return "1.8";
};

export const calculateCanvasData = (data) => {
  const defaults = {
    wallWidth: CANVAS_DEFAULTS.wallWidth,
    wallHeight: CANVAS_DEFAULTS.wallHeight,
    actualScreenSize: { 
      width: CANVAS_DEFAULTS.screenWidth, 
      height: CANVAS_DEFAULTS.screenHeight 
    },
    cabinetCount: { horizontal: 1, vertical: 1 },
    contentSource: "/canvas/canvas-bg-compress.png",
    screenWidth: CANVAS_DEFAULTS.screenWidth,
    screenHeight: CANVAS_DEFAULTS.screenHeight,
  };

  if (!data?.calculations?.unitCount) return defaults;

  const wallWidth = parseFloat(data.wallConfig?.width) || CANVAS_DEFAULTS.wallWidth;
  const wallHeight = parseFloat(data.wallConfig?.height) || CANVAS_DEFAULTS.wallHeight;
  const screenWidth = parseFloat(data.screenConfig?.width) || CANVAS_DEFAULTS.screenWidth;
  const screenHeight = parseFloat(data.screenConfig?.height) || CANVAS_DEFAULTS.screenHeight;

  const contentSource = data?.selectedContent
    ? getContentSource(data.selectedContent, data.customImageUrl)
    : "/canvas/canvas-bg-compress.png";

  return {
    wallWidth,
    wallHeight,
    actualScreenSize: { width: screenWidth, height: screenHeight },
    cabinetCount: data.calculations.unitCount,
    contentSource,
    screenWidth,
    screenHeight,
  };
};

const getContentSource = (selectedContent, customImageUrl) => {
  // Import from CanvasUtils if available, otherwise implement here
  return selectedContent === "custom" && customImageUrl 
    ? customImageUrl 
    : `/canvas/${selectedContent}.png`;
};

export const calculateDynamicContainerSize = (canvasData) => {
  const maxWidth = CANVAS_DEFAULTS.maxCanvasWidth;
  const maxHeight = CANVAS_DEFAULTS.maxCanvasHeight;
  const wallAspectRatio = canvasData.wallWidth / canvasData.wallHeight;

  let containerW, containerH;

  if (wallAspectRatio >= 1) {
    containerW = maxWidth;
    containerH = containerW / wallAspectRatio;
    if (containerH > maxHeight) {
      containerH = maxHeight;
      containerW = containerH * wallAspectRatio;
    }
  } else {
    containerH = maxHeight;
    containerW = containerH * wallAspectRatio;
    if (containerW > maxWidth) {
      containerW = maxWidth;
      containerH = containerW / wallAspectRatio;
    }
  }

  return {
    width: Math.round(containerW),
    height: Math.round(containerH),
  };
};

export const calculateImageSize = (canvasData, containerWidth, containerHeight) => {
  // Hitung rasio aspek screen dari ukuran asli
  const screenAspectRatio =
    canvasData.actualScreenSize.width / canvasData.actualScreenSize.height;

  let imageWidth = containerWidth * 0.8;
  let imageHeight = imageWidth / screenAspectRatio;

  if (imageHeight > containerHeight * 0.8) {
    imageHeight = containerHeight * 0.8;
    imageWidth = imageHeight * screenAspectRatio;
  }

  imageWidth = Math.max(imageWidth, 50);
  imageHeight = Math.max(imageHeight, 50);

  const screenToWallRatioX = canvasData.actualScreenSize.width / canvasData.wallWidth;
  const screenToWallRatioY = canvasData.actualScreenSize.height / canvasData.wallHeight;

  return {
    width: imageWidth,
    height: imageHeight,
    screenToWallRatioX,
    screenToWallRatioY,
  };
};


export const calculateHumanHeight = (canvasData, containerHeight) => {
  if (canvasData.wallHeight < 3) return 0;

  const humanPercentageOfWall = CANVAS_DEFAULTS.humanRealHeight / canvasData.wallHeight;
  const calculatedHumanHeight = containerHeight * humanPercentageOfWall;
  const minHumanHeight = Math.max(CANVAS_DEFAULTS.minHumanHeight, containerHeight * 0.2);
  
  return Math.max(calculatedHumanHeight, minHumanHeight);
};

export const clampPercentage = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
};

export const formatMetric = (value) => {
  if (!value) return "N/A";
  return parseFloat(value.toFixed(3)).toString();
};