import { model } from "../data/model";

export const getDetailSpec = (modelData, displayType) => {
  if (!modelData) return [];

  const isIndoor = displayType?.includes("Indoor");
  const isOutdoor = displayType?.includes("Outdoor");
  const isVideoWall = displayType?.includes("Video Wall");

  if (isIndoor) {
    // Find module and cabinet data based on the same pixel pitch
    const currentPixelPitch = modelData?.pixel_pitch;
    const allIndoorData = model.filter((m) => m.name?.includes("Indoor"));

    let moduleData = null;
    let cabinetData = null;

    allIndoorData.forEach((item) => {
      item.data.forEach((d) => {
        if (d.pixel_pitch === currentPixelPitch) {
          if (d.module_size) {
            moduleData = d;
          }
          if (d.cabinet_size) {
            cabinetData = d;
          }
        }
      });
    });

    return [
      {
        category: "Basic Specifications",
        items: [
          { label: "Pixel Pitch", value: modelData?.pixel_pitch || "N/A" },
          { label: "Refresh Rate", value: modelData?.refresh_rate || "N/A" },
          { label: "Brightness", value: modelData?.brightness || "N/A" },
        ],
      },
      {
        category: "Module",
        items: [
          { label: "Module Size", value: moduleData?.module_size || "N/A" },
          {
            label: "Module Resolution",
            value: moduleData?.module_resolution || "N/A",
          },
          { label: "Module Pixels", value: moduleData?.module_pixels || "N/A" },
          { label: "IC", value: moduleData?.ic || "N/A" },
          {
            label: "Led Configuration",
            value: moduleData?.led_configuration || "N/A",
          },
          { label: "Weight", value: moduleData?.module_weight || "N/A" },
          {
            label: "Application",
            value: moduleData?.application || "N/A",
          },
        ],
      },
      {
        category: "Cabinet",
        items: [
          {
            label: "Cabinet size (WH)",
            value: cabinetData?.cabinet_size || "N/A",
          },
          {
            label: "Cabinet resolution",
            value: cabinetData?.cabinet_resolution || "N/A",
          },
          {
            label: "Cabinet pixels",
            value: cabinetData?.cabinet_pixels || "N/A",
          },
          {
            label: "Pixel density",
            value: cabinetData?.pixel_density || "N/A",
          },
          {
            label: "Cabinet material",
            value: cabinetData?.cabinet_material || "N/A",
          },
          { label: "Weight", value: cabinetData?.cabinet_weight || "N/A" },
          {
            label: "Power consumption",
            value: cabinetData?.power_consumption || "N/A",
          },
          { label: "Life span", value: cabinetData?.life_span || "N/A" },
        ],
      },
    ];
  }

  if (isOutdoor) {
    return [
      {
        category: "Basic Specifications",
        items: [
          { label: "Pixel Pitch", value: modelData?.pixel_pitch || "N/A" },
          { label: "Refresh Rate", value: modelData?.refresh_rate || "N/A" },
          { label: "Brightness", value: modelData?.brightness || "N/A" },
        ],
      },
      {
        category: "Module",
        items: [
          { label: "Module Size", value: modelData?.module_size || "N/A" },
          { label: "LED lamp", value: modelData?.led_lamp || "N/A" },
          {
            label: "Pixel Resolution",
            value: modelData?.pixel_resolution || "N/A",
          },
          {
            label: "Module thickness",
            value: modelData?.module_thickness || "N/A",
          },
          { label: "Module weight", value: modelData?.module_weight || "N/A" },
          { label: "Drive type", value: modelData?.drive_type || "N/A" },
          {
            label: "Application",
            value: modelData?.application || "N/A",
          },
        ],
      },
      {
        category: "Cabinet",
        items: [
          {
            label: "Cabinet size (WH)",
            value: modelData?.cabinet_size || "N/A",
          },
          {
            label: "Cabinet resolution",
            value: modelData?.cabinet_resolution || "N/A",
          },
          { label: "Pixel density", value: modelData?.pixel_density || "N/A" },
          {
            label: "Power Consumption",
            value: modelData?.power_consumption || "N/A",
          },
          {
            label: "Cabinet material",
            value: modelData?.cabinet_material || "N/A",
          },
          { label: "Life span", value: modelData?.life_span || "N/A" },
          {
            label: "Cabinet weight",
            value: modelData?.cabinet_weight || "N/A",
          },
          {
            label: "Working voltage",
            value: modelData?.working_voltage || "N/A",
          },
          { label: "Humidity", value: modelData?.humidity || "N/A" },
          {
            label: "Best viewing distance",
            value: modelData?.best_viewing_distance || "N/A",
          },
        ],
      },
    ];
  }

  if (isVideoWall) {
    return [
      {
        category: "Basic Specifications",
        items: [
          { label: "Inch", value: modelData?.inch || "N/A" },
          { label: "Unit Size (mm)", value: modelData?.unit_size_mm || "N/A" },
          { label: "B2B", value: modelData?.b2b || "N/A" },
          { label: "Brightness", value: modelData?.brightness || "N/A" },
        ],
      },
      {
        category: "Panel",
        items: [
          { label: "Resolution", value: modelData?.resolution || "N/A" },
          {
            label: "Contrast Ratio",
            value: modelData?.contrast_ratio || "N/A",
          },
          { label: "Aspect Ratio", value: modelData?.aspect_ratio || "N/A" },
          { label: "Display Color", value: modelData?.display_color || "N/A" },
          { label: "Color Gamut", value: modelData?.color_gamut || "N/A" },
          { label: "Response Time", value: modelData?.response_time || "N/A" },
          { label: "Viewing Angle", value: modelData?.viewing_angle || "N/A" },
          {
            label: "H. Scanning Frequency",
            value: modelData?.h_scanning_frequency || "N/A",
          },
          {
            label: "V. Scanning Frequency",
            value: modelData?.v_scanning_frequency || "N/A",
          },
        ],
      },
      {
        category: "Connectivity",
        items: [
          { label: "Audio in/Out", value: modelData?.audio_in_out || "N/A" },
          { label: "Video In", value: modelData?.video_in || "N/A" },
        ],
      },
      {
        category: "Power",
        items: [
          { label: "Power Supply", value: modelData?.power_supply || "N/A" },
          {
            label: "Power Consumption (W)",
            value: modelData?.power_consumption || "N/A",
          },
          { label: "Standby Power", value: modelData?.standby_power || "N/A" },
        ],
      },
      {
        category: "Environment",
        items: [
          {
            label: "Operation Temperature",
            value: modelData?.operation_temperature || "N/A",
          },
          {
            label: "Storage Temperature",
            value: modelData?.storage_temperature || "N/A",
          },
          { label: "Operation", value: modelData?.operation || "N/A" },
        ],
      },
    ];
  }

  return [];
};
