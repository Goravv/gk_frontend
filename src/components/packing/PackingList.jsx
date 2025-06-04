import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function PackingList() {
  const [data, setData] = useState([]);
  const navigate=useNavigate();

  const fetchData = async () => {
    try {
      const res = await API.get("/api/packing/packing/");
      setData(res.data);
    } catch (error) {
      console.error("Error fetching packing data:", error);
    }
  };

  const handleDelete = async (part_no) => {
    const dataToPass = {
      part_no: part_no,
    };
    navigate("/startpacking" ,{ state: dataToPass })
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Packing List</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Part No</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Stock Qty</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.part_no} className="text-center">
              <td className="border px-4 py-2">{p.part_no}</td>
              <td className="border px-4 py-2">{p.qty}</td>
              <td className="border px-4 py-2">{p.stock_qty}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(p.part_no)}
                  className="text-red-600 hover:underline"
                >
                  start packing
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No packing items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
