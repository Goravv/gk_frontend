// src/components/client/ClientDisplay.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSelectedClient } from "../../app/Slices/clientSlice";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import Navbar from "../Navbar";

const ClientDisplay = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [clientName, setClientName] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get("api/client/clients/");
        setClients(res.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  const handleSelect = (e) => {
    const [name, marka] = e.target.value.split("--");
    const selected = clients.find(
      (c) => c.client_name === name && c.marka === marka
    );
    if (selected) {
      dispatch(setSelectedClient(selected));
      setClientName(`${selected.client_name}--${selected.marka}`);
    } else {
      setClientName(null);
    }
  };

  const handleContinue = () => {
    navigate("/orderitem"); // Or wherever you want to go
  };

  return (
    <div className="p-4">
      <Navbar />
      <label htmlFor="clientSelect" className="block mb-2 font-bold">
        Select Existing Client
      </label>
      <select
        id="clientSelect"
        name="client"
        onChange={handleSelect}
        className="border p-2 mb-4 w-full"
      >
        <option value="">-- Select Client --</option>
        {clients.map((c) => (
          <option
            key={`${c.client_name}--${c.marka}`}
            value={`${c.client_name}--${c.marka}`}
          >
            {c.client_name} -- {c.marka}
          </option>
        ))}
      </select>

      {clientName && (
        <button
          onClick={handleContinue}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
        >
          Continue with {clientName}
        </button>
      )}

      <Link
        to="/create-client"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create New Client
      </Link>
    </div>
  );
};

export default ClientDisplay;
