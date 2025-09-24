import React, { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Header } from "../components/Header";
import { Canvas } from "../components/Canvas";
import { ConfigurationModal } from "../components/ConfigurationModal";
import { ExportModal } from "../components/ExportModal";
import { ResultModal } from "../components/ResultModal";
import { CropperModal } from "../components/CropperModal"; // New import
import { UseHeaderStore } from "../store/UseHeaderStore";
import { UseCanvasStore } from "../store/UseCanvasStore";
import { UseNavbarStore } from "../store/UseNavbarStore";

const Layout = () => {
  const {
    screenHeight,
    screenWidth,
    wallHeight,
    wallWidth,
    resolution,
    syncWithCanvas,
  } = UseHeaderStore();

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
      // Sync header store with updated canvas values
      setTimeout(() => syncWithCanvas(), 0);
    }
  }, [selectedModel, updateModelData, syncWithCanvas]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Mobile: Main Content First */}
      <div className="flex-1 flex flex-col lg:order-2">
        {/* Header Controls */}
        <Header />

        {/* Canvas Visualization */}
        <div className="flex-1 relative">
          <Canvas />
        </div>
      </div>
      {/* Mobile: Sidebar at Bottom, Desktop: Sidebar at Left */}
      <div className="flex-shrink-0 lg:order-1 order-2">
        <Navbar />
      </div>
      {/* Modals - renders at root level */}
      <ConfigurationModal />
      <ExportModal />
      <ResultModal />
      <CropperModal /> {/* New cropper modal */}
    </div>
  );
};

export default Layout;
