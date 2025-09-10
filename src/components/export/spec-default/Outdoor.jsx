import { BasePage } from "../BasePage";

export const Outdoor = ({ data }) => {
  const specs = [
    {
      label: "Pixel Pitch",
      value: data?.pixelPitch ? `${data.pixelPitch}` : "P 3.0",
    },
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

              <tr className="border border-gray-200">
                <td
                  className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle"
                  rowSpan={moduleSpecs.length}
                >
                  Module
                </td>
                <td className="py-1.5 px-3 text-gray-600 border border-gray-200 align-middle">
                  {moduleSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 align-middle">
                  {moduleSpecs[0].value}
                </td>
              </tr>
              {moduleSpecs.slice(1).map((spec, index) => (
                <tr key={index} className="border border-gray-200">
                  <td className="py-1.5 px-3 text-gray-600 border border-gray-200 align-middle">
                    {spec.label}
                  </td>
                  <td className="py-1.5 px-3 text-gray-700 align-middle">
                    {spec.value}
                  </td>
                </tr>
              ))}

              <tr className="border border-gray-200">
                <td
                  className="py-1.5 px-3 w-44 text-gray-700 border border-gray-200 align-middle"
                  rowSpan={cabinetSpecs.length}
                >
                  Cabinet
                </td>
                <td className="py-1.5 px-3 text-gray-600 border border-gray-200 align-middle">
                  {cabinetSpecs[0].label}
                </td>
                <td className="py-1.5 px-3 text-gray-700 align-middle">
                  {cabinetSpecs[0].value}
                </td>
              </tr>
              {cabinetSpecs.slice(1).map((spec, index) => (
                <tr
                  key={index}
                  className={
                    index === cabinetSpecs.length - 2
                      ? ""
                      : "border border-gray-200"
                  }
                >
                  <td className="py-1.5 px-3 text-gray-600 border border-gray-200 align-middle">
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
