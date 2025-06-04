import { useEffect, useState } from 'react';
import API from '../../api'; // Update the path if needed

function Asstimate() {
  const [items, setItems] = useState([]);

  const fetchData = () => {
    API.get('api/asstimate/')
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching data:', err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopyFromEstimate = async () => {
    try {
      await API.post("/api/packing/packing/copy-from-estimate/");
      fetchData(); // refresh data
      alert("Lets start Packing for this order!!!")
    } catch (error) {
      console.error("Error copying from estimate:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Estimate List</h1>

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
          {items.map(item => (
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

      {/* Button to copy from estimate */}
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
