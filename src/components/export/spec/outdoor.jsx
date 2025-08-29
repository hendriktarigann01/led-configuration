import { BasePage } from "../BasePage";

export const Outdoor = () => {
  const specs = [
    { label: "Pixel Pitch", value: "P 3.0" },
    { label: "Refresh Rate", value: "1920Hz / 3840Hz / 7680Hz" },
    { label: "Brightness", value: "5500 - 6000 Nits" },
  ];

  const moduleSpecs = [
    { label: "Module Size", value: "320mm x 160mm" },
    { label: "LED lamp", value: "SMD1415" },
    { label: "Pixel Resolution", value: "104*52 dots" },
    { label: "Module thickness", value: "17MM" },
    { label: "Module weight", value: "0.45KG" },
    { label: "Drive type", value: "Constant drive" },
    { label: "Aplication", value: "Outdoor Fixed Installation" },
  ];

  const cabinetSpecs = [
    { label: "Cabinet size (WH)", value: "960*960mm" },
    { label: "Cabinet resolution", value: "312*312 dots" },
    { label: "Pixel density", value: "105625 dots/m²" },
    { label: "Power Consumption", value: "Max: 800W/m², Average: 300W/m²" },
    { label: "Cabinet material", value: "Die-casting Magnesium Cabinet" },
    { label: "Life span", value: "≥100,000 Hours" },
    { label: "Cabinet weight", value: "25Kg/pc" },
    { label: "Working voltage", value: "AC220v+-10%" },
    { label: "Humidity", value: "10%-75%" },
    { label: "Best viewing distance", value: "3-10M" },
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
