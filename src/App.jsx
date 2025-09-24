import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import LayoutPDF from "./pages/LayoutPDF";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />

      <Route path="/page-pdf" element={<LayoutPDF />} />
    </Routes>
  );
}

export default App;
