import React from "react";
import { Page, View, Image, StyleSheet } from "@react-pdf/renderer";
import { DECORATION_PATHS } from "../../constants/PDFConfig";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontFamily: "Helvetica",
    position: "relative",
  },
  container: {
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
  },
  decoration: {
    position: "absolute",
    width: 150,
    height: "auto",
    zIndex: 6,
  },
  topDecoration: {
    top: 0,
    left: 0,
  },
  bottomDecoration: {
    bottom: 0,
    right: 0,
  },
  content: {
    flex: 1,
    zIndex: 5,
    position: "relative",
  },
});

export const BasePage = ({ children, showDecorations = true }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.container}>
      {showDecorations && (
        <>
          <Image 
            style={[styles.decoration, styles.topDecoration]} 
            src={DECORATION_PATHS.top} 
          />
          <Image 
            style={[styles.decoration, styles.bottomDecoration]} 
            src={DECORATION_PATHS.bottom} 
          />
        </>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  </Page>
);