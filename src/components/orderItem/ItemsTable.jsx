import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function ItemsTable({ items, onDeleteItem }) {
  const [genrate, setGenrate] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { key: "part_no", label: "Part No." },
    { key: "description", label: "Description" },
    { key: "qty", label: "Qty" },
    { key: "mrp", label: "MRP" },
    { key: "total_amt_mrp", label: "Total Amt. MRP" },
    { key: "tax_percent", label: "Tax %" },
    { key: "hsn", label: "HSN" },
    { key: "billed_qty", label: "Billed Qty" },
    { key: "total_amt_billed_qty", label: "Total Amt. Billed Qty" },
  ];

  const visibleColumns = columns.filter((col) =>
    items.some((item) => {
      const val = item[col.key];
      return val !== null && val !== undefined && val !== "";
    })
  );

  const getCsrfToken = async () => {
    try {
      await API.get("/api/asstimate/set-csrf-cookie/", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error setting CSRF cookie:", error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleMergeItems = async () => {
    try {
      await getCsrfToken();
      const token = getCookie("csrftoken");

      const res = await API.post(
        "/api/asstimate/genrate/",
        {}, // empty body, modify if you need to send data
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": token,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setGenrate(true);
        alert(res.data.message || "Items merged successfully");
      } else {
        alert("Failed to merge items");
      }
    } catch (error) {
      console.error(error);
      alert("Error merging items: " + (error.response?.data?.error || error.message));
    }
  };

  const handleAsstimate = () => {
    navigate("/asstimate");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {visibleColumns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.part_no} className="hover:bg-gray-50">
              {visibleColumns.map((col) => (
                <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                  {item[col.key] ?? "-"}
                </td>
              ))}
              <td className="px-4 py-2 whitespace-nowrap">
                <button
                  onClick={() => onDeleteItem(item.part_no)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleMergeItems}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-md shadow-md transition"
      >
        Generate Estimate
      </button>

      {genrate && (
        <button
          onClick={handleAsstimate}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 ml-4 rounded-md shadow-md transition"
        >
          Show Estimate
        </button>
      )}
    </div>
  );
}
