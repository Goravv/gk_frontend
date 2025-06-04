import React, { useState } from "react";
import API from "../../api";

const SearchDelete = () => {
  const [pk, setPk] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await API.get(`api/mrp/data/${pk}/`);
      setResult(res.data);
    } catch {
      alert("Item not found");
      setResult(null);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`api/mrp/data/${pk}/`);
      alert("Item deleted");
      setResult(null);
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="mt-4">
      <input
        id="seachmrp"
        className="border px-3 py-2 mr-2"
        placeholder="Enter Item Code"
        value={pk}
        onChange={(e) => setPk(e.target.value)}
      />
      <button className="bg-green-600 text-white px-3 py-2 rounded mr-2" onClick={handleSearch}>
        Search
      </button>
      <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={handleDelete}>
        Delete
      </button>

      {result && (
        <div className="mt-3 bg-gray-100 p-3 rounded shadow">
          <p><strong>Item Code:</strong> {result.item_code}</p>
          <p><strong>Description:</strong> {result.item_description}</p>
          <p><strong>Segment:</strong> {result.item_segment}</p>
          <p><strong>MRP:</strong> ₹{result.mrp_per_unit}</p>
          <p><strong>HSN:</strong> {result.hsn_code}</p>
          <p><strong>GST %:</strong> {result.gst_percent}%</p>
        </div>
      )}
    </div>
  );
};

export default SearchDelete;
