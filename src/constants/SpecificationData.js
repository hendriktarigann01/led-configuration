export const getIndoorSpecifications = (data) => [
  {
    category: "Basic Specifications",
    items: [
      {
        label: "Pixel Pitch",
        value: data?.pixelPitch ? `${data.pixelPitch}` : "P2.5",
      },
      {
        label: "Refresh Rate",
        value: "2400 Hz / 3840 Hz",
      },
      {
        label: "Brightness",
        value: data?.brightness || "500 nits - 1.000 nits",
      },
    ],
  },
  {
    category: "Module",
    items: [
      { label: "Module Size", value: "320mm x 160mm" },
      {
        label: "Module Resolution",
        value: data?.moduleResolution || "128 x 64",
      },
      { label: "Module Pixels", value: data?.modulePixels || "8,192" },
      { label: "IC", value: "ICN2153" },
      { label: "Led Configuration", value: "3 in 1" },
      { label: "Weight", value: "0.48 KG" },
      { label: "Application", value: "Indoor Fixed Installation" },
    ],
  },
  {
    category: "Cabinet",
    items: [
      { label: "Cabinet size (WH)", value: "640 X 480mm" },
      {
        label: "Cabinet resolution",
        value: data?.cabinetResolution || "256 x 192",
      },
      {
        label: "Cabinet pixels",
        value: data?.cabinetPixels || "49,152",
      },
      {
        label: "Pixel density",
        value: data?.pixelDensity || "160,000/m²",
      },
      {
        label: "Cabinet material",
        value: "Die-casting aluminum",
      },
      { label: "Weight", value: "7.8KG" },
      {
        label: "Power consumption",
        value: "Max: 500W/m², Avg: 700W/m²",
      },
      { label: "Life span", value: ">10,000 hours" },
    ],
  },
];

export const getOutdoorSpecifications = (data) => [
  {
    category: "Basic Specifications",
    items: [
      {
        label: "Pixel Pitch",
        value: data?.pixelPitch ? `${data.pixelPitch}` : "P 3.0",
      },
      {
        label: "Refresh Rate",
        value: "3840 Hz / 7680 Hz",
      },
      {
        label: "Brightness",
        value: data?.brightness || "5500 - 6000 Nits",
      },
    ],
  },
  {
    category: "Module",
    items: [
      { label: "Module Size", value: data?.moduleSize || "320mm x 160mm" },
      { label: "LED lamp", value: data?.ledLamp || "SMD1921" },
      {
        label: "Pixel Resolution",
        value: data?.pixelResolution || "106 x 53",
      },
      { label: "Module thickness", value: "17MM" },
      { label: "Module weight", value: data?.moduleWeight || "0.45KG" },
      { label: "Drive type", value: "Constant drive" },
      { label: "Application", value: "Outdoor Fixed Installation" },
    ],
  },
  {
    category: "Cabinet",
    items: [
      { label: "Cabinet size (WH)", value: "960*960mm" },
      {
        label: "Cabinet resolution",
        value: data?.cabinetResolution || "320 x 320",
      },
      {
        label: "Pixel density",
        value: data?.pixelDensity || "111,111/m²",
      },
      {
        label: "Power Consumption",
        value: "Max: 1000W/m², Avg: 700W/m²",
      },
      {
        label: "Cabinet material",
        value: "Die-casting Magnesium Cabinet",
      },
      { label: "Life span", value: ">100,000 Hours" },
      { label: "Cabinet weight", value: "25Kg/pcs" },
      { label: "Working voltage", value: "AC220v+-10%" },
      { label: "Humidity", value: "10%-75%" },
      {
        label: "Best viewing distance",
        value: data?.viewingDistance || "3-30m",
      },
    ],
  },
];

export const getVideoWallSpecifications = (data) => [
  {
    category: "Basic Specifications",
    items: [
      { label: "Inch", value: data?.inch ? `${data.inch}"` : '46"' },
      { label: "Unit Size (mm)", value: data?.unitSize || "1020 x 574 x 65" },
      { label: "B2B", value: data?.b2b || "0.88mm" },
      { label: "Brightness", value: data?.brightness || "500 cd/m²" },
    ],
  },
  {
    category: "Panel",
    items: [
      { label: "Resolution", value: "FHD 1920 x 1080" },
      { label: "Contrast Ratio", value: data?.contrastRatio || "4000:1" },
      { label: "Aspect Ratio", value: "16:9" },
      { label: "Display Color", value: "8 bit / 16.7 M" },
      { label: "Color Gamut", value: "72%" },
      { label: "Response Time", value: "8 ms" },
      { label: "Viewing Angle", value: "178° (H) / 178° (V)" },
      { label: "H. Scanning Frequency", value: "30 kHz ~ 81 kHz" },
      { label: "V. Scanning Frequency", value: "48Hz ~ 75Hz" },
    ],
  },
  {
    category: "Connectivity",
    items: [
      { label: "Audio in/Out", value: "Stereo Mini Jack" },
      { label: "Video In", value: "HDMI1, HDMI2" },
    ],
  },
  {
    category: "Power",
    items: [
      { label: "Power Supply", value: "AC 100 - 240 V / 50 - 60 Hz" },
      { label: "Power Consumption (W)", value: "<180 W" },
      { label: "Standby Power", value: "3W" },
    ],
  },
  {
    category: "Environment",
    items: [
      { label: "Operation Temperature", value: "0 ~ 50°C" },
      { label: "Storage Temperature", value: "-20 ~ 65°C" },
      { label: "Operation", value: "24/7" },
    ],
  },
];