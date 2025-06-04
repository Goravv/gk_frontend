import { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

export default function PackingForm({ onSuccess = () => {} }) {
  const navigate=useNavigate();
  const [form, setForm] = useState({ part_no: "", description: "", qty: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/api/packing/packing/", form);
    setForm({ part_no: "", description: "", qty: "" });
    onSuccess();
    navigate("/packing-list")
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Add Packing</h2>
      <input className="border p-1 mb-2 w-full" placeholder="Part No" value={form.part_no}
        onChange={(e) => setForm({ ...form, part_no: e.target.value })} />
      <input className="border p-1 mb-2 w-full" placeholder="Description" value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input className="border p-1 mb-2 w-full" type="number" placeholder="Qty" value={form.qty}
        onChange={(e) => setForm({ ...form, qty: e.target.value })} />
      <button className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
    </form>
  );
}
