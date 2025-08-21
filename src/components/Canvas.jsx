import React from "react";
import { CirclePlus } from "lucide-react";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseModalStore } from "../store/UseModalStore";
import { ConfigurationModal } from "./ConfigurationModal";

export const Canvas = () => {
  const {
    canvasWidth,
    canvasHeight,
    screenWidth,
    screenHeight,
    wallWidth,
    wallHeight,
    reset,
  } = UseCanvasStore();

  const { openModal } = UseModalStore();

  return (
    <>
      <div className="flex-1 bg-gray-50 h-screen p-4 flex items-center justify-center">
        {/* Reset Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={reset}
            className="px-14 py-2 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Canvas Container */}
        <div className="w-[500px] h-[300px] bg-white rounded-lg justify-center items-center relative">
          {/* Canvas Content Area */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center m-10">
              <p className="text-gray-500 text-lg">
                Start your configuration by choosing the model that suits your
                needs.
              </p>

              <button
                onClick={openModal}
                className="mt-6 flex items-center justify-center space-x-2 w-1/2 h-10 mx-auto text-white bg-teal-500 hover:bg-teal-600 transition-colors"
              >
                <CirclePlus size={20} />
                <span className="text-sm">Configuration</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal />
    </>
  );
};
