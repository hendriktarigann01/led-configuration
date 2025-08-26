import { BasePage } from "./BasePage";

export const FirstPage = () => {
  return (
    <BasePage>
      <div className="flex flex-col items-center justify-center h-full space-y-60 px-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <img
              src="/logo/mjs_logo_text.png"
              alt="logo-mjs-center"
              className="w-auto h-10"
            />
          </div>
          <h1 className="text-4xl font-normal text-gray-700 mb-6">
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

        <div className="text-center space-y-6 w-[350px]">
          <h2 className="text-2xl text-gray-700 font-light">Muhammad Faris</h2>
          <div className="text-gray-600">Date of Configuration 16-03-2025</div>
          <div className="border-b border-gray-400"></div>
          <div className="text-gray-600 font-medium">
            Indoor LED Fixed P 1.86
          </div>
        </div>
      </div>
    </BasePage>
  );
};
