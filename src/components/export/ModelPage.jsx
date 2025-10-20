// export/ModelPage.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "./BasePage";
import {
  PageHeader,
  PageFooter,
  DecorativeDots,
} from "../shared/PDFSharedComponents";
import {
  BezelOverlay,
  MeasurementLines,
  CanvasToWallMeasurements,
  WallMeasurements,
  ScreenSizeControls,
  HumanElements,
} from "../canvas/CanvasRenderComponents";
import {
  getProductImage,
  getDisplayTitle,
  getPixelPitch,
  calculateCanvasData,
  calculateDynamicContainerSize,
  calculateImageSize,
  calculateHumanHeight,
  calculateDynamicRemainingWall,
} from "../../utils/PDFHelpers";
import { CanvasUtils } from "../../utils/CanvasUtils";

const styles = StyleSheet.create({
  mainContent: {
    paddingHorizontal: 64,
    paddingTop: 160,
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
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
  },
  canvasMainContainerWithBg: {
    border: "1pt solid #D1D5DB",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    zIndex: 1,
    overflow: "hidden",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    zIndex: 99,
  },
});

const CanvasRenderer = ({ canvasData, roomImageUrl }) => {
  const dynamicContainer = calculateDynamicContainerSize(canvasData);
  const { width: containerWidth, height: containerHeight } = dynamicContainer;

  console.log("=== PDF CANVAS RENDERER DEBUG ===");
  console.log("1. Canvas Data:", {
    wallWidth: canvasData.wallWidth,
    wallHeight: canvasData.wallHeight,
    screenWidth: canvasData.screenWidth,
    screenHeight: canvasData.screenHeight,
    screenPosition: canvasData.screenPosition,
  });
  console.log("2. PDF Container Size:", { containerWidth, containerHeight });

  const imageSize = calculateImageSize(
    canvasData,
    containerWidth,
    containerHeight
  );
  const { width: imageWidth, height: imageHeight } = imageSize;

  console.log("3. PDF Image Size:", { imageWidth, imageHeight });

  // CRITICAL FIX: Get Canvas reference size (the actual canvas size used in Canvas.jsx)
  // This MUST match the getDynamicCanvasSize() calculation from Canvas.jsx
  const canvasRefSize = CanvasUtils.getDynamicCanvasSize(
    canvasData.wallWidth,
    canvasData.wallHeight,
    550, // Desktop max width (same as Canvas.jsx)
    300 // Desktop max height (same as Canvas.jsx)
  );

  console.log("4. Canvas Reference Size (from Canvas.jsx):", canvasRefSize);

  // CRITICAL FIX: Calculate proper screen offset with scaling
  // Formula: (screenPosition / canvasRefSize) * containerSize
  const scaleX = containerWidth / canvasRefSize.width;
  const scaleY = containerHeight / canvasRefSize.height;

  const screenOffsetX = canvasData.screenPosition.x * scaleX;
  const screenOffsetY = canvasData.screenPosition.y * scaleY;

  console.log("5. Scale Factors:", { scaleX, scaleY });
  console.log("6. Screen Offset (scaled):", { screenOffsetX, screenOffsetY });

  // Calculate final position for content wrapper
  const contentLeft = (containerWidth - imageWidth) / 2 + screenOffsetX;
  const contentTop = (containerHeight - imageHeight) / 2 + screenOffsetY;

  console.log("7. Content Final Position:", { contentLeft, contentTop });

  // CRITICAL FIX: Create scaled screen position for measurement calculations
  const scaledScreenPosition = {
    x: screenOffsetX,
    y: screenOffsetY,
  };

  // Create modified canvas data with scaled screen position
  const canvasDataForMeasurements = {
    ...canvasData,
    screenPosition: scaledScreenPosition,
  };

  // Use scaled screen position for wall measurements
  const dynamicRemainingWall = calculateDynamicRemainingWall(
    canvasDataForMeasurements,
    containerWidth,
    containerHeight
  );

  console.log(
    "8. Dynamic Remaining Wall (with scaled position):",
    dynamicRemainingWall
  );
  console.log("=== END PDF DEBUG ===\n");

  const humanHeight = calculateHumanHeight(canvasData, containerHeight);
  const wrapperPadding = 100;
  const wrapperWidth = containerWidth + wrapperPadding;
  const wrapperHeight = containerHeight + wrapperPadding;
  const measurementOffset = 35;

  const hasRoomImage = roomImageUrl && roomImageUrl !== null;

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
      {/* Total Wall Width Measurement */}
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
          left: wrapperPadding / 2 + containerWidth / 2 + 45,
          transform: "translateX(-50%)",
          fontSize: 9,
          color: "#3AAFA9",
          fontFamily: "Helvetica",
          zIndex: 6,
        }}
      >
        {parseFloat(canvasData.wallWidth.toFixed(3))} m
      </Text>

      {/* Total Wall Height Measurement */}
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
          top: wrapperPadding / 2 + containerHeight / 2 + 55,
          left: wrapperPadding / 2.6 - measurementOffset - 25,
          transform: "translateY(-50%) rotate(-90deg)",
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
            hasRoomImage
              ? styles.canvasMainContainerWithBg
              : styles.canvasMainContainer,
            {
              width: containerWidth,
              height: containerHeight,
              backgroundColor: hasRoomImage ? "transparent" : "white",
            },
          ]}
        >
          {/* Room Background Image */}
          {hasRoomImage && (
            <Image src={roomImageUrl} style={styles.backgroundImage} />
          )}

          {/* LED Screen Content - Positioned with absolute positioning */}
          <View
            style={{
              position: "absolute",
              left: contentLeft,
              top: contentTop,
              width: imageWidth,
              height: imageHeight,
              zIndex: 99,
            }}
          >
            <View
              style={{
                position: "relative",
                width: imageWidth,
                height: imageHeight,
              }}
            >
              <Image
                src={canvasData.contentSource}
                style={{ width: "100%", height: "100%", objectFit: "fill" }}
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
                <BezelOverlay
                  cabinetCount={canvasData.cabinetCount}
                  imageWidth={imageWidth}
                  imageHeight={imageHeight}
                />
              </View>
            </View>
            <MeasurementLines
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            />
          </View>
        </View>

        <ScreenSizeControls
          screenWidth={canvasData.screenWidth}
          screenHeight={canvasData.screenHeight}
        />
        <CanvasToWallMeasurements
          containerWidth={containerWidth}
          containerHeight={containerHeight}
        />
        <WallMeasurements
          dynamicRemainingWall={dynamicRemainingWall}
          containerWidth={containerWidth}
          containerHeight={containerHeight}
          screenPosition={scaledScreenPosition}
          wallWidth={canvasData.wallWidth}
          wallHeight={canvasData.wallHeight}
          actualScreenSize={canvasData.actualScreenSize}
        />
        <HumanElements humanHeight={humanHeight} />
      </View>
    </View>
  );
};

export const ModelPage = ({ data }) => {
  const canvasData = calculateCanvasData(data);
  return (
    <BasePage>
      <PageHeader />

      <View style={styles.mainContent}>
        <DecorativeDots label="Model" />

        <View style={styles.modelSection}>
          <View style={styles.productImageContainer}>
            <Image
              src={getProductImage(data?.displayType)}
              style={styles.productImage}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>
              {getDisplayTitle(data?.displayType)}
            </Text>
            <Text style={styles.productSpec}>{getPixelPitch(data)}</Text>
          </View>
        </View>

        <View style={styles.canvasSection}>
          <DecorativeDots label="Led Configuration Rendering" />
          <CanvasRenderer
            canvasData={canvasData}
            roomImageUrl={data?.roomImageUrl || null}
          />
        </View>
      </View>

      <PageFooter />
    </BasePage>
  );
};
