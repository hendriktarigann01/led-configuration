import { StyleSheet } from "@react-pdf/renderer";
import { THEME_COLORS } from "../constants/PDFConfig";

export const SharedStyles = StyleSheet.create({
  // Header Styles
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

  // Footer Styles
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

  // Decorative Elements
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotPrimary: {
    backgroundColor: THEME_COLORS.primary,
  },
  dotSecondary: {
    backgroundColor: THEME_COLORS.secondary,
  },
  dotTertiary: {
    backgroundColor: THEME_COLORS.tertiary,
  },

  // Section Title
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "medium",
    color: THEME_COLORS.text,
    lineHeight: 1,
    margin: 5,
  },

  // Table Styles
  tableContainer: {
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    borderRadius: 4,
  },
  table: {
    width: "100%",
  },
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
  mergedCategoryCell: {
    width: "33.333%",
    paddingVertical: 2,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderRight: "1px solid #E5E7EB",
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  categoryText: {
    fontSize: 9,
    color: THEME_COLORS.text,
    textAlign: "left",
  },
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
    width: "50%",
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRight: "1px solid #E5E7EB",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  labelText: {
    fontSize: 9,
    color: THEME_COLORS.text,
    textAlign: "left",
  },
  valueCell: {
    width: "50%",
    paddingVertical: 2,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  valueText: {
    fontSize: 9,
    color: THEME_COLORS.text,
    textAlign: "left",
    fontWeight: "medium",
  },
});