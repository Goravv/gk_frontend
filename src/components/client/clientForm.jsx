// src/components/client/ClientForm.jsx
import React, { useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";

const ClientForm = ({ onSuccess }) => {
  const [client_name, setClientName] = useState("");
  const [marka, setMarka] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { client_name, marka, country };
      const res = await API.post("api/client/clients/", payload);
      alert("Client created successfully");
      if (onSuccess) {
        onSuccess(res.data);
      }
      navigate("/client")
    } catch (error) {
      if (error.response?.data?.client_name) {
        alert("Client with this name already exists.");
      } else {
        alert("Error creating client");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded">
      <input
        value={client_name}
        onChange={(e) => setClientName(e.target.value)}
        placeholder="Client Name"
        required
        className="block w-full mb-2 p-2 border"
      />
      <input
        value={marka}
        onChange={(e) => setMarka(e.target.value)}
        placeholder="Marka"
        className="block w-full mb-2 p-2 border"
      />
      <input
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
        className="block w-full mb-2 p-2 border"
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Client"}
      </button>
    </form>
  );
};

export default ClientForm;
