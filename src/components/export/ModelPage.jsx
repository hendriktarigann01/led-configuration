import { BasePage } from "./BasePage";

export const ModelPage = () => {
  return (
    <BasePage>
      <div className="px-16 py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-light text-gray-700 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <span>Model</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
          </h2>
        </div>

        <div className="flex items-center justify-between mb-20">
          <div className="w-80">
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-24 bg-gray-800 rounded mb-4 mx-auto relative">
                  <div className="absolute inset-2 border border-gray-600"></div>
                  <div className="absolute top-4 left-4 right-4 bottom-8 bg-gray-700"></div>
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-4 bg-teal-600"></div>
                    <div className="w-2 h-3 bg-teal-400"></div>
                    <div className="w-2 h-2 bg-teal-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg text-gray-600 mb-2">
              Indoor Cabinet Fixed
            </div>
            <div className="text-4xl font-light text-gray-700">P 1.8</div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-light text-gray-700 text-center mb-8 flex items-center justify-center space-x-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
            <span>Led Configuration Rendering</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            </div>
          </h3>

          <div className="relative">
            <div
              className="border-2 border-dashed border-gray-300 relative"
              style={{ height: "400px" }}
            >
              <div className="absolute top-0 left-4 text-xs text-gray-500">
                1.86 m
              </div>
              <div className="absolute left-0 top-4 text-xs text-gray-500 transform -rotate-90 origin-left">
                1.18 m
              </div>
              <div className="absolute bottom-0 left-4 text-xs text-gray-500">
                1.18 m
              </div>
              <div className="absolute top-0 right-4 text-xs text-gray-500">
                1.86 m
              </div>

              {/* Sample image placeholder */}
              <div className="absolute inset-16 bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm opacity-75 mb-2">
                    LED Display Content
                  </div>
                  <div className="text-xs opacity-50">Sample Rendering</div>
                </div>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 flex items-center">
              <div className="w-16 h-32 bg-gray-400 rounded-lg opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </BasePage>
  );
};
