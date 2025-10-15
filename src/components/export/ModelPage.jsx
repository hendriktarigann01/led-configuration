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
  contentWrapper: {
    position: "relative",
    maxWidth: "100%",
    maxHeight: "100%",
    zIndex: 99,
  },
});

const CanvasRenderer = ({ canvasData, roomImageUrl }) => {
  const dynamicContainer = calculateDynamicContainerSize(canvasData);
  const { width: containerWidth, height: containerHeight } = dynamicContainer;

  const imageSize = calculateImageSize(
    canvasData,
    containerWidth,
    containerHeight
  );
  const {
    width: imageWidth,
    height: imageHeight,
    screenToWallRatioX,
    screenToWallRatioY,
  } = imageSize;

  const { remainingWallHeight, remainingWallWidth } =
    CanvasUtils.getMeasurementValues(
      canvasData.actualScreenSize,
      canvasData.wallWidth,
      canvasData.wallHeight,
      imageWidth,
      imageHeight,
      containerWidth,
      containerHeight
    );

  const humanHeight = calculateHumanHeight(canvasData, containerHeight);
  const wrapperPadding = 100;
  const wrapperWidth = containerWidth + wrapperPadding;
  const wrapperHeight = containerHeight + wrapperPadding;
  const measurementOffset = 45;

  // Determine if we have room image
  const hasRoomImage = roomImageUrl && roomImageUrl !== null;

  console.log("CanvasRenderer - roomImageUrl:", roomImageUrl?.substring(0, 50));
  console.log(
    "CanvasRenderer - hasRoomImage:",
    roomImageUrl && roomImageUrl !== null
  );

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
          left: wrapperPadding / 2 + containerWidth / 2 - 8,
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
          {/* Room Background Image - Only render if exists */}
          {hasRoomImage && (
            <Image src={roomImageUrl} style={styles.backgroundImage} />
          )}

          {/* LED Screen Content - Always on top */}
          <View style={styles.contentWrapper}>
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
          remainingWallHeight={remainingWallHeight}
          remainingWallWidth={remainingWallWidth}
          screenToWallRatioX={screenToWallRatioX}
          screenToWallRatioY={screenToWallRatioY}
        />
        <HumanElements humanHeight={humanHeight} />
      </View>
    </View>
  );
};

export const ModelPage = ({ data }) => {
  const canvasData = calculateCanvasData(data);
  console.log(
    "ModelPage - data.roomImageUrl:",
    data?.roomImageUrl?.substring(0, 50)
  );
  console.log(
    "ModelPage - canvasData.roomImageUrl:",
    canvasData?.roomImageUrl?.substring(0, 50)
  );

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
