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
    marginBottom: 40,
    marginTop: 80,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    height: 40,
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
    margin: 0,
  },
  tableContainer: {
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  table: {
    width: "100%",
  },
  sectionContainer: {
    position: "relative",
  },
  tableRow: {
    flexDirection: "row",
    height: 40,
    borderBottom: "1px solid #E5E7EB",
  },
  categoryCell: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "33.333%",
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "flex-start",
    justifyContent: "center",
    borderRight: "1px solid #E5E7EB",
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#374151",
    textAlign: "left",
  },
  labelCell: {
    width: "33.333%",
    paddingVertical: 2,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRight: "1px solid #E5E7EB",
    marginLeft: "33.333%",
  },
  labelCellOffset: {
    backgroundColor: "transparent",
  },
  labelText: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "left",
  },
  valueCell: {
    width: "33.333%",
    paddingVertical: 2,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 10,
    color: "#374151",
    textAlign: "left",
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
    width: 16,
    height: 16,
  },
});

export const VideoWallConfig = ({ data }) => {
  console.log(">>> VideoWallConfig received data:", data);

  const specifications = [
    {
      category: "Display Requirements",
      items: [
        {
          label: "Screen Configuration",
          value: data?.calculations?.unitCount
            ? `${data.calculations.unitCount.horizontal} x ${data.calculations.unitCount.vertical}`
            : "4 x 4",
        },
        {
          label: "Number Of Screen",
          value: data?.calculations?.totalUnits
            ? `${data.calculations.totalUnits} pcs`
            : "16 pcs",
        },
      ],
    },
    {
      category: "Display Wall",
      items: [
        {
          label: "Dimensions",
          value:
            data?.screenConfig?.width && data?.calculations?.baseDimensions
              ? `${data.screenConfig.width} (${data.calculations.baseDimensions.width}) x ${data.screenConfig.height} (${data.calculations.baseDimensions.height})`
              : "2.56 (0.64) x 1.92 (0.48)",
        },
        {
          label: "Display Area",
          value: data?.screenConfig?.area
            ? `${data.screenConfig.area} mÂ²`
            : "0.84 mÂ²",
        },
      ],
    },
    {
      category: "Power Requirements",
      items: [
        {
          label: "Max Power",
          value:
            data?.calculations?.power?.max > 0
              ? `${data.calculations.power.max.toFixed(0)} W`
              : "10.400 W",
        },
      ],
    },
  ];

  return (
    <BasePage>
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo/mjs_logo_text.png" />
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={styles.titleWrapper}>
            {/* Dots kiri */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot1} />
              <View style={styles.dot2} />
              <View style={styles.dot3} />
            </View>

            {/* Title */}
            <Text style={styles.sectionTitle}>Specification</Text>

            {/* Dots kanan */}
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
              <React.Fragment key={sectionIndex}>
                {section.items.map((item, itemIndex) => (
                  <View
                    key={`${sectionIndex}-${itemIndex}`}
                    style={[
                      styles.tableRow,
                      { minHeight: 40 },
                      // Remove border bottom for last item in each section (except last section)
                      itemIndex === section.items.length - 1 &&
                        sectionIndex < specifications.length - 1 && {
                          borderBottom: "1px solid #E5E7EB",
                        },
                      // Remove border bottom for last item in last section
                      sectionIndex === specifications.length - 1 &&
                        itemIndex === section.items.length - 1 && {
                          borderBottom: "none",
                        },
                      // Remove border bottom for middle items in each section
                      itemIndex > 0 &&
                        itemIndex < section.items.length - 1 && {
                          borderBottom: "none",
                        },
                    ]}
                  >
                    {itemIndex === 0 && (
                      <View
                        style={[
                          styles.categoryCell,
                          {
                            height: section.items.length * 40,
                          },
                        ]}
                      >
                        <Text style={styles.categoryText}>
                          {section.category}
                        </Text>
                      </View>
                    )}

                    <View style={styles.labelCell}>
                      <Text style={styles.labelText}>{item.label}</Text>
                    </View>

                    <View style={styles.valueCell}>
                      <Text style={styles.valueText}>{item.value}</Text>
                    </View>
                  </View>
                ))}
              </React.Fragment>
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
