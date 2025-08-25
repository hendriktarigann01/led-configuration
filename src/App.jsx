import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LayoutPDF from "./pages/LayoutPDF";

function App() {
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
