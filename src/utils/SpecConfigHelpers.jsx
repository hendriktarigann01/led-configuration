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

  // Add Processor
  if (data.processor.processor && data.processor.processor !== "N/A") {
    materialItems.push({
      label: "Processor",
      value: data.processor.processor,
    });
  }

  // Add Connection Type if available
  if (
    data.processor.connectionType &&
    data.processor.connectionType !== "N/A"
  ) {
    materialItems.push({
      label: "Connection Type",
      value: data.processor.connectionType,
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