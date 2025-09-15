import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LayoutPDF from "./pages/LayoutPDF";

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

      <Route path="/page-pdf" element={<LayoutPDF />} />
    </Routes>
  );
}

export default App;
