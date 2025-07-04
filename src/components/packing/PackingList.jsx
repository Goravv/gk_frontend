// import { useEffect, useState } from "react";
// import API from "../../api";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import Navbar2 from "../Navbar2";

// export default function PackingList() {
//   const selectedClient = useSelector((state) => state.client.selectedClient);
//   const client_name = selectedClient?.client_name || "";
//   const marka = selectedClient?.marka || "";

//   const [data, setData] = useState([]);
//   const navigate = useNavigate();

//   const fetchData = async () => {
//     try {
//       const res = await API.get("/api/packing/packing/", {
//         params: { client: client_name, marka }, // ✅ correct param keys
//       });
//       setData(res.data);
//     } catch (error) {
//       console.error("Error fetching packing data:", error);
//     }
//   };

//   const handleDelete = async (part_no) => {
//     const dataToPass = {
//       part_no: part_no,
//     };
//     navigate("/startpacking", { state: dataToPass });
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="p-4 bg-white rounded shadow mt-4">
//       <Navbar2 />
//       <h2 className="text-lg font-bold mb-2">Packing List</h2>
//       <table className="w-full table-auto border">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-4 py-2">Part No</th>
//             <th className="border px-4 py-2">Qty</th>
//             <th className="border px-4 py-2">Stock Qty</th>
//             <th className="border px-4 py-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((p) => (
//             <tr key={p.part_no} className="text-center">
//               <td className="border px-4 py-2">{p.part_no}</td>
//               <td className="border px-4 py-2">{p.qty}</td>
//               <td className="border px-4 py-2">{p.stock_qty}</td>
//               <td className="border px-4 py-2">
//                 <button
//                   onClick={() => handleDelete(p.part_no)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Start Packing
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {data.length === 0 && (
//             <tr>
//               <td colSpan="4" className="text-center py-4 text-gray-500">
//                 No packing items found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import API from "../../api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar2 from "../Navbar2";
import { setNextCaseNumber } from "../../app/Slices/packingSlice";

export default function PackingList() {
  const dispatch=useDispatch()
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const client_name = selectedClient?.client_name || "";
  const marka = selectedClient?.marka || "";

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await API.get("/api/packing/packing/", {
        params: { client: client_name, marka },
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching packing data:", error);
    }
  };
    // Fetch packing details and set next case number
  useEffect(() => {
    if (!client_name || !marka) return;

    const fetchPackingDetails = async () => {
      try {
        const { data } = await API.get(`/api/packing/packing-details/?client=${client_name}&marka=${marka}`);
        console.log(data[data.length - 1].cbm)
        const nextCaseNo = data.length === 0 ? 1 : data[data.length - 1].cbm===null?data[data.length - 1].case_no_end:data[data.length - 1].case_no_end + 1;
        console.log(nextCaseNo)
        dispatch(setNextCaseNumber(nextCaseNo));
      } catch (error) {
        console.error('Failed to fetch packing data:', error);
        alert('Error fetching packing data.');
      }
    };

    fetchPackingDetails();
  }, [client_name, marka, dispatch]);

  const handleDelete = async (part_no) => {
    const dataToPass = {
      part_no: part_no,
    };
    navigate("/startpacking", { state: dataToPass });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered data based on search
  const filteredData = data.filter((p) =>
    p.part_no.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <Navbar2 />
      <h2 className="text-lg font-bold mb-2">Packing List</h2>

      {/* 🔍 Search input */}
      <input
        type="text"
        placeholder="Search by Part No"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <table className="w-full table-auto border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Part No</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Stock Qty</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((p) => (
            <tr key={p.part_no} className="text-center">
              <td className="border px-4 py-2">{p.part_no}</td>
              <td className="border px-4 py-2">{p.qty}</td>
              <td className="border px-4 py-2">{p.stock_qty}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(p.part_no)}
                  className="text-red-600 hover:underline"
                >
                  Start Packing
                </button>
              </td>
            </tr>
          ))}
          {filteredData.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No matching packing items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

