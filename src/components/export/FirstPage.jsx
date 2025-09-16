import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "./BasePage";

const styles = StyleSheet.create({
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
    marginBottom: 80,
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
  userInfo: {
    alignItems: "center",
    gap: 20,
    width: 300,
  },
  userName: {
    fontSize: 24,
    fontWeight: 300,
    color: "#374151",
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#999",
    marginVertical: 10,
  },
  information: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export const FirstPage = ({ data }) => (
  <BasePage>
    <View style={styles.centerContent}>
      <View style={{ alignItems: "center" }}>
        <Image style={styles.companyLogo} src="/logo/mjs_logo_text.png" />
        <Text style={styles.companyName}>MJ Solution Indonesia</Text>

        <View style={styles.tagline}>
          <Text style={styles.taglineText}>EXPLORE</Text>
          <View style={styles.taglineDot} />
          <Text style={styles.taglineText}>CREATE</Text>
          <View style={styles.taglineDot} />
          <Text style={styles.taglineText}>INSPIRE</Text>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{data?.userName || ""}</Text>
        <Text style={styles.information}>
          Date of Configuration {data?.exportDate || ""}
        </Text>
        <Text style={styles.information}>{data?.projectName || ""}</Text>
        <View style={styles.divider} />
        <Text style={styles.information}>
          {data?.displayType || ""}{" "}
          {data?.pixelPitch ? `${data.pixelPitch}` : ""}
        </Text>
      </View>
    </View>
  </BasePage>
);
