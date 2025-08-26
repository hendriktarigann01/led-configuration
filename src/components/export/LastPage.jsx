import { BasePage } from "./BasePage";

export const LastPage = () => {
  return (
    <BasePage>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/logo/mjs_logo.png"
              alt="logo-mjs"
              className="w-auto h-20"
            />
          </div>
          <h1 className="text-5xl font-light text-gray-700 mb-8">
            MJ Solution Indonesia
          </h1>
          <div className="flex items-center justify-center space-x-7 text-gray-600">
            <span>EXPLORE</span>
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>CREATE</span>
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>INSPIRE</span>
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
