import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedClient } from '../../app/Slices/clientSlice';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api';
import Navbar from '../Navbar';

const ClientDisplay = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const dispatch = useDispatch();
  const [clientName, setClientName] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get('api/client/clients/');
        // Only set clients if user is authenticated and response is valid
        setClients(res.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  const handleSelect = (e) => {
    const [name, marka] = e.target.value.split('--');
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

  const handleOrder = () => {
    navigate('/orderitem');
  };

  return (
    <div className="p-4">
      <Navbar />
      <label htmlFor="clientSelect" className="block mb-2 font-bold">
        Existing Client
      </label>

      {clients.length === 0 ? (
        <p className="text-gray-500 mb-4">No clients found for your account.</p>
      ) : (
        <select
          id="clientSelect"
          name="client"
          onChange={handleSelect}
          className="border p-2 mb-4 w-full"
        >
          <option value="">-- Select Client --</option>
          {clients.map((c) => (
            <option key={`${c.client_name}-${c.marka}`} value={`${c.client_name}--${c.marka}`}>
              {`${c.client_name}--${c.marka}`}
            </option>
          ))}
        </select>
      )}

      {clientName && (
        <>
          <button
            onClick={handleOrder}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go for {clientName}
          </button>
          <br />
          <br />
        </>
      )}

      <Link
        to="/create-client"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create New Client
      </Link>
    </div>
  );
};

export default ClientDisplay;
