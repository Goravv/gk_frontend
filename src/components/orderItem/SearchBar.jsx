import React from 'react';

export default function SearchBar({ value, onChange, onDeleteAll }) {
  return (
    <div className="flex items-center mb-6 space-x-4">
      <input
        id='searchorder'
        type="text"
        placeholder="Search by Part No."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={onDeleteAll}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
      >
        Delete All Items
      </button>
    </div>
  );
}
