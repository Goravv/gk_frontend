import React, { useEffect, useState } from "react";
import API from "../../api";

const DisplayPackingList = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await API.get("/api/packing/packing-details/");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Packing Data</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr>
            {data[0] &&
              Object.keys(data[0]).map((key) => (
                <th key={key} className="border px-2 py-1">
                  {key}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              {Object.values(item).map((val, i) => (
                <td key={i} className="border px-2 py-1">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayPackingList;
