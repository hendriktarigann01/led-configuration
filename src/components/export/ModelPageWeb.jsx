import React from "react";

// Simple web version component with inline CSS
const ModelPageWeb = ({ data }) => {
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
    if (!data) return "Indoor LED Display";
    const { displayType } = data;
    if (displayType?.includes("Video Wall")) return "Video Wall";
    if (displayType?.includes("Outdoor")) return "Outdoor LED Display";
    return "Indoor LED Display";
  };

  const getPixelPitch = () => {
    if (!data) return "P 1.8";
    return data.pixelPitch || (data.inch ? `${data.inch}"` : "P 1.8");
  };

  const canvasData = {
    imageWidth: 256,
    imageHeight: 144,
    cabinetCount: data?.calculations?.unitCount || {
      horizontal: 1,
      vertical: 1,
    },
    contentSource: data?.customImageUrl || "/canvas/canvas-bg.png",
  };

  const renderDecorativeDots = (label) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40px",
          paddingTop: "8px",
          paddingBottom: "8px",
          width: "100%",
        }}
      >
        {/* Left dots */}
        <div
          style={{ display: "flex", marginLeft: "16px", marginRight: "16px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#2A7A78",
              marginLeft: "2px",
              marginRight: "2px",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#3AAFA9",
              marginLeft: "2px",
              marginRight: "2px",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#E0F2F0",
              marginLeft: "2px",
              marginRight: "2px",
            }}
          ></div>
        </div>

        <h2
          style={{
            fontSize: "18px",
            color: "#374151",
            fontWeight: "bold",
            textAlign: "center",
            marginLeft: "16px",
            marginRight: "16px",
          }}
        >
          {label}
        </h2>

        {/* Right dots */}
        <div
          style={{ display: "flex", marginLeft: "16px", marginRight: "16px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#E0F2F0",
              marginLeft: "2px",
              marginRight: "2px",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#3AAFA9",
              marginLeft: "2px",
              marginRight: "2px",
            }}
          ></div>
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#2A7A78",
              marginLeft: "2px",
              marginRight: "2px",
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderBezelOverlay = () => {
    if (
      canvasData.cabinetCount.horizontal <= 1 &&
      canvasData.cabinetCount.vertical <= 1
    )
      return null;

    const bezels = [];

    // Vertical bezel lines
    if (canvasData.cabinetCount.horizontal > 1) {
      for (let i = 1; i < canvasData.cabinetCount.horizontal; i++) {
        bezels.push(
          <div
            key={`vertical-${i}`}
            style={{
              position: "absolute",
              backgroundColor: "#D9D9D9",
              opacity: 0.4,
              left: `${(i / canvasData.cabinetCount.horizontal) * 100}%`,
              top: 0,
              width: "1px",
              height: "100%",
              zIndex: 30,
            }}
          />
        );
      }
    }

    // Horizontal bezel lines
    if (canvasData.cabinetCount.vertical > 1) {
      for (let i = 1; i < canvasData.cabinetCount.vertical; i++) {
        bezels.push(
          <div
            key={`horizontal-${i}`}
            style={{
              position: "absolute",
              backgroundColor: "#D9D9D9",
              opacity: 0.4,
              top: `${(i / canvasData.cabinetCount.vertical) * 100}%`,
              left: 0,
              height: "1px",
              width: "100%",
              zIndex: 30,
            }}
          />
        );
      }
    }

    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 30,
        }}
      >
        {bezels}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        position: "relative",
      }}
    >
      {/* Header with logo */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "32px",
          zIndex: 10,
        }}
      >
        <img
          src="/logo/mjs_logo_text.png"
          alt="Logo"
          style={{
            width: "auto",
            height: "40px",
          }}
        />
      </div>

      <div
        style={{
          paddingLeft: "64px",
          paddingRight: "64px",
          paddingTop: "160px",
        }}
      >
        {/* Model Section */}
        {renderDecorativeDots("Model")}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "550px",
            height: "300px",
            margin: "0 auto",
            marginBottom: "20px",
          }}
        >
          {/* Product Image */}
          <div
            style={{
              borderRadius: "8px",
              margin: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={getProductImage()}
              alt="Product"
              style={{
                width: "288px",
                height: "auto",
              }}
            />
          </div>

          {/* Product Info */}
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                fontSize: "20px",
                color: "#4B5563",
                marginBottom: "20px",
              }}
            >
              {getDisplayTitle()}
            </div>
            <div
              style={{
                fontSize: "24px",
                color: "#374151",
                fontWeight: "bold",
              }}
            >
              {getPixelPitch()}
            </div>
          </div>
        </div>

        {/* Canvas Section */}
        <div style={{ marginBottom: "80px" }}>
          {renderDecorativeDots("Led Configuration Rendering")}

          <div
            style={{
              position: "relative",
              width: "650px",
              height: "370px",
              margin: "20px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              zIndex: 99,
            }}
          >
            {/* Main Canvas Container */}
            <div
              style={{
                width: "550px",
                height: "300px",
                border: "1px solid #D1D5DB",
                padding: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                position: "relative",
                zIndex: 20,
              }}
            >
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "relative",
                    width: `${canvasData.imageWidth}px`,
                    height: `${canvasData.imageHeight}px`,
                  }}
                >
                  <img
                    src={canvasData.contentSource}
                    alt="Canvas Content"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      zIndex: 20,
                    }}
                  />
                  {renderBezelOverlay()}
                </div>
              </div>
            </div>

            {/* Human silhouette */}
            <div
              style={{
                position: "absolute",
                right: "-88px",
                bottom: "32px",
                width: "150px",
                display: "flex",
                alignItems: "flex-end",
                zIndex: 50,
              }}
            >
              <img
                src="/human.png"
                alt="Human scale"
                style={{
                  width: "auto",
                  maxWidth: "80px",
                  height: "144px",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Info displays */}
            <div
              style={{
                position: "absolute",
                bottom: "4px",
                left: "52px",
                fontSize: "12px",
                color: "#374151",
                zIndex: 50,
              }}
            >
              Resolution: {Math.round(canvasData.imageWidth)} ×{" "}
              {Math.round(canvasData.imageHeight)} px
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "4px",
                right: "4px",
                fontSize: "12px",
                color: "#374151",
                zIndex: 50,
              }}
            >
              170 cm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelPageWeb;
