import { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar2 from "../Navbar2";

export default function PackingForm({ onSuccess = () => {} }) {
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const client_name = selectedClient?.client_name || "";
  const marka = selectedClient?.marka || "";

  const navigate = useNavigate();
  const [form, setForm] = useState({
    part_no: "",
    description: "",
    qty: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      client: client_name,
      marka: marka,
    };

    try {
      await API.post("/api/packing/packing/", dataToSend);
      setForm({ part_no: "", description: "", qty: "" });
      onSuccess();
      navigate("/packing-list");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error adding packing item");
    }
  };

  return (
    <div>
      <Navbar2 />
      <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-bold mb-2">Add Packing</h2>
        <input
          className="border p-1 mb-2 w-full"
          placeholder="Part No"
          value={form.part_no}
          onChange={(e) => setForm({ ...form, part_no: e.target.value })}
        />
        <input
          className="border p-1 mb-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="border p-1 mb-2 w-full"
          type="number"
          placeholder="Qty"
          value={form.qty}
          onChange={(e) => setForm({ ...form, qty: e.target.value })}
        />
        <button className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
      </form>
    </div>
  );
}
