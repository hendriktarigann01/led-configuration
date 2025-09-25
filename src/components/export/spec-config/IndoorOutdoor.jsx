import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "../BasePage";

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 24,
    right: 32,
    zIndex: 10,
  },
  logo: {
    width: "auto",
    height: 40,
  },
  content: {
    paddingHorizontal: 64,
    paddingVertical: 80,
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 60,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    minHeight: 40,
    padding: 8,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dot1: {
    width: 8,
    height: 8,
    backgroundColor: "#2A7A78",
    borderRadius: 4,
  },
  dot2: {
    width: 8,
    height: 8,
    backgroundColor: "#3AAFA9",
    borderRadius: 4,
  },
  dot3: {
    width: 8,
    height: 8,
    backgroundColor: "#E0F2F0",
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "medium",
    color: "#374151",
    lineHeight: 1,
    margin: 5,
  },
  tableContainer: {
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    borderRadius: 4,
  },
  table: {
    width: "100%",
  },
  // Section container untuk setiap kategori
  sectionContainer: {
    flexDirection: "column",
    borderBottom: "1px solid #E5E7EB",
  },
  lastSection: {
    borderBottom: "none",
  },
  sectionRow: {
    flexDirection: "row",
    minHeight: 40,
    alignItems: "stretch",
  },
  // Style untuk category cell yang merged
  mergedCategoryCell: {
    width: "33.333%",
    paddingVertical: 2,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #E5E7EB",
    justifyContent: "center",
    alignItems: "flex-start",
    // Ini yang penting untuk stretch full height
    alignSelf: "stretch",
  },
  categoryText: {
    fontSize: 11,
    color: "#374151",
    textAlign: "left",
  },
  // Container untuk semua item rows dalam satu section
  itemsContainer: {
    flex: 1,
    flexDirection: "column",
  },
  itemRow: {
    flexDirection: "row",
    minHeight: 25,
    borderBottom: "1px solid #E5E7EB",
    alignItems: "stretch",
  },
  lastItemRow: {
    borderBottom: "none",
  },
  labelCell: {
    width: "50%", // Adjusted karena tidak ada category cell
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRight: "1px solid #E5E7EB",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  labelText: {
    fontSize: 10,
    color: "#374151",
    textAlign: "left",
  },
  valueCell: {
    width: "50%", // Adjusted karena tidak ada category cell
    paddingVertical: 2,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  valueText: {
    fontSize: 10,
    color: "#374151",
    textAlign: "left",
    fontWeight: "medium",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    fontSize: 10,
    color: "#666",
  },
  footerTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  footerText: {
    marginBottom: 8,
  },
  footerContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    width: 12,
    height: 12,
  },
});

export const IndoorOutdoorConfig = ({ data }) => {
  console.log(">>> IndoorOutdoorConfig received data:", data);

  // Return null if no data (fallback as requested)
  if (!data || !data.calculations || !data.calculations.processedValues) {
    return null;
  }

  const { processedValues } = data.calculations;
  const { isVideoWall } = data;

  // Build specifications using processed values from export store
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
    {
      label: "SQM",
      value: processedValues.sqm ? `${processedValues.sqm} m²` : null,
    },
    {
      label: "Real Size",
      value: processedValues.realSize,
    },
  ];

  // Add weight only for non-Video Wall types and when weight exists
  if (!isVideoWall && processedValues.weight) {
    productItems.push({
      label: `Weight ${processedValues.unitName}`,
      value: processedValues.weight,
    });
  }

  // Filter out null values
  const validProductItems = productItems.filter((item) => item.value !== null);

  const specifications = [
    {
      category: "Product",
      items: validProductItems,
    },
  ];

  // Add power consumption only if available
  if (data?.modelData?.power_consumption && processedValues.powerConsumption) {
    const powerItems = [
      {
        label: "Max Power",
        value: processedValues.powerConsumption.maxFormatted,
      },
    ];

    // Add average power only for non-Video Wall types
    if (!isVideoWall && processedValues.powerConsumption.averageFormatted) {
      powerItems.push({
        label: "Average Power",
        value: processedValues.powerConsumption.averageFormatted,
      });
    }

    const validPowerItems = powerItems.filter((item) => item.value !== null);

    if (validPowerItems.length > 0) {
      specifications.push({
        category: "Power Consumption",
        items: validPowerItems,
      });
    }
  }

  // Return null if no valid specifications
  if (specifications.length === 0 || specifications[0].items.length === 0) {
    return null;
  }

  return (
    <BasePage>
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo/mjs_logo_text.png" />
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            <View style={styles.dotsContainer}>
              <View style={styles.dot1} />
              <View style={styles.dot2} />
              <View style={styles.dot3} />
            </View>

            <Text style={styles.sectionTitle}>Specification</Text>

            <View style={styles.dotsContainer}>
              <View style={styles.dot3} />
              <View style={styles.dot2} />
              <View style={styles.dot1} />
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            {specifications.map((section, sectionIndex) => (
              <View
                key={sectionIndex}
                style={[
                  styles.sectionContainer,
                  sectionIndex === specifications.length - 1 &&
                    styles.lastSection,
                ]}
              >
                <View style={styles.sectionRow}>
                  <View style={styles.mergedCategoryCell}>
                    <Text style={styles.categoryText}>{section.category}</Text>
                  </View>

                  <View style={styles.itemsContainer}>
                    {section.items.map((item, itemIndex) => (
                      <View
                        key={itemIndex}
                        style={[
                          styles.itemRow,
                          itemIndex === section.items.length - 1 &&
                            styles.lastItemRow,
                        ]}
                      >
                        <View style={styles.labelCell}>
                          <Text style={styles.labelText}>{item.label}</Text>
                        </View>
                        <View style={styles.valueCell}>
                          <Text style={styles.valueText}>{item.value}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>MJ Solution Indonesia</Text>
        <Text style={styles.footerText}>
          The Mansion Bougenville Kemayoran Tower Fontana Zona I Lantai 50
          Kemayoran Jakarta Utara
        </Text>
        <View style={styles.footerContact}>
          <View style={styles.contactItem}>
            <Image src="/icons/icon-web.png" style={styles.icon} />
            <Text>mjsolution.co.id</Text>
          </View>
          <View style={styles.contactItem}>
            <Image src="/icons/icon-call.png" style={styles.icon} />
            <Text>(+62) 811-1122-492</Text>
          </View>
        </View>
      </View>
    </BasePage>
  );
};
