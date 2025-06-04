import React, { useState } from "react";
import API from "../../api"; // ✅ use centralized axios instance

const UploadBox = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/api/mrp/upload/", formData); // ✅ no need for full URL
      alert("Upload successful");
      onUpload(); // refresh data
      setFile(null); // optional: reset file input
    } catch (error) {
      alert("Upload failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleUpload}
      >
        Upload Excel
      </button>
    </div>
  );
};

export default UploadBox;
