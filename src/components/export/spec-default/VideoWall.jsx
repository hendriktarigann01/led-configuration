import { BasePage } from "../BasePage";

export const VideoWall = ({ data }) => {
  const specs = [
    { label: "Inch", value: data?.inch ? `${data.inch}"` : '46"' },
    { label: "Unit Size (mm)", value: "1,075 (W) x 606 (H) x 54 (D)" },
    { label: "B2B", value: "1,8 mm" },
    { label: "Brightness", value: "500 cd/m2" },
  ];

  const moduleSpecs = [
    { label: "Resolution", value: "FHD 1920 x 1080)" },
    { label: "Contrast Ratio", value: "4000" },
    { label: "Aspect Ratio", value: "16 : 9" },
    { label: "Display Color", value: "8 bit / 16.7 M" },
    { label: "Color Gamut", value: "72%" },
    { label: "Response Time", value: "8 ms" },
    { label: "Viewing Angle", value: "178 (H) / 178 (V)" },
    { label: "H. Scanning Frequency", value: "30 kHz ~ 81 kHz" },
    { label: "V. Scanning Frequency", value: "48Hz ~ 75Hz" },
  ];

  const connectivitySpecs = [
    { label: "Audio in/Out", value: "Stereo Mini Jack" },
    { label: "Video In", value: "HDMI1, HDMI2" },
  ];

  const powerSpecs = [
    { label: "Power Supply", value: "AC 100 - 240 V / 50 - 60 Hz" },
    { label: "Power Consumption (W)", value: "≤180 W" },
    { label: "Standby Power", value: "3W" },
  ];

  const environmentSpecs = [
    { label: "Operation Temperature", value: "0 ~ 50 ℃" },
    { label: "Storage Temperature", value: "-20 ~ 65 ℃" },
    { label: "Operation", value: "24/7" },
  ];

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
              gap: "1rem", // fallback untuk space-x-4
              height: "2.5rem", // fallback h-10
              padding: "0.5rem", // fallback p-2
              color: "#374151", // fallback text-gray-700
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
              {/* Basic specs without category */}
              {specs.map((spec, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle">
                    {spec.label}
                  </td>
                  <td
                    className="py-1.5 px-3 text-gray-700 align-middle"
                    colSpan="2"
                  >
                    {spec.value}
                  </td>
                </tr>
              ))}

              {/* Panel section */}
              <tr className="border border-gray-200">
                <td
                  className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle"
                  rowSpan={moduleSpecs.length}
                >
                  Panel
                </td>
                <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                  {moduleSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 align-middle">
                  {moduleSpecs[0].value}
                </td>
              </tr>
              {moduleSpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700 align-middle">
                    {spec.value}
                  </td>
                </tr>
              ))}

              {/* Connectivity section */}
              <tr className="border border-gray-200">
                <td
                  className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle"
                  rowSpan={connectivitySpecs.length}
                >
                  Connectivity
                </td>
                <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                  {connectivitySpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 align-middle">
                  {connectivitySpecs[0].value}
                </td>
              </tr>
              {connectivitySpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700 align-middle">
                    {spec.value}
                  </td>
                </tr>
              ))}

              {/* Power section */}
              <tr className="border border-gray-200">
                <td
                  className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle"
                  rowSpan={powerSpecs.length}
                >
                  Power
                </td>
                <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                  {powerSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 align-middle">
                  {powerSpecs[0].value}
                </td>
              </tr>
              {powerSpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700 align-middle">
                    {spec.value}
                  </td>
                </tr>
              ))}

              {/* Environment section */}
              <tr className="border border-gray-200">
                <td
                  className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle"
                  rowSpan={environmentSpecs.length}
                >
                  Environment
                </td>
                <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                  {environmentSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 align-middle">
                  {environmentSpecs[0].value}
                </td>
              </tr>
              {environmentSpecs.slice(1).map((spec, index) => (
                <tr
                  key={index}
                  className={
                    index === environmentSpecs.length - 2
                      ? ""
                      : "border border-gray-200"
                  }
                >
                  <td className="py-1.5 px-3 text-gray-600 border border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700 align-middle">
                    {spec.value}
                  </td>
                </tr>
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
