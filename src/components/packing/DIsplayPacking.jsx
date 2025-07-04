import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import API from "../../api";
import Navbar2 from "../Navbar2";

const DisplayPackingList = () => {
  const { client_name, marka, id } = useSelector(
    (state) => state.client.selectedClient
  );

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    total_packing_qty: 0,
    total_mrp: 0,
    total_case: 0,
    total_net_wt: 0,
    total_gross_wt: 0,
    cbm: 0,
  });

  const navigate = useNavigate();

  // Fetch packing details
  const fetchPackingData = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/packing/packing-details/?client=${client_name}&marka=${marka}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch packing data:", error);
      alert("Error fetching packing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackingData();
  }, []);

  useEffect(() => {
    const newTotals = {
      total_packing_qty: 0,
      total_mrp: 0,
      total_case: 0,
      total_net_wt: 0,
      total_gross_wt: 0,
      cbm: 0,
    };

    const countedCases = new Set();

    data.forEach((row) => {
      const caseKey = `${row.case_no_start}|${row.case_no_end}`;

      newTotals.total_packing_qty += Number(row.total_packing_qty || 0);
      newTotals.total_mrp += Number(row.total_mrp || 0);
      newTotals.total_net_wt += Number(row.total_net_wt || 0);

      if (!countedCases.has(caseKey)) {
        countedCases.add(caseKey);
        newTotals.total_case += Number(row.total_case || 0);
        newTotals.total_gross_wt += Number(row.total_gross_wt || 0);
        newTotals.cbm += Number(row.cbm || 0);
      }
    });

    setTotals(newTotals);
  }, [data]);

  const getCaseKey = (row) => `${row.case_no_start}-${row.case_no_end}`;

  const mergeInfo = {};
  data.forEach((row) => {
    const key = getCaseKey(row);
    if (!mergeInfo[key]) {
      mergeInfo[key] = { count: 0, shown: false };
    }
    mergeInfo[key].count++;
  });

  const handleDownloadExcel = () => {
    if (data.length === 0) return alert("No data to export.");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Packing Data");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, `${client_name}_packing_data.xlsx`);
  };

  const handleDeleteClient = async () => {
    const input = prompt(`Type DELETE to confirm deletion of "${client_name}"`);
    if (input !== "DELETE") {
      alert("Client deletion cancelled.");
      return;
    }

    try {
      await API.delete(`/api/client/clients/${id}/`);
      alert(`Client "${client_name}" deleted successfully.`);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete client:", error);
      alert("Error deleting client.");
    }
  };

  return (
    <div className="p-4">
      <Navbar2 />
      <h2 className="text-xl font-bold mb-4">Packing Data</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <button
          onClick={handleDownloadExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Excel
        </button>

        <button
          onClick={handleDeleteClient}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Client
        </button>
      </div>

      {loading ? (
        <p>Loading packing data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No packing data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="border border-gray-400 min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Part No</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">HSN No</th>
                <th className="border px-2 py-1">GST</th>
                <th className="border px-2 py-1">Brand</th>
                <th className="border px-2 py-1">Total Packing Qty</th>
                <th className="border px-2 py-1">MRP Invoice</th>
                <th className="border px-2 py-1">MRP Box</th>
                <th className="border px-2 py-1">Total MRP</th>
                <th className="border px-2 py-1">NPR</th>
                <th className="border px-2 py-1">NSR</th>
                <th className="border px-2 py-1">Plastic Bag</th>
                <th className="border px-2 py-1">Case No Start</th>
                <th className="border px-2 py-1">Case No End</th>
                <th className="border px-2 py-1">Total Case</th>
                <th className="border px-2 py-1">Net Wt</th>
                <th className="border px-2 py-1">Total Net Wt</th>
                <th className="border px-2 py-1">Gross Wt</th>
                <th className="border px-2 py-1">Total Gross Wt</th>
                <th className="border px-2 py-1">Length</th>
                <th className="border px-2 py-1">Width</th>
                <th className="border px-2 py-1">Height</th>
                <th className="border px-2 py-1">CBM</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const key = getCaseKey(row);
                const showMerged = !mergeInfo[key].shown;
                if (showMerged) mergeInfo[key].shown = true;

                return (
                  <tr key={index}>
                    <td className="border px-2 py-1">{row.part_no}</td>
                    <td className="border px-2 py-1">{row.description}</td>
                    <td className="border px-2 py-1">{row.hsn_no}</td>
                    <td className="border px-2 py-1">{row.gst}</td>
                    <td className="border px-2 py-1">{row.brand_name}</td>
                    <td className="border px-2 py-1">
                      {row.total_packing_qty}
                    </td>
                    <td className="border px-2 py-1">{row.mrp_invoice}</td>
                    <td className="border px-2 py-1">{row.mrp_box}</td>
                    <td className="border px-2 py-1">{row.total_mrp}</td>
                    <td className="border px-2 py-1">{row.npr}</td>
                    <td className="border px-2 py-1">{row.nsr}</td>
                    <td className="border px-2 py-1">
                      {row.packed_in_plastic_bag}
                    </td>
                    {showMerged && (
                      <>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.case_no_start}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.case_no_end}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.total_case}
                        </td>
                      </>
                    )}
                    <td className="border px-2 py-1">{row.net_wt}</td>
                    <td className="border px-2 py-1">{row.total_net_wt}</td>

                    {showMerged && (
                      <>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.gross_wt}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.total_gross_wt}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.length}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.width}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.height}
                        </td>
                        <td
                          className="border px-2 py-1"
                          rowSpan={mergeInfo[key].count}
                        >
                          {row.cbm}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-yellow-100 font-semibold">
                <td className="border px-2 py-1" colSpan={5}>
                  Total
                </td>
                <td className="border px-2 py-1">{totals.total_packing_qty}</td>
                <td></td>
                <td></td>
                <td className="border px-2 py-1">
                  {totals.total_mrp.toFixed(2)}
                </td>
                <td colSpan={5}></td>
                <td className="border px-2 py-1">
                  {totals.total_case.toFixed(3)}
                </td>
                <td></td>
                <td className="border px-2 py-1">
                  {totals.total_net_wt.toFixed(3)}
                </td>
                <td></td>
                <td className="border px-2 py-1">
                  {totals.total_gross_wt.toFixed(3)}
                </td>
                <td colSpan={3}></td>
                <td className="border px-2 py-1">{totals.cbm.toFixed(3)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisplayPackingList;
