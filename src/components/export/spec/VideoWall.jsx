import { BasePage } from "../BasePage";

export const VideoWall = () => {
  const specs = [
    { label: "Pixel Pitch", value: "P 3.0" },
    { label: "Refresh Rate", value: "1920Hz / 3840Hz / 7680Hz" },
    { label: "Brightness", value: "5500 - 6000 Nits" },
  ];

  const moduleSpecs = [
    { label: "Resolution", value: "1078 (H) x 1078 (V) x 244 (D)" },
    { label: "Control System", value: "Li Nova" },
    { label: "Aspect Ratio", value: "16 : 9" },
    { label: "Viewing Angle", value: "120°H / 120°V" },
    { label: "Color Output", value: "12%" },
    { label: "Maximum Temp", value: "70°" },
    { label: "Viewing Range", value: "3 to 10 M" },
    { label: "H. Scanning Frequency", value: "15kHz - 80 kHz" },
    { label: "V. Scanning Frequency", value: "50Hz - 200Hz" },
  ];

  const connectivitySpecs = [
    { label: "Audio in/Out", value: "Stereo RCA Jack" },
    { label: "Power Supply", value: "AC Input: 240 V | DC : 400 wc" },
  ];

  const powerSpecs = [
    { label: "Power Consumption (W)", value: "800 W" },
    { label: "Standby Power", value: "15W/cm²" },
    { label: "Operation Temperature", value: "0 - 60 °C" },
    { label: "Storage Temperature", value: "0 - 60 °C" },
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
        <div className="text-center mb-10">
          <h2 className="text-2xl font-light text-gray-700 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#2A7A78] rounded-full"></div>
              <div className="w-2 h-2 bg-[#3AAFA9] rounded-full"></div>
              <div className="w-2 h-2 bg-[#E0F2F0] rounded-full"></div>
            </div>
            <span className="font-medium">Product Specification</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#E0F2F0] rounded-full"></div>
              <div className="w-2 h-2 bg-[#3AAFA9] rounded-full"></div>
              <div className="w-2 h-2 bg-[#2A7A78] rounded-full"></div>
            </div>
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <tbody>
              {/* Basic specs without category */}
              {specs.map((spec, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-1.5 px-3 text-gray-700 border-r border-gray-200 w-1/3">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700" colSpan="2">
                    {spec.value}
                  </td>
                </tr>
              ))}

              {/* Module section */}
              <tr className="border-b border-gray-200">
                <td
                  className="py-1.5 px-3 text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={moduleSpecs.length}
                >
                  Panel
                </td>
                <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                  {moduleSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700">
                  {moduleSpecs[0].value}
                </td>
              </tr>
              {moduleSpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700">{spec.value}</td>
                </tr>
              ))}

              {/* Connectivity section */}
              <tr className="border-b border-gray-200">
                <td
                  className="py-1.5 px-3 text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={connectivitySpecs.length}
                >
                  Connectivity
                </td>
                <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                  {connectivitySpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700">
                  {connectivitySpecs[0].value}
                </td>
              </tr>
              {connectivitySpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700">{spec.value}</td>
                </tr>
              ))}

              {/* Power section */}
              <tr className="border-b border-gray-200">
                <td
                  className="py-1.5 px-3 text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={powerSpecs.length}
                >
                  Environment
                </td>
                <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                  {powerSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700">
                  {powerSpecs[0].value}
                </td>
              </tr>
              {powerSpecs.slice(1).map((spec, index) => (
                <tr
                  key={index}
                  className={
                    index === powerSpecs.length - 2
                      ? ""
                      : "border-b border-gray-200"
                  }
                >
                  <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Footer */}
      <div className="absolute bottom-6 left-8 text-xs space-y-2 text-gray-600">
        <div className="font-semibold">MJ Solution Indonesia</div>
        <div>
          The Mansion Bougenville Kemayoran Tower Fontana Zona I Lantai 50
          Kemayoran Jakarta Utara
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <img src="/icons/icon-web.svg" className="w-4 h-4" alt="web" />
            <span>mjsolution.co.id</span>
          </div>
          <div className="flex items-center space-x-1">
            <img src="/icons/icon-call.svg" className="w-4 h-4" alt="call" />
            <span>(+62) 811-1122-492</span>
          </div>
        </div>
      </div>
    </BasePage>
  );
};