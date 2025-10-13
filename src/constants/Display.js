// Display Type IDs
export const DISPLAY_TYPE = {
  INDOOR_LED: 1,
  MODULE: 2,
  OUTDOOR: 3,
  VIDEO_WALL: 4,
};

// Sub Type IDs for Indoor LED
export const SUB_TYPE = {
  CABINET: 1,
  MODULE: 2,
};

// Display Type Names
export const DISPLAY_TYPE_NAME = {
  [DISPLAY_TYPE.INDOOR_LED]: "Indoor LED Fixed",
  [DISPLAY_TYPE.OUTDOOR]: "Outdoor LED",
  [DISPLAY_TYPE.VIDEO_WALL]: "Video Wall",
};

// Unit Names by Display Type
export const UNIT_NAME = {
  CABINET: "Cabinets",
  MODULE: "Module",
  VIDEO_WALL: "Units",
  DEFAULT: "Units",
};

// Component Names for PDF Export
export const PDF_COMPONENTS = {
  INDOOR_OUTDOOR: {
    CONFIG: "IndoorOutdoorConfig",
    DEFAULT: "Indoor",
  },
  OUTDOOR: {
    CONFIG: "IndoorOutdoorConfig",
    DEFAULT: "Outdoor",
  },
  VIDEO_WALL: {
    CONFIG: "VideoWallConfig",
    DEFAULT: "VideoWall",
  },
};

// Image Paths
export const DISPLAY_IMAGE_PATH = {
  INDOOR: "/product/model/indoor.svg",
  OUTDOOR: "/product/model/outdoor.svg",
  VIDEO_WALL: "/product/model/video_wall.svg",
};
