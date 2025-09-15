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
    marginBottom: 5,
    marginTop: 80,
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
  },
  table: {
    width: "100%",
  },
  sectionContainer: {
    position: "relative",
  },
  tableRow: {
    flexDirection: "row",
    height: 25,
    borderBottom: "1px solid #E5E7EB",
  },
  categoryCell: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "33.333%",
    paddingVertical: 1,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "flex-start",
    justifyContent: "center",
    borderRight: "1px solid #E5E7EB",
    borderBottom: "1px solid #E5E7EB",
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "medium",
    color: "#374151",
    textAlign: "left",
  },
  labelCell: {
    width: "33.333%",
    paddingVertical: 1,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRight: "1px solid #E5E7EB",
    borderBottom: "1px solid #E5E7EB",
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
    paddingVertical: 1,
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

export const Indoor = ({ data }) => {
  const specifications = [
    {
      category: "Basic Specifications",
      items: [
        {
          label: "Pixel Pitch",
          value: data?.pixelPitch ? `${data.pixelPitch}` : "P2.5",
        },
        {
          label: "Refresh Rate",
          value: data?.refreshRate || "1920 Hz / 2400 Hz / 3840 Hz",
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
        {
          label: "Led Configuration",
          value: "3 in 1",
        },
        { label: "Weight", value: "0.48 KG" },
        { label: "Application", value: "Indoor Fixed Installation" },
      ],
    },
    {
      category: "Cabinet",
      items: [
        {
          label: "Cabinet size (WH)",
          value: "640 X 480mm",
        },
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
          value: "Max.: 650W/m², Average; 300W/m²",
        },
        {
          label: "Life span",
          value: ">10,000 hours",
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
            <Text style={styles.sectionTitle}>Product Specification</Text>

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
                      { minHeight: 25 },
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
