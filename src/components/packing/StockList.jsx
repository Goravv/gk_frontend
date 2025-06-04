import { useEffect, useState } from "react";
import API from "../../api"; // Make sure this is correctly configured

export default function StockList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/packing/stock/");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Stock List</h2>
      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Part No</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Qty</th>
          </tr>
        </thead>
        <tbody>
          {data.map(s => (
            <tr key={s.part_no} className="text-center">
              <td className="border px-4 py-2">{s.part_no}</td>
              <td className="border px-4 py-2">{s.description}</td>
              <td className="border px-4 py-2">{s.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
