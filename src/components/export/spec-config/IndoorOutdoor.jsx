import React from "react";
import { BasePage } from "../BasePage";

export const IndoorOutdoorConfig = () => {
  const specifications = [
    {
      category: "Display Requirements",
      items: [
        { label: "Screen Configuration", value: "4 x 4" },
        { label: "Number Of Cabinet", value: "16 Pcs" },
        { label: "Display Resolution", value: "1.376 x 1.032" },
      ],
    },
    {
      category: "Display Wall",
      items: [
        { label: "Dimensions", value: "2.56 (0.64) x 1.92 (0.48)" },
        { label: "Display Area", value: "0.84 m2" },
        { label: "Weight Cabinet", value: "124.8 kg" },
      ],
    },
    {
      category: "Power Requirements",
      items: [
        { label: "Max Power", value: "10.400 W" },
        { label: "Average Power", value: "4.800 W" },
      ],
    },
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
          <h2 className="text-2xl text-gray-700 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#2A7A78] rounded-full"></div>
              <div className="w-2 h-2 bg-[#3AAFA9] rounded-full"></div>
              <div className="w-2 h-2 bg-[#E0F2F0] rounded-full"></div>
            </div>
            <span className="font-medium">Specification</span>
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
              {specifications.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.items.map((item, itemIndex) => (
                    <tr
                      key={`${sectionIndex}-${itemIndex}`}
                      className="border-b border-gray-200"
                    >
                      {itemIndex === 0 && (
                        <td
                          rowSpan={section.items.length}
                          className="py-2.5 px-6 text-gray-600 border-r border-gray-200 align-middle"
                        >
                          {section.category}
                        </td>
                      )}
                      <td className="py-2.5 px-6 text-gray-600 border-r border-gray-200">
                        {item.label}
                      </td>
                      <td className="py-2.5 px-6 text-gray-600">
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
