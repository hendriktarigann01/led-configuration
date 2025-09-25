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

export const VideoWall = ({ data }) => {
  const specifications = [
    {
      category: "Basic Specifications",
      items: [
        { label: "Inch", value: data?.inch ? `${data.inch}"` : '46"' },
        {
          label: "Unit Size (mm)",
          value: data?.unitSize || "1020 x 574 x 65",
        },
        { label: "B2B", value: data?.b2b || "0.88mm" },
        { label: "Brightness", value: data?.brightness || "500 cd/m²" },
      ],
    },
    {
      category: "Panel",
      items: [
        {
          label: "Resolution",
          value: "FHD 1920 x 1080",
        },
        { label: "Contrast Ratio", value: data?.contrastRatio || "4000:1" },
        { label: "Aspect Ratio", value: "16:9" },
        {
          label: "Display Color",
          value: "8 bit / 16.7 M",
        },
        { label: "Color Gamut", value: "72%" },
        { label: "Response Time", value: "8 ms" },
        {
          label: "Viewing Angle",
          value: "178° (H) / 178° (V)",
        },
        {
          label: "H. Scanning Frequency",
          value: "30 kHz ~ 81 kHz",
        },
        {
          label: "V. Scanning Frequency",
          value: "48Hz ~ 75Hz",
        },
      ],
    },
    {
      category: "Connectivity",
      items: [
        {
          label: "Audio in/Out",
          value: "Stereo Mini Jack",
        },
        { label: "Video In", value: "HDMI1, HDMI2" },
      ],
    },
    {
      category: "Power",
      items: [
        {
          label: "Power Supply",
          value: "AC 100 - 240 V / 50 - 60 Hz",
        },
        {
          label: "Power Consumption (W)",
          value: "≤180 W",
        },
        { label: "Standby Power", value: "3W" },
      ],
    },
    {
      category: "Environment",
      items: [
        {
          label: "Operation Temperature",
          value: "0 ~ 50°C",
        },
        {
          label: "Storage Temperature",
          value: "-20 ~ 65°C",
        },
        { label: "Operation", value: "24/7" },
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
            <View style={styles.dotsContainer}>
              <View style={styles.dot1} />
              <View style={styles.dot2} />
              <View style={styles.dot3} />
            </View>

            <Text style={styles.sectionTitle}>Product Specification</Text>

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
