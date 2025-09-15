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

export const Outdoor = ({ data }) => {
  const specifications = [
    {
      category: "Basic Specifications",
      items: [
        {
          label: "Pixel Pitch",
          value: data?.pixelPitch ? `${data.pixelPitch}` : "P 3.0",
        },
        {
          label: "Refresh Rate",
          value: data?.refreshRate || "1920Hz / 3840Hz / 7680Hz",
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
        {
          label: "Module thickness",
          value: "17MM",
        },
        { label: "Module weight", value: data?.moduleWeight || "0.45KG" },
        { label: "Drive type", value: "Constant drive" },
        {
          label: "Application",
          value: "Outdoor Fixed Installation",
        },
      ],
    },
    {
      category: "Cabinet",
      items: [
        {
          label: "Cabinet size (WH)",
          value: "960*960mm",
        },
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
          value: "Max: 800W/m², Average: 300W/m²",
        },
        {
          label: "Cabinet material",
          value: "Die-casting Magnesium Cabinet",
        },
        {
          label: "Life span",
          value: "≥ 100,000 Hours",
        },
        {
          label: "Cabinet weight",
          value: "25Kg/pcs",
        },
        {
          label: "Working voltage",
          value: "AC220v+-10%",
        },
        { label: "Humidity", value: "10%-75%" },
        {
          label: "Best viewing distance",
          value: data?.viewingDistance || "3-30m",
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
