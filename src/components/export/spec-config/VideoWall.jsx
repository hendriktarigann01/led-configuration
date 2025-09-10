import React from "react";
import { BasePage } from "../BasePage";

export const VideoWallConfig = ({ data }) => {
  // Helper function to get specifications with default values like code 1
  const getSpecifications = () => {
    const specifications = [
      {
        category: "Display Requirements",
        items: [
          {
            label: "Screen Configuration",
            value: data?.calculations
              ? `${data.calculations.unitCount.horizontal} x ${data.calculations.unitCount.vertical}`
              : "4 x 4",
          },
          {
            label: "Number Of Screen",
            value: data?.calculations
              ? `${data.calculations.totalUnits} pcs`
              : "16 Pcs",
          },
        ],
      },
      {
        category: "Display Wall",
        items: [
          {
            label: "Dimensions",
            value:
              data?.screenConfig && data?.calculations?.baseDimensions
                ? `${data.screenConfig.width} (${data.calculations.baseDimensions.width}) x ${data.screenConfig.height} (${data.calculations.baseDimensions.height})`
                : "2.56 (0.64) x 1.92 (0.48)",
          },
          {
            label: "Display Area",
            value: data?.screenConfig
              ? `${data.screenConfig.area} m²`
              : "0.84 m²",
          },
        ],
      },
      {
        category: "Power Requirements",
        items: [
          {
            label: "Max Power",
            value:
              data?.calculations?.power?.max > 0
                ? `${data.calculations.power.max.toFixed(0)} W`
                : "10.400 W",
          },
        ],
      },
    ];

    return specifications;
  };

  const specifications = getSpecifications();

  return (
    <BasePage>
      {/* Logo */}
      <div className="absolute top-6 right-8">
        <img
          src="/logo/mjs_logo_text.png"
          alt="logo-mjs"
          className="w-auto h-10"
        />
      </div>

      {/* Main Content */}
      <div className="px-16 py-20">
        <div className="text-center mb-10 mt-20">
          <div
            className="text-gray-700 flex items-center justify-center space-x-4 h-10 p-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem", 
              height: "2.5rem", 
              padding: "0.5rem", 
              color: "#374151", 
            }}
          >
            {/* Dots kiri */}
            <div
              className="flex space-x-1"
              style={{ display: "flex", gap: "0.25rem" }}
            >
              <div
                className="w-2 h-2 bg-[#2A7A78] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#2A7A78",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#3AAFA9] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3AAFA9",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#E0F2F0] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#E0F2F0",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>

            {/* Title */}
            <p
              className="font-medium text-lg leading-none flex items-center"
              style={{
                fontWeight: 500,
                fontSize: "1.125rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                margin: 0,
              }}
            >
              Product Specification
            </p>

            {/* Dots kanan */}
            <div
              className="flex space-x-1"
              style={{ display: "flex", gap: "0.25rem" }}
            >
              <div
                className="w-2 h-2 bg-[#E0F2F0] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#E0F2F0",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#3AAFA9] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3AAFA9",
                  borderRadius: "9999px",
                }}
              ></div>
              <div
                className="w-2 h-2 bg-[#2A7A78] rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#2A7A78",
                  borderRadius: "9999px",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 z-50">
          <table className="w-full border-collapse text-xs">
            <tbody>
              {specifications.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.items.map((item, itemIndex) => (
                    <tr key={`${sectionIndex}-${itemIndex}`}>
                      {itemIndex === 0 && (
                        <td
                          rowSpan={section.items.length}
                          className="py-2.5 px-6 w-52 text-gray-600 border border-gray-200 align-middle"
                        >
                          {section.category}
                        </td>
                      )}
                      <td className="py-2.5 px-6 w-52 text-gray-600 border border-gray-200 align-middle">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-6 w-52 text-gray-600 border border-gray-200 align-middle">
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-8 text-[10px] space-y-2 text-gray-600">
        <div className="font-semibold">MJ Solution Indonesia</div>
        <p>
          The Mansion Bougenville Kemayoran Tower Fontana Zona I Lantai 50
          Kemayoran Jakarta Utara
        </p>
        <div className="flex items-center space-x-4">
          {/* Website */}
          <div className="inline-flex items-center space-x-1">
            <img
              src="/icons/icon-web.svg"
              className="w-4 h-4 relative top-[1px]"
              alt="web"
            />
            <span className="leading-[1]">mjsolution.co.id</span>
          </div>

          {/* Phone */}
          <div className="inline-flex items-center space-x-1">
            <img
              src="/icons/icon-call.svg"
              className="w-4 h-4 relative top-[1px]"
              alt="phone"
            />
            <span className="leading-[1]">(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </BasePage>
  );
};
