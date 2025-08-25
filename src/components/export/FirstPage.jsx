import { BasePage } from "./BasePage";

export const FirstPage = () => {
  return (
    <BasePage>
      <div className="flex flex-col items-center justify-center h-full px-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="flex space-x-1">
              <div className="w-6 h-16 bg-teal-600"></div>
              <div className="w-6 h-12 bg-teal-400 mt-4"></div>
              <div className="w-6 h-8 bg-teal-300 mt-8"></div>
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-700 mb-6">
            MJ Solution Indonesia
          </h1>
          <div className="flex items-center justify-center space-x-8 text-gray-600">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>EXPLORE</span>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>CREATE</span>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>INSPIRE</span>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </span>
          </div>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-2xl text-gray-700 font-light">Muhammad Faris</h2>
          <div className="text-gray-600">Date of Configuration 16-03-2025</div>
          <div className="text-gray-600 font-medium">
            Indoor LED Fixed P 1.86
          </div>
        </div>
      </div>
    </BasePage>
  );
};
