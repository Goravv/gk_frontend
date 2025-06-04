import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";
import SearchDelete from "./SearchDelete";
import UploadBox from "./UploadBox";
import API from "../../api";

export default function MRP() {
  const [data, setData] = useState([]);

  const fetchAll = async () => {
    const res = await API.get("api/mrp/data/");
    setData(res.data);
  };

  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure to delete all data?")) {
      await API.delete("api/mrp/delete-all/");
      fetchAll();
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Excel Item Manager
      </h1>
      <UploadBox onUpload={fetchAll} />
      {data.length>0? <><SearchDelete />
      <DataTable data={data} onDeleteAll={handleDeleteAll} /></>:null}
      
    </div>
  );
}
