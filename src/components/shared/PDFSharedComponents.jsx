import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { COMPANY_INFO, LOGO_PATHS, ICON_PATHS, THEME_COLORS } from "../../constants/PDFConfig";

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 24,
    right: 32,
    zIndex: 10,
  },
  logo: {
    width: "auto",
    height: 25,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    fontSize: 8,
    color: "#666",
  },
  footerTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  footerText: {
    marginBottom: 5,
  },
  footerContact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  icon: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  iconText: {
    marginRight: 6,
  },
  sectionHeader: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  decorativeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingVertical: 8,
    width: "100%",
  },
  dotGroup: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "medium",
    textAlign: "center",
    color: "#374151",
    marginHorizontal: 16,
    lineHeight: 1,
  },
  companyInfoContainer: {
    marginBottom: 30,
  },
  companyName: {
    fontSize: 32,
    fontWeight: 300,
    color: "#374151",
    marginBottom: 30,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  taglineDot: {
    width: 6,
    height: 6,
    backgroundColor: "#000",
    borderRadius: 3,
  },
  taglineText: {
    fontSize: 12,
    color: "#4B5563",
  },
});

export const PageHeader = () => (
  <View style={styles.header}>
    <Image style={styles.logo} src={LOGO_PATHS.text} />
  </View>
);

export const PageFooter = () => (
  <View style={styles.footer}>
    <Text style={styles.footerTitle}>{COMPANY_INFO.name}</Text>
    <Text style={styles.footerText}>{COMPANY_INFO.address}</Text>
    <View style={styles.footerContact}>
      <Image src={ICON_PATHS.web} style={styles.icon} />
      <Text style={styles.iconText}>{COMPANY_INFO.website}</Text>
      <Image src={ICON_PATHS.call} style={styles.icon} />
      <Text style={styles.iconText}>{COMPANY_INFO.phone}</Text>
    </View>
  </View>
);

export const DecorativeDots = ({ label }) => {
  const dotColors = [THEME_COLORS.primary, THEME_COLORS.secondary, THEME_COLORS.tertiary];
  
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.decorativeContainer}>
        <View style={styles.dotGroup}>
          {dotColors.map((color, i) => (
            <View key={`left-${i}`} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
        <Text style={styles.sectionTitle}>{label}</Text>
        <View style={styles.dotGroup}>
          {[...dotColors].reverse().map((color, i) => (
            <View key={`right-${i}`} style={[styles.dot, { backgroundColor: color }]} />
          ))}
        </View>
      </View>
    </View>
  );
};

export const CompanyInfo = ({ style }) => (
  <View style={[styles.companyInfoContainer, style]}>
    <Text style={styles.companyName}>
      {COMPANY_INFO.name}
    </Text>
    <View style={styles.taglineContainer}>
      {COMPANY_INFO.tagline.map((text, i) => (
        <React.Fragment key={text}>
          {i > 0 && <View style={styles.taglineDot} />}
          <Text style={styles.taglineText}>{text}</Text>
        </React.Fragment>
      ))}
    </View>
  </View>
);