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
    marginBottom: 20,
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
    marginHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  dot1: { backgroundColor: "#2A7A78" },
  dot2: { backgroundColor: "#3AAFA9" },
  dot3: { backgroundColor: "#E0F2F0" },
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
    width: 487.5,
    height: 277.5,
    alignSelf: "center",
    marginBottom: 20,
    gap: 20,
  },
  productImageContainer: {
    borderRadius: 8,
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
    fontSize: 20,
    fontFamily: "Helvetica",
    color: "#4B5563",
    marginBottom: 20,
  },
  productSpec: {
    fontSize: 24,
    color: "#374151",
    fontFamily: "Helvetica-Bold",
  },

  // Canvas section
  canvasSection: {
    marginBottom: 10,
  },
  canvasOuterWrapper: {
    position: "relative",
    width: 487.5,
    height: 277.5,
    alignSelf: "center",
    marginVertical: 5,
    marginHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  canvasMainContainer: {
    width: 390, // 487.5pt -20%
    height: 222, // 277.5pt -20%
    border: "1pt solid #D1D5DB",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "relative",
    // Ensure this has lower z-index than measurements
    zIndex: 1,
  },

  // Content styles
  contentWrapper: {
    position: "relative",
    // Make sure this doesn't exceed container bounds
    maxWidth: "100%",
    maxHeight: "100%",
  },
  imageContainer: {
    position: "relative",
    // Ensure image container doesn't exceed parent
    maxWidth: "100%",
    maxHeight: "100%",
  },
  contentImage: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },

  // Measurement lines - increased z-index
  measurementLine: {
    position: "absolute",
    borderColor: "#5EEAD4",
    borderStyle: "dashed",
    zIndex: 100, // Increased z-index
  },

  // Text styles - increased z-index
  measurementText: {
    position: "absolute",
    fontSize: 10,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 100, // Increased z-index
  },

  // Bezel styles - increased z-index
  bezelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // Increased z-index
  },
  bezelLine: {
    position: "absolute",
    borderColor: "#D9D9D9",
    opacity: 0.8, // Increased opacity from 0.4 to make more visible
  },

  // Info displays - increased z-index
  infoText: {
    position: "absolute",
    fontSize: 12,
    color: "#374151",
    fontFamily: "Helvetica",
    zIndex: 100, // Increased z-index
  },

  // Human silhouette - increased z-index
  humanContainer: {
    position: "absolute",
    right: -5,
    bottom: 24,
    width: 110,
    alignItems: "flex-end",
    zIndex: 999, // Increased z-index
  },
  humanImage: {
    width: "auto",
    maxWidth: 80,
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
    return data.pixelPitch || (data.inch ? `${data.inch}"` : "1.8");
  };

  // Calculate canvas data using CanvasUtils
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
    };
  };

  const canvasData = calculateCanvasData();

  // Fixed dimensions for PDF (since we can't use responsive functions)
  const containerWidth = 310; // Fixed container width
  const containerHeight = 168; // Fixed container height

  const maxWallWidth = 10;
  const maxWallHeight = 5.5;

  const wallScaleX = Math.min(1, canvasData.wallWidth / maxWallWidth);
  const wallScaleY = Math.min(1, canvasData.wallHeight / maxWallHeight);

  const effectiveCanvasWidth = containerWidth * wallScaleX;
  const effectiveCanvasHeight = containerHeight * wallScaleY;

  // Calculate screen to wall ratio
  const screenToWallRatioX =
    canvasData.actualScreenSize.width / canvasData.wallWidth;
  const screenToWallRatioY =
    canvasData.actualScreenSize.height / canvasData.wallHeight;

  // Calculate image dimensions with proper constraints
  const maxImageWidth = containerWidth - 30; // Account for padding
  const maxImageHeight = containerHeight - 30; // Account for padding

  const calculatedImageWidth = effectiveCanvasWidth * screenToWallRatioX;
  const calculatedImageHeight = effectiveCanvasHeight * screenToWallRatioY;

  const imageWidth = Math.min(calculatedImageWidth, maxImageWidth);
  const imageHeight = Math.min(calculatedImageHeight, maxImageHeight);

  // Calculate measurement values
  const horizontalMeasureLength = Math.min(imageWidth, effectiveCanvasWidth);
  const verticalMeasureLength = Math.min(imageHeight, effectiveCanvasHeight);
  const remainingWallHeight =
    (canvasData.wallHeight - canvasData.actualScreenSize.height) / 2;
  const remainingWallWidth =
    (canvasData.wallWidth - canvasData.actualScreenSize.width) / 2;

  // Calculate human dimensions
  const humanRealHeight = 1.7;
  const humanToWallRatio = humanRealHeight / canvasData.wallHeight;
  const humanDisplayHeight = containerHeight * humanToWallRatio;
  const finalHumanHeight = Math.max(8, humanDisplayHeight);

  // PDF Render functions
  const renderMeasurementLines = () => {
    const verticalExtension = 150; // Reduced extension for PDF
    const horizontalExtension = 170; // Reduced extension for PDF

    return (
      <>
        {/* Vertical Right Measure */}
        <View
          style={[
            styles.measurementLine,
            {
              top: -verticalExtension,
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
              top: -verticalExtension,
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
    if (
      canvasData.cabinetCount.horizontal <= 1 &&
      canvasData.cabinetCount.vertical <= 1
    ) {
      return null;
    }

    const bezels = [];

    // Vertical bezel lines
    if (canvasData.cabinetCount.horizontal > 1) {
      for (let i = 1; i < canvasData.cabinetCount.horizontal; i++) {
        const leftPosition = `${
          (i / canvasData.cabinetCount.horizontal) * 100
        }%`;
        bezels.push(
          <View
            key={`vertical-${i}`}
            style={[
              styles.bezelLine,
              {
                left: leftPosition,
                top: 0,
                width: 1,
                height: "100%",
                borderLeftWidth: 2, // Increased thickness
              },
            ]}
          />
        );
      }
    }

    // Horizontal bezel lines
    if (canvasData.cabinetCount.vertical > 1) {
      for (let i = 1; i < canvasData.cabinetCount.vertical; i++) {
        const topPosition = `${(i / canvasData.cabinetCount.vertical) * 100}%`;
        bezels.push(
          <View
            key={`horizontal-${i}`}
            style={[
              styles.bezelLine,
              {
                top: topPosition,
                left: 0,
                height: 1,
                width: "100%",
                borderTopWidth: 2, // Increased thickness
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
              bottom: 29,
              left: 0,
              height: 1,
              borderTopWidth: 1,
              width: effectiveCanvasWidth + 80,
            },
          ]}
        />

        {/* Vertical Right Measure Canvas to Wall */}
        <View
          style={[
            styles.measurementLine,
            {
              top: 0,
              right: 50,
              width: 1,
              borderLeftWidth: 1,
              height: effectiveCanvasHeight + 80,
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
              left: 4,
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
              left: 4,
              top: "70%",
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
              top: 4,
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
              top: 4,
              left: "70%",
            },
          ]}
        >
          {remainingWallWidth.toFixed(2)} m
        </Text>
      </>
    );
  };

  const renderInfoDisplays = () => {
    const resolutionString = `${Math.round(
      imageWidth *
        ((canvasData.actualScreenSize.width / canvasData.wallWidth) * 10)
    )} × ${Math.round(
      imageHeight *
        ((canvasData.actualScreenSize.height / canvasData.wallHeight) * 10)
    )} px`;

    return (
      <>
        {/* Resolution Info Display */}
        {/* <Text
          style={[
            styles.infoText,
            {
              bottom: -20,
              left: 0,
            },
          ]}
        >
          Resolution: {resolutionString}
        </Text> */}

        {/* Human Info Height */}
        <Text
          style={[
            styles.infoText,
            {
              bottom: 20,
              right: -5,
            },
          ]}
        >
          170 cm
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
              height: finalHumanHeight,
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
          <View style={[styles.dot, styles.dotColor1]} />
          <View style={[styles.dot, styles.dotColor2]} />
          <View style={[styles.dot, styles.dotColor3]} />
        </View>
        <Text style={styles.sectionTitle}>{label}</Text>
        <View style={styles.dotGroup}>
          <View style={[styles.dot, styles.dotColor3]} />
          <View style={[styles.dot, styles.dotColor2]} />
          <View style={[styles.dot, styles.dotColor1]} />
        </View>
      </View>
    </View>
  );

  // Main canvas render
  const renderCanvas = () => {
    return (
      <View style={styles.canvasOuterWrapper}>
        {/* Main Canvas Container */}
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
