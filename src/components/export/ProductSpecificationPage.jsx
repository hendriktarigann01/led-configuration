import { BasePage } from "./BasePage";

export const ProductSpecificationPage = () => {
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
      <div className="px-16 py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-light text-gray-700 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <span>Product Specification</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <tbody>
              {specs.map((spec, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-6 bg-gray-50 font-medium text-gray-700 border-r border-gray-200 w-1/3">
                    {spec.label}
                  </td>
                  <td
                    className="py-4 px-6 text-gray-800 font-medium"
                    colSpan="2"
                  >
                    {spec.value}
                  </td>
                </tr>
              ))}

              <tr className="border-b border-gray-200">
                <td
                  className="py-4 px-6 bg-gray-50 font-medium text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={moduleSpecs.length}
                >
                  Module
                </td>
                <td className="py-4 px-6 text-gray-600 border-r border-gray-200">
                  {moduleSpecs[0].label}
                </td>
                <td className="py-4 px-6 text-gray-800 font-medium">
                  {moduleSpecs[0].value}
                </td>
              </tr>
              {moduleSpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-600 border-r border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {spec.value}
                  </td>
                </tr>
              ))}

              <tr className="border-b border-gray-200">
                <td
                  className="py-4 px-6 bg-gray-50 font-medium text-gray-700 border-r border-gray-200 w-1/3"
                  rowSpan={cabinetSpecs.length}
                >
                  Cabinet
                </td>
                <td className="py-4 px-6 text-gray-600 border-r border-gray-200">
                  {cabinetSpecs[0].label}
                </td>
                <td className="py-4 px-6 text-gray-800 font-medium">
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
                  <td className="py-4 px-6 text-gray-600 border-r border-gray-200">
                    {spec.label}
                  </td>
                  <td className="py-4 px-6 text-gray-800 font-medium">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BasePage>
  );
};
