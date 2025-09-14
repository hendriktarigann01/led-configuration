// import { useState } from "react";
// import { PDFDataMapper } from "../utils/PDFDataMapper";

// export const usePDFExport = (storeData) => {
//   const [pdfData, setPdfData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const preparePDFData = async (formData) => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Map data dari store ke format PDF
//       const mappedData = PDFDataMapper.mapToPDFData(storeData, formData);

//       // Validasi data
//       PDFDataMapper.validatePDFData(mappedData);

//       // Set PDF data
//       setPdfData(mappedData);

//       return { success: true, data: mappedData };
//     } catch (err) {
//       console.error("PDF data preparation failed:", err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetPDFData = () => {
//     setPdfData(null);
//     setError(null);
//   };

//   const getPreviewData = () => {
//     return PDFDataMapper.createPreviewData();
//   };

//   return {
//     pdfData,
//     isLoading,
//     error,
//     preparePDFData,
//     resetPDFData,
//     getPreviewData,
//   };
// };
