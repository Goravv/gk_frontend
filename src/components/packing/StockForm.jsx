import React, { useState } from "react";
import API from "../../api"; // centralized axios instance
import { useNavigate } from "react-router-dom";
import Navbar2 from "../Navbar2";
// import * as XLSX from "xlsx"; // 📦 SheetJS to read Excel

const StockForm = ({ onUploadSuccess }) => {
  const Navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // 🔍 Parse Excel and log contents
        // const data = new Uint8Array(e.target.result);
        // const workbook = XLSX.read(data, { type: "array" });

        // const sheetName = workbook.SheetNames[0];
        // const worksheet = workbook.Sheets[sheetName];
        // const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // console.log("📊 Excel File Content:", jsonData); // 👈 Preview in console

        // ✅ Prepare file for upload
        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        console.log("📤 Stock upload start...");

        await API.post("/api/packing/stock/upload/", formData);
        alert("✅ Stock Excel uploaded successfully");
        setFile(null);

        if (onUploadSuccess) onUploadSuccess();

        try {
          await API.post("/api/packing/packing/sync-stock/");
          alert("🔄 Stock quantities synced.");
        } catch (error) {
          alert("❌ Sync failed: " + error.message);
        }

        Navigate("/stock-list");
      } catch (error) {
        console.error("❌ Error reading file:", error);
        alert("Failed to read Excel file: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file); // Trigger file read
  };

  return (
    <div>
      <Navbar2 />
      <div className="p-4 border rounded-md shadow-md bg-white dark:bg-gray-800 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload Stock Excel
        </h2>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 block w-full text-sm"
        />
        <button
          className={`w-full px-4 py-2 text-white rounded ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Excel"}
        </button>
      </div>
    </div>
  );
};

export default StockForm;
