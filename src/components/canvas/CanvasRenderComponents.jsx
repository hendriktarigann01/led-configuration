// components/canvas/CanvasRenderComponents.jsx
import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { CANVAS_DEFAULTS, THEME_COLORS } from "../../constants/PDFConfig";
import { formatMetric, clampPercentage } from "../../utils/PDFHelpers";

const styles = StyleSheet.create({
  measurementLine: {
    position: "absolute",
    borderColor: THEME_COLORS.measurement,
    borderStyle: "dashed",
    zIndex: 50,
  },
  measurementText: {
    position: "absolute",
    fontSize: 8,
    color: THEME_COLORS.text,
    fontFamily: "Helvetica",
    zIndex: 60,
  },
  screenControlText: {
    position: "absolute",
    fontSize: 8,
    color: THEME_COLORS.text,
    fontFamily: "Helvetica",
    zIndex: 60,
    backgroundColor: "white",
    borderRadius: 2,
  },
  infoText: {
    position: "absolute",
    fontSize: 9,
    color: THEME_COLORS.text,
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
  },
});

export const BezelOverlay = ({ cabinetCount, imageWidth, imageHeight }) => {
  const { horizontal, vertical } = cabinetCount;
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
          borderLeftColor: THEME_COLORS.bezel,
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
          borderTopColor: THEME_COLORS.bezel,
          opacity: 0.4,
          borderTopStyle: "solid",
          zIndex: 999,
        }}
      />
    );
  }

  return <>{lines}</>;
};

export const MeasurementLines = ({ imageWidth, imageHeight }) => {
  const { verticalExtension, horizontalExtension } = CANVAS_DEFAULTS;

  const lines = [
    {
      key: "v-right",
      top: -verticalExtension - 20,
      right: 0,
      width: 1,
      height: imageHeight + verticalExtension,
      border: "borderRightWidth",
    },
    {
      key: "v-left",
      top: -verticalExtension - 20,
      left: 0,
      width: 1,
      height: imageHeight + verticalExtension,
      border: "borderLeftWidth",
    },
    {
      key: "h-top",
      top: 0,
      left: -horizontalExtension,
      height: 1,
      width: imageWidth + horizontalExtension,
      border: "borderTopWidth",
    },
    {
      key: "h-bottom",
      bottom: 0,
      left: -horizontalExtension,
      height: 1,
      width: imageWidth + horizontalExtension,
      border: "borderBottomWidth",
    },
  ];

  return lines.map(({ key, border, ...style }) => (
    <View key={key} style={[styles.measurementLine, style, { [border]: 1 }]} />
  ));
};

export const CanvasToWallMeasurements = ({
  containerWidth,
  containerHeight,
}) => (
  <>
    <View
      style={[
        styles.measurementLine,
        {
          bottom: 43,
          left: 0,
          height: 1,
          borderTopWidth: 1,
          width: containerWidth,
        },
      ]}
    />
    <View
      style={[
        styles.measurementLine,
        {
          top: 0,
          right: 50,
          width: 1,
          borderLeftWidth: 1,
          height: containerHeight,
        },
      ]}
    />
  </>
);

export const WallMeasurements = ({
  dynamicRemainingWall,
  containerWidth,
  containerHeight,
  screenPosition,
  wallWidth,
  wallHeight,
  actualScreenSize,
}) => {
  const textMarginHorizontal = 18;
  const textMarginVertical = 13;

  const screenOffsetXPercent = (screenPosition.x / containerWidth) * 100;
  const screenOffsetYPercent = (screenPosition.y / containerHeight) * 100;

  const pixelToMeterRatioX = containerWidth / wallWidth;
  const pixelToMeterRatioY = containerHeight / wallHeight;

  const screenWidthPercent =
    ((actualScreenSize.width * pixelToMeterRatioX) / containerWidth) * 100;
  const screenHeightPercent =
    ((actualScreenSize.height * pixelToMeterRatioY) / containerHeight) * 100;

  const leftScreenEdgeBase = 60 - screenWidthPercent / 2;
  const leftTextPositionBase = leftScreenEdgeBase / 2;

  const rightScreenEdgeBase = 40 + screenWidthPercent / 2;
  const rightTextPositionBase = (rightScreenEdgeBase + 100) / 2;

  const topScreenEdgeBase = 68 - screenHeightPercent / 2;
  const topTextPositionBase = topScreenEdgeBase / 2;

  const bottomScreenEdgeBase = 35 + screenHeightPercent / 2;
  const bottomTextPositionBase = (bottomScreenEdgeBase + 100) / 2;

  // ===== CONDITIONAL MOVEMENT LOGIC =====
  let leftPos = leftTextPositionBase;
  let rightPos = rightTextPositionBase;
  let topPos = topTextPositionBase;
  let bottomPos = bottomTextPositionBase;

  if (screenOffsetXPercent < 0) {
    const leftScreenEdge = leftScreenEdgeBase + screenOffsetXPercent;
    leftPos = leftScreenEdge / 2;
  } else if (screenOffsetXPercent > 0) {
    const rightScreenEdge = rightScreenEdgeBase + screenOffsetXPercent;
    rightPos = (rightScreenEdge + 100) / 2;
  }

  if (screenOffsetYPercent < 0) {
    const topScreenEdge = topScreenEdgeBase + screenOffsetYPercent;
    topPos = topScreenEdge / 2.5;
  } else if (screenOffsetYPercent > 0) {
    const bottomScreenEdge = bottomScreenEdgeBase + screenOffsetYPercent;
    bottomPos = (bottomScreenEdge + 100) / 2.5;
  }

  leftPos = clampPercentage(
    leftPos,
    textMarginVertical,
    100 - textMarginVertical
  );
  rightPos = clampPercentage(
    rightPos,
    textMarginVertical,
    100 - textMarginVertical
  );
  topPos = clampPercentage(
    topPos,
    textMarginHorizontal,
    100 - textMarginHorizontal
  );
  bottomPos = clampPercentage(
    bottomPos,
    textMarginHorizontal,
    100 - textMarginHorizontal
  );

  const measurements = [
    {
      key: "left-top",
      left: 10,
      top: `${topPos}%`,
      rotation: "-180deg",
      value: dynamicRemainingWall.bottom,
    },
    {
      key: "left-bottom",
      left: 10,
      top: `${bottomPos}%`,
      rotation: "-180deg",
      value: dynamicRemainingWall.top,
    },
    {
      key: "top-left",
      top: 15,
      left: `${leftPos}%`,
      rotation: null,
      value: dynamicRemainingWall.right,
    },
    {
      key: "top-right",
      top: 15,
      left: `${rightPos}%`,
      rotation: null,
      value: dynamicRemainingWall.left,
    },
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

export const ScreenSizeControls = ({ screenWidth, screenHeight }) => (
  <>
    <Text
      style={[
        styles.screenControlText,
        { top: "4.6%", left: "48%", transform: [{ translateX: "-50%" }] },
      ]}
    >
      {formatMetric(screenWidth)} m
    </Text>
    <Text
      style={[
        styles.screenControlText,
        {
          left: "2.6%",
          top: "50%",
          transform: [{ translateY: "-50%" }, { rotate: "90deg" }],
        },
      ]}
    >
      {formatMetric(screenHeight)} m
    </Text>
  </>
);

export const HumanElements = ({ humanHeight, wallHeight }) => {
  if (humanHeight === 0) return null;

  return (
    <>
      <Text style={[styles.infoText, { bottom: 20, right: 7 }]}>1,70 m</Text>
      <View style={styles.humanContainer}>
        <Image
          src="/human.png"
          style={[
            styles.humanImage,
            {
              height: Math.max(humanHeight, 35),
              position: "absolute",
              bottom: -5,
              resizeMode: wallHeight < 3 ? "cover" : "contain",
            },
          ]}
        />
      </View>
    </>
  );
};
