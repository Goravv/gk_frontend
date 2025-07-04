import { useEffect, useState } from "react";
import API from "../../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Navbar2 from "../Navbar2";

function Asstimate() {
  const navigate = useNavigate();
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const client_name = selectedClient?.client_name || "";
  const marka = selectedClient?.marka || "";

  const [items, setItems] = useState([]);

  const fetchData = () => {
    API.get(`/api/asstimate/?client_name=${client_name}&marka=${marka}`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyFromEstimate = async () => {
    try {
      await API.post("/api/packing/packing/copy-from-estimate/", {
        client: client_name,  // ✅ key updated here
        marka, // optional — keep only if used in backend
      });
      fetchData(); // Refresh data
      alert("Let's start Packing for this order!!!");
      navigate("/packing");
    } catch (error) {
      console.error("Error copying from estimate:", error);
      alert("Failed to copy from estimate.");
    }
  };

  const handleDownloadExcel = () => {
    if (!Array.isArray(items) || items.length === 0) {
      alert("No Data available to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(items);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packing items");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `${client_name}_${marka}_estimate_data.xlsx`);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <Navbar2 />
      <h1 className="text-2xl font-bold mb-6 text-center">Estimate List</h1>

      <button
        onClick={handleDownloadExcel}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Excel
      </button>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Part No</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">MRP</th>
            <th className="border px-4 py-2">Total Amt</th>
            <th className="border px-4 py-2">Tax %</th>
            <th className="border px-4 py-2">HSN</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.part_no} className="text-center">
              <td className="border px-4 py-2">{item.part_no}</td>
              <td className="border px-4 py-2">{item.description}</td>
              <td className="border px-4 py-2">{item.qty}</td>
              <td className="border px-4 py-2">{item.mrp}</td>
              <td className="border px-4 py-2">{item.total_amt_mrp}</td>
              <td className="border px-4 py-2">{item.tax_percent}</td>
              <td className="border px-4 py-2">{item.hsn}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center">
        <button
          onClick={handleCopyFromEstimate}
          className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
        >
          Create row packing list
        </button>
      </div>
    </div>
  );
}

export default Asstimate;
