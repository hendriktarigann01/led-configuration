import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import ModelPageWeb from "./components/export/ModelPageWeb"; // Import komponen web yang baru

function App() {
  // Sample data untuk testing - ganti dengan data sebenarnya
  const sampleData = {
    displayType: "Indoor LED Display",
    pixelPitch: "P 1.8",
    calculations: {
      unitCount: {
        horizontal: 2,
        vertical: 2,
      },
    },
    screenConfig: {
      width: "2",
      height: "1.5",
    },
    wallConfig: {
      width: "5",
      height: "3",
    },
    selectedContent: "Default Image",
    customImageUrl: "/canvas/canvas-bg.png",
    roomImageUrl: null,
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="h-screen bg-gray-100">
            <Layout />
          </div>
        }
      />

      {/* Route untuk ModelPage web version */}
      <Route path="/page-pdf" element={<ModelPageWeb data={sampleData} />} />
    </Routes>
  );
}

export default App;
