import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "./BasePage";
import { CanvasUtils } from "../../utils/CanvasUtils";

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
  mainContent: {
    paddingHorizontal: 64,
    paddingTop: 160,
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
  modelSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 450,
    height: 250,
    alignSelf: "center",
    marginBottom: 5,
    gap: 20,
  },
  productImageContainer: {
    margin: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: 200,
    height: "auto",
  },
  productInfo: {
    textAlign: "left",
  },
  productTitle: {
    fontSize: 16,
    fontFamily: "Helvetica",
    color: "#4B5563",
    marginBottom: 20,
  },
  productSpec: {
    fontSize: 16,
    color: "#4B5563",
    fontFamily: "Helvetica-Bold",
  },
  canvasOuterWrapper: {
    position: "relative",
    marginTop: 15,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  canvasMainContainer: {
    border: "1pt solid #D1D5DB",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "relative",
    zIndex: 1,
  },
  contentWrapper: {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90%",
  },
  measurementLine: {
    position: "absolute",
    borderColor: "#5EEAD4",
    borderStyle: "dashed",
    zIndex: 50,
  },
  measurementText: {
    position: "absolute",
    fontSize: 8,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 60,
  },
  screenControlText: {
    position: "absolute",
    fontSize: 8,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 60,
    backgroundColor: "white",
    borderRadius: 2,
  },
  infoText: {
    position: "absolute",
    fontSize: 9,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 60,
  },
  humanContainer: {
    position: "absolute",
    right: 0,
    bottom: 45,
    width: 45,
    height: 175,
    zIndex: 70,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  humanImage: {
    width: "auto",
    height: "auto",
    objectFit: "contain",
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

export const ModelPage = ({ data }) => {
  const getProductImage = () => {
    if (!data) return "/product/model/indoor.png";
    const { displayType } = data;
    if (displayType?.includes("Video Wall")) return "/product/model/video_wall.png";
    if (displayType?.includes("Outdoor")) return "/product/model/outdoor.png";
    return "/product/model/indoor.png";
  };

  const getDisplayTitle = () => {
    if (!data) return "Indoor Cabinet Fixed";
    const { displayType } = data;
    if (displayType?.includes("Video Wall")) return "Video Wall";
    if (displayType?.includes("Outdoor")) return "Outdoor LED Display";
    return "Indoor LED Display";
  };

  const getPixelPitch = () => {
    if (!data) return "P 1.8";
    if (data.pixelPitch && data.pixelPitch !== "N/A") return data.pixelPitch;
    if (data.inch && data.inch !== "N/A") return `${data.inch}`;
    return "1.8";
  };

  const calculateCanvasData = () => {
    if (!data || !data.calculations || !data.calculations.unitCount) {
      return {
        wallWidth: 5,
        wallHeight: 3,
        actualScreenSize: { width: 1, height: 1 },
        cabinetCount: { horizontal: 1, vertical: 1 },
        contentSource: "/canvas/canvas-bg-compress.png",
        screenWidth: 1,
        screenHeight: 1,
      };
    }

    const wallWidth = parseFloat(data.wallConfig?.width) || 5;
    const wallHeight = parseFloat(data.wallConfig?.height) || 3;
    const screenWidth = parseFloat(data.screenConfig?.width) || 1;
    const screenHeight = parseFloat(data.screenConfig?.height) || 1;

    const contentSource = data?.selectedContent
      ? CanvasUtils.getContentSource(data.selectedContent, data.customImageUrl)
      : "/canvas/canvas-bg-compress.png";

    return {
      wallWidth,
      wallHeight,
      actualScreenSize: { width: screenWidth, height: screenHeight },
      cabinetCount: data.calculations.unitCount || { horizontal: 1, vertical: 1 },
      contentSource,
      screenWidth,
      screenHeight,
    };
  };

  const canvasData = calculateCanvasData();

  const getDynamicContainerSize = () => {
    const maxWidth = 295;
    const maxHeight = 175;
    const wallAspectRatio = canvasData.wallWidth / canvasData.wallHeight;

    let containerW, containerH;

    if (wallAspectRatio >= 1) {
      containerW = maxWidth;
      containerH = containerW / wallAspectRatio;
      if (containerH > maxHeight) {
        containerH = maxHeight;
        containerW = containerH * wallAspectRatio;
      }
    } else {
      containerH = maxHeight;
      containerW = containerH * wallAspectRatio;
      if (containerW > maxWidth) {
        containerW = maxWidth;
        containerH = containerW / wallAspectRatio;
      }
    }

    return {
      width: Math.round(containerW),
      height: Math.round(containerH),
    };
  };

  const dynamicContainer = getDynamicContainerSize();
  const containerWidth = dynamicContainer.width;
  const containerHeight = dynamicContainer.height;

  const screenToWallRatioX = canvasData.actualScreenSize.width / canvasData.wallWidth;
  const screenToWallRatioY = canvasData.actualScreenSize.height / canvasData.wallHeight;

  const idealImageWidth = containerWidth * screenToWallRatioX * 0.7;
  const idealImageHeight = containerHeight * screenToWallRatioY * 0.7;

  const imageWidth = Math.min(Math.max(idealImageWidth, 50), containerWidth);
  const imageHeight = Math.min(Math.max(idealImageHeight, 50), containerHeight);

  const { remainingWallHeight, remainingWallWidth } = CanvasUtils.getMeasurementValues(
    canvasData.actualScreenSize,
    canvasData.wallWidth,
    canvasData.wallHeight,
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight
  );

  const shouldShowHuman = canvasData.wallHeight >= 3;

  const getHumanHeight = () => {
    if (!shouldShowHuman) return 0;    
    const humanRealHeight = 1.7; 
    const humanPercentageOfWall = humanRealHeight / canvasData.wallHeight;
    const calculatedHumanHeight = containerHeight * humanPercentageOfWall;
    const minHumanHeight = Math.max(35, containerHeight * 0.2);
    return Math.max(calculatedHumanHeight, minHumanHeight);
  };

  const renderBezelOverlay = () => {
    const { horizontal, vertical } = canvasData.cabinetCount;
    if (horizontal <= 1 && vertical <= 1) return null;

    const lines = [];

    for (let i = 1; i < horizontal; i++) {
      lines.push(
        <View
          key={`v-${i}`}
          style={{
            position: "absolute",
            left: (imageWidth / horizontal) * i,
            top: 0,
            height: imageHeight,
            borderLeftWidth: 0.5,
            borderLeftColor: "#D9D9D9",
            opacity: 0.4,
            borderLeftStyle: "solid",
            zIndex: 999,
          }}
        />
      );
    }

    for (let i = 1; i < vertical; i++) {
      lines.push(
        <View
          key={`h-${i}`}
          style={{
            position: "absolute",
            top: (imageHeight / vertical) * i,
            left: 0,
            width: imageWidth,
            borderTopWidth: 0.5,
            borderTopColor: "#D9D9D9",
            opacity: 0.4,
            borderTopStyle: "solid",
            zIndex: 999,
          }}
        />
      );
    }

    return <>{lines}</>;
  };

  const renderMeasurementLines = () => {
    const verticalExtension = 80;
    const horizontalExtension = 100;

    const lines = [
      { key: "v-right", top: -verticalExtension - 20, right: 0, width: 1, height: imageHeight + verticalExtension, border: "borderRightWidth" },
      { key: "v-left", top: -verticalExtension - 20, left: 0, width: 1, height: imageHeight + verticalExtension, border: "borderLeftWidth" },
      { key: "h-top", top: 0, left: -horizontalExtension, height: 1, width: imageWidth + horizontalExtension, border: "borderTopWidth" },
      { key: "h-bottom", bottom: 0, left: -horizontalExtension, height: 1, width: imageWidth + horizontalExtension, border: "borderBottomWidth" },
    ];

    return lines.map(({ key, border, ...style }) => (
      <View key={key} style={[styles.measurementLine, style, { [border]: 1 }]} />
    ));
  };

  const renderCanvasToWallMeasurements = () => (
    <>
      <View
        style={[
          styles.measurementLine,
          { bottom: 43, left: 0, height: 1, borderTopWidth: 1, width: containerWidth },
        ]}
      />
      <View
        style={[
          styles.measurementLine,
          { top: 0, right: 50, width: 1, borderLeftWidth: 1, height: containerHeight },
        ]}
      />
    </>
  );

  const renderWallMeasurements = () => {
    const remainingSpaceRatioX = (1 - screenToWallRatioX) / 2;
    const remainingSpaceRatioY = (1 - screenToWallRatioY) / 2;  

    const textMarginHorizontal = 25;
    const textMarginVertical = 18;

    const clampPercentage = (value, min, max) => Math.max(min, Math.min(value, max));

    const leftPercentage = clampPercentage(
      (remainingSpaceRatioX / 2) * 100,
      textMarginVertical,
      Math.max(textMarginVertical, remainingSpaceRatioX * 100 - textMarginVertical)
    );
    const rightPercentage = clampPercentage(
      (1 - remainingSpaceRatioX / 2) * 100,
      Math.min(100 - textMarginVertical, (1 - remainingSpaceRatioX) * 100 + textMarginVertical),
      100 - textMarginVertical
    );
    const topPercentage = clampPercentage(
      (remainingSpaceRatioY / 2) * 100,
      textMarginHorizontal,
      Math.max(textMarginHorizontal, remainingSpaceRatioY * 100 - textMarginHorizontal)
    );
    const bottomPercentage = clampPercentage(
      (1 - remainingSpaceRatioY / 2) * 100,
      Math.min(100 - textMarginHorizontal, (1 - remainingSpaceRatioY) * 100 + textMarginHorizontal),
      100 - textMarginHorizontal
    );

    const measurements = [
      { key: "left-top", left: 10, top: `${topPercentage - 5}%`, rotation: "-180deg", value: remainingWallHeight },
      { key: "left-bottom", left: 10, top: `${bottomPercentage}%`, rotation: "-180deg", value: remainingWallHeight },
      { key: "top-left", top: 15, left: `${leftPercentage - 3}%`, rotation: null, value: remainingWallWidth },
      { key: "top-right", top: 15, left: `${rightPercentage - 4}%`, rotation: null, value: remainingWallWidth },
    ];

    return measurements.map(({ key, rotation, value, ...style }) => (
      <Text
        key={key}
        style={[
          styles.measurementText,
          style,
          {
            transform: rotation
              ? [{ translateY: "-50%" }, { rotate: rotation }]
              : [{ translateX: "-50%" }],
          },
        ]}
      >
        {value.toFixed(2)} m
      </Text>
    ));
  };

  const renderScreenSizeControls = () => (
    <>
      <Text
        style={[
          styles.screenControlText,
          { top: "4.6%", left: "48%", transform: [{ translateX: "-50%" }] },
        ]}
      >
        {parseFloat(canvasData.screenWidth.toFixed(3)).toString()} m
      </Text>
      <Text
        style={[
          styles.screenControlText,
          { left: "2.6%", top: "50%", transform: [{ translateY: "-50%" }, { rotate: "90deg" }] },
        ]}
      >
        {parseFloat(canvasData.screenHeight.toFixed(3)).toString()} m
      </Text>
    </>
  );

  const renderHumanElements = () => {
    if (!shouldShowHuman) return null;

    const humanHeight = getHumanHeight();

    return (
      <>
        <Text style={[styles.infoText, { bottom: 20, right: 7 }]}>
          1,70 m
        </Text>
        <View style={styles.humanContainer}>
          <Image
            src="/human.png"
            style={[
              styles.humanImage,
              { height: Math.max(humanHeight, 35), position: "absolute", bottom: -5 },
            ]}
          />
        </View>
      </>
    );
  };

  const renderDecorativeDots = (label) => {
    const dotColors = ["#2A7A78", "#3AAFA9", "#E0F2F0"];
    
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

  const renderCanvas = () => {
    const wrapperPadding = 100;
    const wrapperWidth = containerWidth + wrapperPadding;
    const wrapperHeight = containerHeight + wrapperPadding;
    const measurementOffset = 45;

    return (
      <View
        style={{
          position: "relative",
          width: wrapperWidth,
          height: wrapperHeight,
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Total Wall Measurements */}
        <View
          style={{
            position: "absolute",
            top: wrapperPadding / 2 - measurementOffset,
            left: wrapperPadding / 2,
            width: containerWidth,
            height: 1,
            borderTopWidth: 1,
            borderTopColor: "#3AAFA9",
            zIndex: 5,
          }}
        />
        <Text
          style={{
            position: "absolute",
            top: wrapperPadding / 2 - measurementOffset - 13,
            left: (wrapperPadding / 2) + (containerWidth / 2) - 8,
            transform: [{ translateX: "-50%" }],
            fontSize: 9,
            color: "#3AAFA9",
            fontFamily: "Helvetica",
            zIndex: 6,
          }}
        >
          {parseFloat(canvasData.wallWidth.toFixed(3))} m
        </Text>

        <View
          style={{
            position: "absolute",
            top: wrapperPadding / 2 + 8,
            left: wrapperPadding / 2.6 - measurementOffset,
            width: 1,
            height: containerHeight,
            borderLeftWidth: 1,
            borderLeftColor: "#3AAFA9",
            zIndex: 5,
          }}
        />
        <Text
          style={{
            position: "absolute",
            top: wrapperPadding / 2 + containerHeight / 2 + 7,
            left: wrapperPadding / 2.6 - measurementOffset - 25,
            transform: [{ translateY: "-50%" }, { rotate: "-90deg" }],
            fontSize: 9,
            color: "#3AAFA9",
            fontFamily: "Helvetica",
            zIndex: 6,
          }}
        >
          {parseFloat(canvasData.wallHeight.toFixed(3))} m
        </Text>

        {/* Canvas Container */}
        <View
          style={[
            styles.canvasOuterWrapper,
            { width: wrapperWidth, height: wrapperHeight, overflow: "hidden" },
          ]}
        >
          <View
            style={[
              styles.canvasMainContainer,
              { width: containerWidth, height: containerHeight },
            ]}
          >
            <View style={styles.contentWrapper}>
              <View style={{ position: "relative", width: imageWidth, height: imageHeight }}>
                <Image
                  src={canvasData.contentSource}
                  style={{ width: imageWidth, height: imageHeight, objectFit: "fill" }}
                />
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: imageWidth,
                    height: imageHeight,
                    pointerEvents: "none",
                  }}
                >
                  {renderBezelOverlay()}
                </View>
              </View>
              {renderMeasurementLines()}
            </View>
          </View>

          {renderScreenSizeControls()}
          {renderCanvasToWallMeasurements()}
          {renderWallMeasurements()}
          {renderHumanElements()}
        </View>
      </View>
    );
  };

  return (
    <BasePage>
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo/mjs_logo_text.png" />
      </View>

      <View style={styles.mainContent}>
        {renderDecorativeDots("Model")}
        <View style={styles.modelSection}>
          <View style={styles.productImageContainer}>
            <Image src={getProductImage()} style={styles.productImage} />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{getDisplayTitle()}</Text>
            <Text style={styles.productSpec}>{getPixelPitch()}</Text>
          </View>
        </View>

        <View style={styles.canvasSection}>
          {renderDecorativeDots("Led Configuration Rendering")}
          {renderCanvas()}
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
};