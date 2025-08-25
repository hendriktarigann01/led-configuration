import { BasePage } from "./BasePage";

export const LastPage = () => {
  return (
    <BasePage>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="flex space-x-1">
              <div className="w-8 h-20 bg-teal-600"></div>
              <div className="w-8 h-16 bg-teal-400 mt-4"></div>
              <div className="w-8 h-12 bg-teal-300 mt-8"></div>
            </div>
          </div>
          <h1 className="text-5xl font-light text-gray-700 mb-8">
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
      </div>
    </BasePage>
  );
};
