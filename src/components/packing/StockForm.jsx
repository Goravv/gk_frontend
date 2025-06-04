import { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function StockForm({ onSuccess = () => {} }) {
  const navigate=useNavigate();
  const [form, setForm] = useState({ part_no: "", description: "", qty: "" });
  // const handleNavigation=()=>{
  //   navigate("/row-packing-list");
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/api/packing/stock/", form);
    setForm({ part_no: "", description: "", qty: "" });
    navigate('/stock-list')
    // onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Add Stock</h2>
      <input className="border p-1 mb-2 w-full" placeholder="Part No" value={form.part_no}
        onChange={(e) => setForm({ ...form, part_no: e.target.value })} />
      <input className="border p-1 mb-2 w-full" placeholder="Description" value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="border p-1 mb-2 w-full" type="number" placeholder="Qty" value={form.qty}
        onChange={(e) => setForm({ ...form, qty: e.target.value })} />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
}
