import React from "react";
import { BasePage } from "../BasePage";

export const Indoor = ({ data }) => {
  // Helper function to get specifications with default values
  const getSpecifications = () => {
    const specifications = [
      {
        label: "Pixel Pitch",
        value: data?.pixelPitch ? `${data.pixelPitch}` : "P 1.8",
        category: "General Specs",
      },
      {
        label: "Refresh Rate",
        value: "1920 Hz / 2400 Hz / 3840 Hz",
        category: "",
      },
      {
        label: "Brightness",
        value: "500 nits - 1.000 nits",
        category: "",
      },
      {
        label: "Module Size",
        value: "320mm x 160mm",
        category: "Module",
      },
      {
        label: "Module Resolution",
        value: "172 x 86 dots",
        category: "",
      },
      {
        label: "Module Pixels",
        value: "14792 dots",
        category: "",
      },
      {
        label: "IC",
        value: "ICN2153",
        category: "",
      },
      {
        label: "Led Configuration",
        value: "3 in 1",
        category: "",
      },
      {
        label: "Weight",
        value: "0.48 KG",
        category: "",
      },
      {
        label: "Cabinet size (WH)",
        value: "640 X 480mm",
        category: "Cabinet",
      },
      {
        label: "Cabinet resolution",
        value: "344 X 258 dots",
        category: "",
      },
      {
        label: "Cabinet pixels",
        value: "88752 dots",
        category: "",
      },
      {
        label: "Pixel density",
        value: "288906 dots/m²",
        category: "",
      },
      {
        label: "Cabinet material",
        value: "Die-casting aluminum",
        category: "",
      },
      {
        label: "Weight",
        value: "7.8KG",
        category: "",
      },
      {
        label: "Power consumption",
        value: "Max: 650W/m², Average: 300W/m²",
        category: "",
      },
      {
        label: "Life span",
        value: "0→10,000 hours",
        category: "",
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
            className="text-gray-700 flex items-center justify-center h-10 p-2"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "2.5rem",
              padding: "0.5rem",
              color: "#374151",
            }}
          >
            {/* Dots kiri */}
            <div style={{ display: "flex", gap: "0.25rem" }}>
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
              className="font-medium text-lg mx-5 leading-none flex items-center"
              style={{
                fontWeight: 500,
                fontSize: "1.125rem",
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              Product Specification
            </p>

            {/* Dots kanan */}
            <div style={{ display: "flex", gap: "0.25rem" }}>
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

        <div className="overflow-hidden z-1">
          <table className="w-full border-1 border-gray-200 border-collapse text-xs">
            <tbody>
              {/* General Specs - 3 rows */}
              <tr>
                <td
                  className="px-4 w-40 text-gray-700 font-medium border-1 border-gray-200 bg-white whitespace-nowrap"
                  style={{
                    verticalAlign: "middle",
                    fontWeight: "600",
                  }}
                >
                  Pixel Pitch
                </td>
                <td
                  colSpan={2}
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  {data?.pixelPitch ? `${data.pixelPitch}` : "P 1.8"}
                </td>
              </tr>
              <tr>
                <td
                  className="px-4 w-40 text-gray-700 font-medium border-1 border-gray-200 bg-white whitespace-nowrap"
                  style={{
                    verticalAlign: "middle",
                    fontWeight: "600",
                  }}
                >
                  Refresh Rate
                </td>
                <td
                  colSpan={2}
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  1920 Hz / 2400 Hz / 3840 Hz
                </td>
              </tr>
              <tr>
                <td
                  className="px-4 w-40 text-gray-700 font-medium border-1 border-gray-200 bg-white whitespace-nowrap"
                  style={{
                    verticalAlign: "middle",
                    fontWeight: "600",
                  }}
                >
                  Brightness
                </td>
                <td
                  colSpan={2}
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  500 nits - 1.000 nits
                </td>
              </tr>

              {/* Module Section - 6 rows */}
              <tr>
                <td
                  rowSpan="6"
                  className="px-4 w-40 text-gray-700 font-medium border-1 border-gray-200 bg-white"
                  style={{
                    fontWeight: "600",
                    verticalAlign: "middle",
                  }}
                >
                  Module
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Module Size
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  320mm x 160mm
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Module Resolution
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  172 x 86 dots
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Module Pixels
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  14792 dots
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  IC
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  ICN2153
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Led Configuration
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  3 in 1
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Weight
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  0.48 KG
                </td>
              </tr>

              {/* Cabinet Section - 8 rows */}
              <tr>
                <td
                  rowSpan="8"
                  className="px-4 w-40 text-gray-700 font-medium border-1 border-gray-200 bg-white"
                  style={{
                    fontWeight: "600",
                    verticalAlign: "middle",
                  }}
                >
                  Cabinet
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Cabinet size (WH)
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  640 X 480mm
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Cabinet resolution
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  344 X 258 dots
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Cabinet pixels
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  88752 dots
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Pixel density
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  288906 dots/m²
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Cabinet material
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Die-casting aluminum
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Weight
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  7.8KG
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Power consumption
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Max: 650W/m², Average: 300W/m²
                </td>
              </tr>
              <tr>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  Life span
                </td>
                <td
                  className="py-2.5 px-4 text-gray-600 border-1 border-gray-200 whitespace-nowrap"
                  style={{ verticalAlign: "middle" }}
                >
                  0→10,000 hours
                </td>
              </tr>
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
