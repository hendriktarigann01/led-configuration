import { BasePage } from "../BasePage";

export const Indoor = () => {
  const specs = [
    { label: "Pixel Pitch", value: "P 1.8" },
    { label: "Refresh Rate", value: "1920 Hz / 2400 Hz / 3840 Hz" },
    { label: "Brightness", value: "500 nits - 1.000 nits" },
  ];

  const moduleSpecs = [
    { label: "Module Size", value: "320mm x 160mm" },
    { label: "Module Resolution", value: "172 x 86 dots" },
    { label: "Moduli Pixels", value: "14792 dots" },
    { label: "IC", value: "ICN2153" },
    { label: "Led Configuration", value: "3 in 1" },
    { label: "Weight", value: "0.48 KG" },
    { label: "Weight", value: "0.48 KG" },
  ];

  const cabinetSpecs = [
    { label: "Cabinet size (WH)", value: "640 X 480mm" },
    { label: "Cabinet resolution", value: "344 X 258 dots" },
    { label: "Cabinet pixels", value: "88752 dots" },
    { label: "Pixel density", value: "288906 dots/m²" },
    { label: "Cabinet material", value: "Die-casting aluminum" },
    { label: "Weight", value: "7.8KG" },
    { label: "Life span", value: "0->10,000 hours KG" },
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

              <tr className="border-b border-gray-200">
                <td
                  className="py-1.5 px-3 text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={moduleSpecs.length}
                >
                  Module
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

              <tr className="border-b border-gray-200">
                <td
                  className="py-1.5 px-3 text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={cabinetSpecs.length}
                >
                  Cabinet
                </td>
                <td className="py-1.5 px-3 text-gray-600 border-r border-gray-200">
                  {cabinetSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700">
                  {cabinetSpecs[0].value}
                </td>
              </tr>
              {cabinetSpecs.slice(1).map((spec, index) => (
                <tr
                  key={index}
                  className={
                    index === cabinetSpecs.length - 2
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
