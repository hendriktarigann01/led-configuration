import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Header } from "../components/Header";
import { Canvas } from "../components/Canvas";
import { ConfigurationModal } from "../components/ConfigurationModal";
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseNavbarStore } from "../store/UseNavbarStore";

const Layout = () => {
  const { screenHeight, screenWidth, wallHeight, wallWidth, resolution } =
    UseHeaderStore();

  const { setScreenSize, setWallSize, updateModelData } = UseCanvasStore();
  const { selectedModel } = UseNavbarStore();

  // Sync header store values with canvas store
  useEffect(() => {
    setScreenSize(screenWidth, screenHeight);
  }, [screenHeight, screenWidth, setScreenSize]);

  useEffect(() => {
    setWallSize(wallWidth, wallHeight);
  }, [wallHeight, wallWidth, setWallSize]);

  // Update canvas when model changes
  useEffect(() => {
    if (selectedModel && selectedModel.modelData) {
      updateModelData(selectedModel.modelData, selectedModel.name);
    }
  }, [selectedModel, updateModelData]);

  return (
    <div className="max-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="flex-shrink-0">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Controls */}
        <Header />

        {/* Canvas Visualization */}
        <div className="flex-1 relative">
          <Canvas />
        </div>
      </div>

      {/* Configuration Modal - renders at root level */}
      <ConfigurationModal />
    </div>
  );
};

export default Layout;
