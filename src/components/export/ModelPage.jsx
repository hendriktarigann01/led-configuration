import { BasePage } from "./BasePage";

export const ModelPage = () => {
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
        <div className="text-center mb-5">
          <h2 className="text-2xl font-light text-gray-700 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#2A7A78] rounded-full"></div>
              <div className="w-2 h-2 bg-[#3AAFA9] rounded-full"></div>
              <div className="w-2 h-2 bg-[#E0F2F0] rounded-full"></div>
            </div>
            <span className="font-medium">Model</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-[#E0F2F0] rounded-full"></div>
              <div className="w-2 h-2 bg-[#3AAFA9] rounded-full"></div>
              <div className="w-2 h-2 bg-[#2A7A78] rounded-full"></div>
            </div>
          </h2>
        </div>

        <div className="flex items-center w-[600px] justify-center mx-auto mb-5">
          <div className="rounded-lg m-8 flex items-center justify-center">
            <div className="text-center">
              <img
                src="/product/model/indoor.svg"
                alt="product"
                className="w-72"
              />
            </div>
          </div>
          <div className="text-left">
            <div className="text-xl font-light text-gray-600 mb-5">
              Indoor Cabinet Fixed
            </div>
            <div className="text-2xl text-gray-700">P 1.8</div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-light text-gray-700 text-center mb-5 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <span className="font-medium">Led Configuration Rendering</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
          </h3>

          <div className="relative">
            <div className="relative h-[400px] flex justify-center items-center">
              {/* Sample image placeholder */}
              <div className="scale-75">
                <img src="/canvas-bg.webp" alt="canvas" />
              </div>
            </div>

            {/* Human image align middle right */}
            <div className="absolute right-0 bottom-0 -translate-y-1/2">
              <img
                src="/human.webp"
                alt="Human Scale"
                className="w-auto h-36"
              />
            </div>
          </div>
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
