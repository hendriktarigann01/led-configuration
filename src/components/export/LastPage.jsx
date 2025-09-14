import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "./BasePage";

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
    height: 64,
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

export const LastPage = ({ data }) => (
  <BasePage>
    <View style={styles.header}>
      <Image style={styles.logo} src="/logo/mjs_logo_text.png" />
    </View>

    <View style={styles.centerContent}>
      <View style={{ alignItems: "center" }}>
        <Image style={styles.companyLogo} src="/logo/mjs_logo.png" />
        <Text style={styles.companyName}>MJ Solution Indonesia</Text>

        <View style={styles.tagline}>
          <Text style={styles.taglineText}>EXPLORE</Text>
          <View style={styles.taglineDot} />
          <Text style={styles.taglineText}>CREATE</Text>
          <View style={styles.taglineDot} />
          <Text style={styles.taglineText}>INSPIRE</Text>
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
        <Image src="/icons/icon-web.png" style={styles.icon} />
        <Text style={styles.iconTeks}>mjsolution.co.id</Text>
        <Image src="/icons/icon-call.png" style={styles.icon} />
        <Text style={styles.iconTeks}>(+62) 811-1122-492</Text>
      </View>
    </View>
  </BasePage>
);
