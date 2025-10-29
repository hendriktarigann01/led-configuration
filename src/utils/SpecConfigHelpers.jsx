export const buildProductSpecifications = (data, isVideoWall) => {
  if (!data?.calculations?.processedValues) return null;

  const { processedValues } = data.calculations;

  const productItems = [
    {
      label: isVideoWall ? "Inch" : "Pixel Pitch",
      value:
        processedValues.pixelPitchOrInch !== "N/A"
          ? processedValues.pixelPitchOrInch
          : null,
    },
    {
      label: "Resolution",
      value: processedValues.resolutionDisplay,
    },
    {
      label: `Number of ${processedValues.unitName}`,
      value: processedValues.unitConfiguration,
    },
  ];

  // Add SQM only for non-Video Wall types
  if (!isVideoWall && processedValues.sqm) {
    productItems.push({
      label: "SQM",
      value: `${processedValues.sqm} m²`,
    });
  }

  // Add Real Size only for non-Video Wall types
  if (!isVideoWall && processedValues.realSize) {
    productItems.push({
      label: "Real Size",
      value: processedValues.realSize,
    });
  }

  // Add weight only for non-Video Wall types
  if (!isVideoWall && processedValues.weight) {
    productItems.push({
      label: `Weight ${processedValues.unitName}`,
      value: processedValues.weight,
    });
  }

  return productItems.filter((item) => item.value !== null);
};

export const buildPowerSpecifications = (data, isVideoWall) => {
  if (
    !data?.modelData?.power_consumption ||
    !data?.calculations?.processedValues?.powerConsumption
  ) {
    return null;
  }

  const { powerConsumption } = data.calculations.processedValues;

  const powerItems = [
    {
      label: "Max Power",
      value: powerConsumption.maxFormatted,
    },
  ];

  // Add average power for all types (removed restriction)
  if (powerConsumption.averageFormatted) {
    powerItems.push({
      label: "Average Power",
      value: powerConsumption.averageFormatted,
    });
  }

  return powerItems.filter((item) => item.value !== null);
};

export const buildMaterialSpecifications = (data) => {
  if (!data?.processor) return null;

  const materialItems = [];
  const proc = data.processor;

  // Column 1 items (left)
  if (proc.processor && proc.processor !== "N/A") {
    materialItems.push({
      label: "Processor",
      value: proc.processor,
    });
  }

  if (
    data.processor.connectionType &&
    data.processor.connectionType !== "No Compatible Processor"
  ) {
    materialItems.push({
      label: "Connection Type",
      value: data.processor.connectionType,
    });
  }

  if (proc.loadCapacity) {
    materialItems.push({
      label: "Load Capacity",
      value: proc.loadCapacity.toLocaleString("id-ID"),
    });
  }

  if (proc.maxWidth) {
    materialItems.push({
      label: "Max Width",
      value: proc.maxWidth.toString(),
    });
  }

  if (proc.maxHeight) {
    materialItems.push({
      label: "Max Height",
      value: proc.maxHeight.toString(),
    });
  }

  if (proc.storage) {
    materialItems.push({
      label: "Storage",
      value: proc.storage,
    });
  }

  if (proc.os) {
    materialItems.push({
      label: "OS",
      value: proc.os,
    });
  }

  if (proc.maxInputChannels) {
    materialItems.push({
      label: "Max Input Channels",
      value: proc.maxInputChannels.toString(),
    });
  }

  if (proc.minInputChannels) {
    materialItems.push({
      label: "Min Input Channels",
      value: proc.minInputChannels.toString(),
    });
  }

  // Column 2 items (right)
  if (proc.connectionType && proc.connectionType !== "N/A") {
    materialItems.push({
      label: "LAN",
      value: proc.lan || proc.connectionType,
    });
  }

  if (proc.layers) {
    materialItems.push({
      label: "Layers",
      value: proc.layers,
    });
  }

  if (proc.input) {
    materialItems.push({
      label: "Input",
      value: proc.input,
    });
  }

  if (proc.output) {
    materialItems.push({
      label: "Output",
      value: proc.output,
    });
  }

  return materialItems.length > 0 ? materialItems : null;
};

export const buildConfigSpecifications = (data, isVideoWall) => {
  const productItems = buildProductSpecifications(data, isVideoWall);
  if (!productItems || productItems.length === 0) return null;

  const specifications = [
    {
      category: "Product",
      items: productItems,
    },
  ];

  const powerItems = buildPowerSpecifications(data, isVideoWall);
  if (powerItems && powerItems.length > 0) {
    specifications.push({
      category: "Power Consumption",
      items: powerItems,
    });
  }

  const materialItems = buildMaterialSpecifications(data);
  if (materialItems && materialItems.length > 0) {
    specifications.push({
      category: "Material",
      items: materialItems,
    });
  }

  return specifications.length > 0 ? specifications : null;
};
