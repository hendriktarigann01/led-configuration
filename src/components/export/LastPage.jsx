import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "./BasePage";
import { LOGO_PATHS, COMPANY_INFO, ICON_PATHS } from "../../constants/PDFConfig";

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
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  companyLogo: {
    width: "auto",
    height: 40,
    marginBottom: 30,
  },
  companyName: {
    fontSize: 32,
    fontWeight: 300,
    color: "#374151",
    marginBottom: 30,
    textAlign: "center",
  },
  tagline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  taglineText: {
    fontSize: 12,
    color: "#4B5563",
  },
  taglineDot: {
    width: 6,
    height: 6,
    backgroundColor: "#000",
    borderRadius: 3,
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
  iconTeks: {
    marginRight: 6,
  },
});

export const LastPage = () => (
  <BasePage>
    <View style={styles.centerContent}>
      <View style={{ alignItems: "center" }}>
        <Image style={styles.companyLogo} src={LOGO_PATHS.text} />
        <Text style={styles.companyName}>{COMPANY_INFO.name}</Text>

        <View style={styles.tagline}>
          {COMPANY_INFO.tagline.map((text, index) => (
            <React.Fragment key={text}>
              {index > 0 && <View style={styles.taglineDot} />}
              <Text style={styles.taglineText}>{text}</Text>
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.footerTitle}>{COMPANY_INFO.name}</Text>
      <Text style={styles.footerText}>{COMPANY_INFO.address}</Text>
      <View style={styles.footerContact}>
        <Image src={ICON_PATHS.web} style={styles.icon} />
        <Text style={styles.iconTeks}>{COMPANY_INFO.website}</Text>
        <Image src={ICON_PATHS.call} style={styles.icon} />
        <Text style={styles.iconTeks}>{COMPANY_INFO.phone}</Text>
      </View>
    </View>
  </BasePage>
);