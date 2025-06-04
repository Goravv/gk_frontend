import React from 'react';
import {useNavigate } from 'react-router-dom';

function Packing() {
  const navigate = useNavigate();

  return (
    <div>
    <div className="flex space-x-4 p-4 bg-gray-50 rounded shadow">
      <button
        onClick={() => navigate('/add-stock')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Add Stock List
      </button>
      <button
        onClick={() => navigate('/add-packing')}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Add To Row Packing List
      </button>
      <button
        onClick={() => navigate('/row-packing-list')}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
      >
        Row Packing List
      </button>
      <button
        onClick={() => navigate('/stock-list')}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Stock List
      </button>
      <button
        onClick={() => navigate('/packing-list')}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Packing List
      </button>
    </div>
    {/* <Routes>
          <Route path="/add-stock" element={<StockForm />} />
          <Route path="/add-packing" element={<PackingForm />} />
          <Route path="/row-packing-list" element={<PackingList />} />
          <Route path="/stock-list" element={<StockList />} />
          <Route path="/packing-list" element={<DisplayPackingList />} />
        </Routes> */}

    </div>
  );
}

export default Packing;

