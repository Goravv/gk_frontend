import React from "react";

const DataTable = ({ data, onDeleteAll }) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-bold">All Items</h2>
        <button className="bg-red-700 text-white px-3 py-2 rounded" onClick={onDeleteAll}>
          Delete All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Item Code</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Segment</th>
              <th className="px-4 py-2">MRP</th>
              <th className="px-4 py-2">HSN</th>
              <th className="px-4 py-2">GST %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.item_code} className="border-t">
                <td className="px-4 py-2">{item.item_code}</td>
                <td className="px-4 py-2">{item.item_description}</td>
                <td className="px-4 py-2">{item.item_segment}</td>
                <td className="px-4 py-2">{item.mrp_per_unit}</td>
                <td className="px-4 py-2">{item.hsn_code}</td>
                <td className="px-4 py-2">{item.gst_percent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
