import React, { useState, useEffect } from "react";

export const BasePage = ({ children, className = "" }) => {
  const [imageStates, setImageStates] = useState({
    topLoaded: false,
    bottomLoaded: false,
    topBase64: "",
    bottomBase64: "",
  });

  useEffect(() => {
    const loadImageWithFallback = async (src, key) => {
      try {
        // Metode 1: Coba load gambar normal
        const normalLoad = new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve({ success: true, method: "normal" });
          img.onerror = reject;
          img.src = src;
        });

        await normalLoad;

        setImageStates((prev) => ({
          ...prev,
          [`${key}Loaded`]: true,
        }));

        console.log(`✅ ${key} image loaded normally`);
      } catch (normalError) {
        console.warn(`⚠️ Normal load failed for ${key}, trying base64...`);

        try {
          // Metode 2: Fallback ke base64
          const response = await fetch(src);
          const blob = await response.blob();
          const base64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          setImageStates((prev) => ({
            ...prev,
            [`${key}Base64`]: base64,
            [`${key}Loaded`]: true,
          }));

          console.log(`✅ ${key} image loaded as base64`);
        } catch (base64Error) {
          console.error(`❌ Failed to load ${key} image:`, base64Error);
          // Set as loaded anyway to prevent infinite loading
          setImageStates((prev) => ({
            ...prev,
            [`${key}Loaded`]: true,
          }));
        }
      }
    };

    // Load both images
    loadImageWithFallback("/top_pdf.png", "top");
    loadImageWithFallback("/bottom_pdf.png", "bottom");
  }, []);

  // Render dengan fallback logic
  const renderImage = (position, alt, className, base64Key) => {
    const base64Src = imageStates[base64Key];
    const src =
      base64Src || (position === "top" ? "/top_pdf.png" : "/bottom_pdf.png");

    return (
      <div className={className}>
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxWidth: "208px", // w-52 = 208px
            userSelect: "none",
            pointerEvents: "none",
          }}
          crossOrigin="anonymous"
          loading="eager"
          // Prevent dragging
          draggable={false}
          onError={(e) => {
            console.error(`Error rendering ${alt} image:`, e);
            
          }}
        />
      </div>
    );
  };

  return (
    <div
      className={`bg-white shadow-lg relative overflow-hidden ${className}`}
      style={{
        width: "210mm",
        height: "297mm",
        minHeight: "297mm",
        position: "relative",
      }}
      data-images-loaded={imageStates.topLoaded && imageStates.bottomLoaded}
    >
      {/* Top Decorative Element */}
      {renderImage("top", "top", "absolute top-0 left-0 w-40 z-20", "topBase64")}

      {/* Bottom Decorative Element */}
      {renderImage(
        "bottom",
        "bottom",
        "absolute bottom-0 right-0 w-40 z-20",
        "bottomBase64"
      )}

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};
