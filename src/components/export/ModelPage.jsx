import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { BasePage } from "./BasePage";
import { CanvasUtils } from "../utils/CanvasUtils";

// PDF-specific styles
const styles = StyleSheet.create({
  // Layout
  header: {
    position: "absolute",
    top: 24,
    right: 32,
    zIndex: 10,
  },
  logo: {
    width: "auto",
    height: 40,
  },
  mainContent: {
    paddingHorizontal: 64,
    paddingTop: 160,
  },

  // Section decorations
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
  dot1: {
    width: 8,
    height: 8,
    backgroundColor: "#2A7A78",
    borderRadius: 4,
  },
  dot2: {
    width: 8,
    height: 8,
    backgroundColor: "#3AAFA9",
    borderRadius: 4,
  },
  dot3: {
    width: 8,
    height: 8,
    backgroundColor: "#E0F2F0",
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

  // Product section
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

  // Canvas section - SIMPLIFIED with fixed dimensions
  canvasOuterWrapper: {
    position: "relative",
    width: 310,
    height: 212,
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
    width: 235,
    height: 140,
  },

  // Content styles
  contentWrapper: {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90%",
  },
  imageContainer: {
    position: "relative",
    maxWidth: "100%",
    maxHeight: "100%",
  },
  contentImage: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },

  // Measurement lines
  measurementLine: {
    position: "absolute",
    borderColor: "#5EEAD4",
    borderStyle: "dashed",
    zIndex: 50,
  },

  // Text styles
  measurementText: {
    position: "absolute",
    fontSize: 8,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 60,
  },

  // Bezel styles
  bezelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 30,
  },
  bezelLine: {
    position: "absolute",
    backgroundColor: "#4A4A4A",
  },

  // Info displays
  infoText: {
    position: "absolute",
    fontSize: 9,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 60,
  },

  // Human silhouette
  humanContainer: {
    position: "absolute",
    right: 0,
    bottom: -10,
    width: 45,
    alignItems: "flex-end",
    zIndex: 70,
  },
  humanImage: {
    width: "auto",
    maxWidth: 35,
    objectFit: "contain",
  },

  // Screen size control display styles
  screenControlText: {
    position: "absolute",
    fontSize: 8,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 60,
    backgroundColor: "white",
    borderRadius: 2,
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
  // Data processing helpers
  const getProductImage = () => {
    if (!data) return "/product/model/indoor.png";
    const { displayType } = data;
    if (displayType?.includes("Video Wall"))
      return "/product/model/video_wall.png";
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

  if (data.pixelPitch && data.pixelPitch !== "N/A") {
    return data.pixelPitch;
  }

  if (data.inch && data.inch !== "N/A") {
    return `${data.inch}`;
  }

  return "1.8";
};

  // SIMPLIFIED: Calculate canvas data with fixed container dimensions
  const calculateCanvasData = () => {
    if (!data || !data.calculations || !data.calculations.unitCount) {
      return {
        wallWidth: 5,
        wallHeight: 3,
        actualScreenSize: { width: 1, height: 1 },
        cabinetCount: { horizontal: 1, vertical: 1 },
        contentSource: "/canvas/canvas-bg.png",
        isVideo: false,
        roomImageUrl: null,
        screenWidth: 1,
        screenHeight: 1,
      };
    }

    const wallWidth = parseFloat(data.wallConfig?.width) || 5;
    const wallHeight = parseFloat(data.wallConfig?.height) || 3;
    const screenWidth = parseFloat(data.screenConfig?.width) || 1;
    const screenHeight = parseFloat(data.screenConfig?.height) || 1;

    const actualScreenSize = { width: screenWidth, height: screenHeight };
    const cabinetCount = data.calculations.unitCount || {
      horizontal: 1,
      vertical: 1,
    };

    const contentSource = data?.selectedContent
      ? CanvasUtils.getContentSource(data.selectedContent, data.customImageUrl)
      : "/canvas/canvas-bg.png";

    const isVideo = data.selectedContent === "Default Video";

    return {
      wallWidth,
      wallHeight,
      actualScreenSize,
      cabinetCount,
      contentSource,
      isVideo,
      roomImageUrl: data.roomImageUrl,
      screenWidth,
      screenHeight,
    };
  };

  const canvasData = calculateCanvasData();

  // SIMPLIFIED: Fixed container dimensions
  const containerWidth = 235;
  const containerHeight = 140;

  // SIMPLIFIED: Calculate image dimensions with fixed container
  const screenToWallRatioX =
    canvasData.actualScreenSize.width / canvasData.wallWidth;
  const screenToWallRatioY =
    canvasData.actualScreenSize.height / canvasData.wallHeight;

  const idealImageWidth = containerWidth * screenToWallRatioX * 0.8; // 80% of container for margin
  const idealImageHeight = containerHeight * screenToWallRatioY * 0.8;

  // Ensure minimum size and respect container limits
  const imageWidth = Math.min(
    Math.max(idealImageWidth, 50),
    containerWidth * 0.9
  );
  const imageHeight = Math.min(
    Math.max(idealImageHeight, 50),
    containerHeight * 0.9
  );

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

  const { finalHumanHeight } = CanvasUtils.getHumanDimensions(
    canvasData.wallHeight
  );

  // PDF Render functions
  const renderMeasurementLines = () => {
    const verticalExtension = 80;
    const horizontalExtension = 100;

    return (
      <>
        {/* Vertical Right Measure */}
        <View
          style={[
            styles.measurementLine,
            {
              top: -verticalExtension - 20,
              right: 0,
              width: 1,
              borderRightWidth: 1,
              height: imageHeight + verticalExtension,
            },
          ]}
        />

        {/* Vertical Left Measure */}
        <View
          style={[
            styles.measurementLine,
            {
              top: -verticalExtension - 20,
              left: 0,
              width: 1,
              borderLeftWidth: 1,
              height: imageHeight + verticalExtension,
            },
          ]}
        />

        {/* Horizontal Top Measure */}
        <View
          style={[
            styles.measurementLine,
            {
              top: 0,
              left: -horizontalExtension,
              height: 1,
              borderTopWidth: 1,
              width: imageWidth + horizontalExtension,
            },
          ]}
        />

        {/* Horizontal Bottom Measure */}
        <View
          style={[
            styles.measurementLine,
            {
              bottom: 0,
              left: -horizontalExtension,
              height: 1,
              borderBottomWidth: 1,
              width: imageWidth + horizontalExtension,
            },
          ]}
        />
      </>
    );
  };

  const renderBezelOverlay = () => {
    const { horizontal, vertical } = canvasData.cabinetCount;

    if (horizontal <= 1 && vertical <= 1) {
      return null;
    }

    const bezels = [];

    // Vertical bezel lines (between columns)
    if (horizontal > 1) {
      for (let i = 1; i < horizontal; i++) {
        const leftPercentage = (i / horizontal) * 100;
        bezels.push(
          <View
            key={`vertical-${i}`}
            style={[
              styles.bezelLine,
              {
                left: `${leftPercentage}%`,
                top: 0,
                width: 3,
                height: "100%",
              },
            ]}
          />
        );
      }
    }

    // Horizontal bezel lines (between rows)
    if (vertical > 1) {
      for (let i = 1; i < vertical; i++) {
        const topPercentage = (i / vertical) * 100;
        bezels.push(
          <View
            key={`horizontal-${i}`}
            style={[
              styles.bezelLine,
              {
                top: `${topPercentage}%`,
                left: 0,
                height: 3,
                width: "100%",
              },
            ]}
          />
        );
      }
    }

    return <View style={styles.bezelOverlay}>{bezels}</View>;
  };

  const renderCanvasToWallMeasurements = () => {
    return (
      <>
        {/* Horizontal Bottom Measure Canvas to Wall */}
        <View
          style={[
            styles.measurementLine,
            {
              bottom: 37,
              left: 0,
              height: 1,
              borderTopWidth: 1,
              width: containerWidth,
            },
          ]}
        />

        {/* Vertical Right Measure Canvas to Wall */}
        <View
          style={[
            styles.measurementLine,
            {
              top: 0,
              right: 38,
              width: 1,
              borderLeftWidth: 1,
              height: containerHeight,
            },
          ]}
        />
      </>
    );
  };

  const renderWallMeasurements = () => {
    return (
      <>
        {/* Height measurements - Left Side */}
        <Text
          style={[
            styles.measurementText,
            {
              left: 10,
              top: "20%",
              transform: [{ rotate: "-180deg" }],
            },
          ]}
        >
          {remainingWallHeight.toFixed(2)} m
        </Text>

        <Text
          style={[
            styles.measurementText,
            {
              left: 10,
              bottom: "20%",
              transform: [{ rotate: "-180deg" }],
            },
          ]}
        >
          {remainingWallHeight.toFixed(2)} m
        </Text>

        {/* Width measurements - Top */}
        <Text
          style={[
            styles.measurementText,
            {
              top: 15,
              left: "20%",
            },
          ]}
        >
          {remainingWallWidth.toFixed(2)} m
        </Text>

        <Text
          style={[
            styles.measurementText,
            {
              top: 15,
              right: "20%",
            },
          ]}
        >
          {remainingWallWidth.toFixed(2)} m
        </Text>
      </>
    );
  };

  const renderScreenSizeControls = () => {
    return (
      <>
        {/* Width Control Display */}
        <Text
          style={[
            styles.screenControlText,
            {
              top: -40,
              left: "45%",
              transform: [{ translateX: "-50%" }],
            },
          ]}
        >
          {parseFloat(canvasData.screenWidth.toFixed(3)).toString()} m
        </Text>

        {/* Height Control Display */}
        <Text
          style={[
            styles.screenControlText,
            {
              left: -60,
              top: "50%",
              transform: [{ translateY: "-50%" }, { rotate: "90deg" }],
            },
          ]}
        >
          {parseFloat(canvasData.screenHeight.toFixed(3)).toString()} m
        </Text>
      </>
    );
  };

  const renderInfoDisplays = () => {
    return (
      <>
        {/* Human Info Height */}
        <Text
          style={[
            styles.infoText,
            {
              bottom: 25,
              right: 5,
            },
          ]}
        >
          1,70 m
        </Text>
      </>
    );
  };

  const renderHumanSilhouette = () => {
    return (
      <View style={styles.humanContainer}>
        <Image
          src="/human.png"
          style={[
            styles.humanImage,
            {
              height: Math.max(finalHumanHeight),
            },
          ]}
        />
      </View>
    );
  };

  const renderDecorativeDots = (label) => (
    <View style={styles.sectionHeader}>
      <View style={styles.decorativeContainer}>
        <View style={styles.dotGroup}>
          <View style={styles.dot1} />
          <View style={styles.dot2} />
          <View style={styles.dot3} />
        </View>
        <Text style={styles.sectionTitle}>{label}</Text>
        <View style={styles.dotGroup}>
          <View style={styles.dot3} />
          <View style={styles.dot2} />
          <View style={styles.dot1} />
        </View>
      </View>
    </View>
  );

  const renderCanvas = () => {
    return (
      <View style={styles.canvasOuterWrapper}>
        {/* Main Canvas Container - Now with fixed dimensions */}
        <View style={styles.canvasMainContainer}>
          <View style={styles.contentWrapper}>
            <View
              style={[
                styles.imageContainer,
                {
                  width: imageWidth,
                  height: imageHeight,
                },
              ]}
            >
              <Image
                src={canvasData.contentSource}
                style={styles.contentImage}
              />
              {renderBezelOverlay()}
            </View>
            {renderMeasurementLines()}
            {renderScreenSizeControls()}
          </View>
        </View>

        {renderCanvasToWallMeasurements()}
        {renderWallMeasurements()}
        {renderInfoDisplays()}
        {renderHumanSilhouette()}
      </View>
    );
  };

  return (
    <BasePage>
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo/mjs_logo_text.png" />
      </View>

      <View style={styles.mainContent}>
        {/* Model Section */}
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

        {/* Canvas Section */}
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
