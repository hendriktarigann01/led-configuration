import React from "react";
import { Page, View, Image, StyleSheet } from "@react-pdf/renderer";

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
  topDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 150,
    height: "auto",
    zIndex: 1,
  },
  bottomDecoration: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 150,
    height: "auto",
    zIndex: 1,
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
      {/* Decorative elements */}
      {showDecorations && (
        <>
          <Image style={styles.topDecoration} src="/top_pdf.png" />
          <Image style={styles.bottomDecoration} src="/bottom_pdf.png" />
        </>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  </Page>
);
