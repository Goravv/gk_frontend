import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../../api";
import { setNextCaseNumber } from "../../app/Slices/packingSlice";


const initialForm = {
  part_no: "",
  total_qty: "",
  box_mrp: "",
  qty_per_box: "",
  case_no_start: "",
  case_no_end: "",
  total_box: "",
  net_wt: "",
  gross_wt: "",
  length: "",
  width: "",
  height: "",
  cbm: "",
};

const StartPacking = ({ onSuccess = () => {} }) => {
  const navigate=useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const nextCaseNumber = useSelector((state) => state.packing.nextCaseNumber);

  const [form, setForm] = useState(initialForm);
  const [packing, setPacking] = useState(null);
  const [stock, setStock] = useState(null);
  const [estimateList, setEstimateList] = useState(null);
  const initialCase=nextCaseNumber;

  const disable = ["case_no_end", "total_box", "cbm"];
  const passedData = useMemo(() => location.state || {}, [location.state]);
  useEffect(()=>{
    setForm((prev) => ({ ...prev, case_no_start: initialCase.toString() }));
  },[])

  useEffect(() => {
    if (passedData.part_no) {
      setForm((prev) => ({ ...prev, part_no: passedData.part_no }));
    }
  }, [passedData]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [packingRes, stockRes, estimateRes] = await Promise.all([
          API.get("/api/packing/packing/"),
          API.get("/api/packing/stock/"),
          API.get("/api/asstimate/"),
        ]);
        setPacking(packingRes.data);
        setStock(stockRes.data);
        setEstimateList(estimateRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (form.part_no && estimateList) {
      const match = estimateList.find((item) => item.part_no === form.part_no);
      if (match) {
        setForm((prev) => ({ ...prev, box_mrp: match.mrp }));
      }
    }
  }, [form.part_no, estimateList]);

  useEffect(() => {
    if (!form.part_no || !stock || !packing) return;

    const stockMatch = stock.find((item) => item.part_no === form.part_no);
    const packingMatch = packing.find((item) => item.part_no === form.part_no);

    const stockQty = stockMatch?.qty || 0;
    const packingQty = packingMatch?.qty || 0;

    const minQty = Math.min(stockQty, packingQty);

    setForm((prev) => ({ ...prev, total_qty: minQty.toString() }));
  }, [form.part_no, stock, packing]);

  useEffect(() => {
    const qty = parseFloat(form.total_qty);
    const perBox = parseFloat(form.qty_per_box);
    if (!isNaN(qty) && !isNaN(perBox) && perBox !== 0) {
      const totalBox = Math.ceil(qty / perBox);
      setForm((prev) => ({ ...prev, total_box: totalBox.toString() }));
    } else {
      setForm((prev) => ({ ...prev, total_box: "" }));
    }
  }, [form.total_qty, form.qty_per_box]);

  useEffect(() => {
    const start = parseInt(form.case_no_start, 10);
    const total = parseInt(form.total_box, 10);
    if (!isNaN(start) && !isNaN(total)) {
      const end = start + total - 1;
      setForm((prev) => ({ ...prev, case_no_end: end.toString() }));
      dispatch(setNextCaseNumber(end + 1));
    } else {
      setForm((prev) => ({ ...prev, case_no_end: "" }));
    }
  }, [form.case_no_start, form.total_box, dispatch]);

  // useEffect(() => {
  //   const net_wt = parseInt(form.net_wt, 10);
  //   const item = parseInt(form.qty_per_box, 10);
  //   if (!isNaN(net_wt) && !isNaN(item)) {
  //     const gross_wt = net_wt * item + 1;
  //     setForm((prev) => ({ ...prev, gross_wt: gross_wt.toString() }));
  //   } else {
  //     setForm((prev) => ({ ...prev, gross_wt: "" }));
  //   }
  // }, [form.net_wt, form.qty_per_box]);

  useEffect(() => {
    const length = parseFloat(form.length);
    const width = parseFloat(form.width);
    const height = parseFloat(form.height);
    const totalBox = parseFloat(form.total_box);
    if (!isNaN(length) && !isNaN(width) && !isNaN(height) && !isNaN(totalBox)) {
      const cbm = (length * width * height * totalBox * 0.00001638).toFixed(4);
      setForm((prev) => ({ ...prev, cbm: cbm.toString() }));
    } else {
      setForm((prev) => ({ ...prev, cbm: "" }));
    }
  }, [form.length, form.width, form.height, form.total_box]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleNavigation=()=>{
    navigate("/row-packing-list");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passedData.part_no) {
        await API.post("/api/packing/packing/delete-by-partno/", {
          part_no: form.part_no,
          qty: parseInt(form.total_qty),
        });
        alert("Packing updated (quantity reduced or deleted)");
      }
      await API.post("/api/packing/packing-details/", form);
      alert("Packing detail added.");
      setForm(initialForm);
      onSuccess();
      handleNavigation();
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {key.replace(/_/g, " ")}
            </label>
            <input
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              disabled={disable.includes(key)}
              placeholder={`Enter ${key.replace(/_/g, " ")}`}
              className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                disable.includes(key) ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default StartPacking;
