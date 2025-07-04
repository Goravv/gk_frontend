import { useEffect, useMemo, useState } from "react";
import Navbar2 from "../Navbar2";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setNextCaseNumber } from "../../app/Slices/packingSlice";
import { resetChoice } from "../../app/Slices/choiceSlice";
import API from "../../api";
import Cookies from "js-cookie";

const initialForm = {
  part_no: "",
  description: "",
  hsn_no: "",
  gst: "",
  brand_name: "",
  total_packing_qty: "",
  mrp_invoice: "",
  mrp_box: "",
  total_mrp: "",
  npr: "",
  nsr: "",
  packed_in_plastic_bag: "",
  case_no_start: "",
  case_no_end: "",
  total_case: "",
  net_wt: "",
  gross_wt: "",
  total_net_wt: "",
  total_gross_wt: "",
  length: "",
  width: "",
  height: "",
  cbm: "",
};


function Mix() {
  const selectedClient = useSelector((state) => state.client.selectedClient);
  const client_name = selectedClient?.client_name || "";
  const marka = selectedClient?.marka || "";
  const nextCaseNumber = useSelector((state) => state.packing.nextCaseNumber);

  const [packing, setPacking] = useState(null);
  const [stock, setStock] = useState(null);
  const [estimateList, setEstimateList] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [caseupdate, setCaseupdate] = useState(null);
  const [netWt, setNetWt] = useState([]);
  const [updates, setUpdates] = useState({
    gross_wt: 0,
    total_gross_wt: 0,
    length: 0,
    width: 0,
    height: 0,
    cbm: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const passedData = useMemo(() => location.state || {}, [location.state]);
  const initialCase = nextCaseNumber;
  const [selectedOption, setSelectedOption] = useState("");
  const [customInput, setCustomInput] = useState("");
  const notShow = ["total_mrp", "nsr", "npr","gross_wt","total_gross_wt","length","width","height","cbm"];
  const disable = [
    "part_no", "description", "hsn_no", "gst", "brand_name", 
    "packed_in_plastic_bag",
    "case_no_end","case_no_end", "total_case", "total_net_wt", "total_gross_wt", "cbm"
  ];

  useEffect(() => {
    setForm((prev) => ({ ...prev, case_no_start: initialCase.toString() }));
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [packingRes, stockRes, estimateRes] = await Promise.all([
          API.get(`api/packing/packing/?client_name=${client_name}&marka=${marka}`),
          API.get("/api/packing/stock/"),
          API.get(`/api/asstimate/?client_name=${client_name}&marka=${marka}`),
        ]);
        setPacking(packingRes.data);
        setStock(stockRes.data);
        setEstimateList(estimateRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (client_name && marka) fetchAll();
  }, [client_name, marka]);

  useEffect(() => {
    if (!(form.part_no && stock && packing)) return;
    const stockQty = stock.find(item => item.part_no === form.part_no)?.qty || 0;
    const packingQty = packing.find(item => item.part_no === form.part_no)?.qty || 0;
    setForm((prev) => ({ ...prev, total_packing_qty: Math.min(stockQty, packingQty).toString() }));
  }, [form.part_no, stock, packing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("api/packing/net-weight/", {
          params: { part_no: form.part_no },
        });
        setNetWt(res.data)
      } catch (err) {
        alert(err.response?.data?.error || "Error fetching data");
      }
    };
    if (form.part_no) {
      fetchData();
    }
  }, [form.part_no]);

  useEffect(() => {
    if (passedData.part_no && Array.isArray(estimateList)) {
      const matched = estimateList.find(item => item.part_no === passedData.part_no);
      if (matched) {
        setForm((prev) => ({
          ...prev,
          part_no: matched.part_no,
          description: matched.description || "",
          hsn_no: matched.hsn || "",
          gst: matched.tax_percent?.toString() || "",
          mrp_invoice: matched.mrp?.toString() || "",
          mrp_box: matched.mrp?.toString() || "",
        }));
      }
    }
  }, [passedData, estimateList]);

  useEffect(() => {
    if (passedData.part_no && Array.isArray(stock)) {
      const matched = stock.find(item => item.part_no === passedData.part_no);
      if (matched) {
        setForm((prev) => ({
          ...prev,
          brand_name: matched.brand_name?.toString() || "",
        }));
      }
    }
  }, [passedData, stock]);

  useEffect(() => {
    const qty = parseInt(form.total_packing_qty, 10);
    const perBox = parseInt(form.packed_in_plastic_bag, 10);
    if (!isNaN(qty) && !isNaN(perBox) && perBox !== 0) {
      setForm((prev) => ({ ...prev, total_case: Math.ceil(qty / perBox).toString() }));
    }
  }, [form.total_packing_qty, form.packed_in_plastic_bag]);

  useEffect(() => {
    const start = parseInt(form.case_no_start, 10);
    const total = parseInt(form.total_case, 10);
    if (!isNaN(start) && !isNaN(total)) {
      const end = start + total - 1;
      setForm((prev) => ({ ...prev, case_no_end: end.toString() }));
    }
  }, [form.case_no_start, form.total_case]);
  useEffect(() => {
    const length = parseFloat(updates.length);
    const width = parseFloat(updates.width);
    const height = parseFloat(updates.height);
    const totalBox = parseInt(form.total_case, 10);
    if (!isNaN(length) && !isNaN(width) && !isNaN(height) && !isNaN(totalBox)) {
      const cbm = (length * width * height * totalBox * 0.00001638).toFixed(4);
      setUpdates((prev) => ({ ...prev, cbm: cbm.toString() }));
    } else {
      setUpdates((prev) => ({ ...prev, cbm: "" }));
    }
  }, [updates.length, updates.width, updates.height, form.total_case]);
   useEffect(() => {
    const net_wt = parseFloat(form.net_wt);
    const total = parseInt(form.total_packing_qty, 10);
    if (!isNaN(net_wt) && !isNaN(total)) {
      const total_net_wt = (net_wt * total).toFixed(3);
      setForm((prev) => ({ ...prev, total_net_wt: total_net_wt.toString() }));
    } else {
      setForm((prev) => ({ ...prev, total_net_wt: "" }));
    }
  }, [form.net_wt, form.total_packing_qty]);
   useEffect(() => {
    const fetchNetWt = async () => {

      try {
        const res = await API.get(`api/packing/net-weight/`, {
          params: { part_no: form.part_no },
        });

        setForm((prev) => ({
          ...prev,
          net_wt: res.data.net_wt,
        }));
        console.log(res.data,"res")
        console.log(form,"form")
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (form.part_no) {
      fetchNetWt();
    }
  }, [form.part_no]);
  useEffect(() => {
    const mrp = parseFloat(form.mrp_invoice);
    const qty = parseInt(form.total_packing_qty, 10);
    if (!isNaN(mrp) && !isNaN(qty)) {
      const total_mrp = (mrp * qty).toFixed(2);
      setForm((prev) => ({ ...prev, total_mrp: total_mrp.toString() }));
    } else {
      setForm((prev) => ({ ...prev, total_mrp: "" }));
    }
  }, [form.mrp_invoice, form.total_packing_qty]);

  useEffect(() => {
    const gross_wt = parseFloat(updates.gross_wt);
    const total = parseInt(form.total_case, 10);
    if (!isNaN(gross_wt) && !isNaN(total)) {
      const total_gross_wt = (gross_wt * total).toFixed(3);
      setUpdates((prev) => ({
        ...prev,
        total_gross_wt: total_gross_wt.toString(),
      }));
    } else {
      setUpdates((prev) => ({ ...prev, total_gross_wt: "" }));
    }
  }, [updates.gross_wt, form.total_case]);

  useEffect(() => {
    const net_wt = parseFloat(form.net_wt);
    const total = parseInt(form.total_packing_qty, 10);
    if (!isNaN(net_wt) && !isNaN(total)) {
      setForm((prev) => ({ ...prev, total_net_wt: (net_wt * total).toFixed(2).toString() }));
    }
  }, [form.net_wt, form.total_packing_qty]);

  useEffect(()=>{
    setForm((prev) => ({ ...prev, packed_in_plastic_bag: form.total_packing_qty }));
  },[form.total_packing_qty])

  const handleInputChange = (e, isUpdate = false) => {
    const { name, value } = e.target;
    if (isUpdate) setUpdates(prev => ({ ...prev, [name]: value }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };
   const getCsrfToken = async () => {
    try {
      await API.get("/api/asstimate/set-csrf-cookie/", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error setting CSRF cookie:", error);
    }
  };
   const handleSelectChangeNetwt=(e)=>{
    const value = e.target.value;
    setSelectedOption(value);

    if (value !== "Other") {
      setForm((prev) => ({ ...prev, net_wt: value.toString() }));
    } 
  }
    const handleNetwt = async () => {
    try {
      await getCsrfToken();
      const token = Cookies.get("csrftoken");
      const res = await API.post(
        "api/packing/net-weight/",
        {
          part_no: form.part_no,
          net_wt: parseFloat(form.net_wt),
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": token,
          },
          withCredentials: true,
        }
      );
      console.log(res);
    } catch (err) {
      alert(err.response?.data?.error || "Error posting data");
    }
  };
 const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };
  const handleCustomInputChange = (e) => {
  const value = e.target.value;
  setCustomInput(value);
  setForm((prev) => ({ ...prev, net_wt: value }));
};
  const preparePayload = () => {
    const payload = { client: client_name, marka, part_no: form.part_no };
    Object.entries(initialForm).forEach(([key]) => {
      if (key === "part_no") return;
      const val = form[key];
      if (val === "") payload[key] = null;
      else if (["gst", "mrp_invoice", "mrp_box", "total_mrp", "npr", "nsr", "net_wt", "gross_wt", "total_net_wt", "total_gross_wt", "length", "width", "height", "cbm"].includes(key)) {
        payload[key] = parseFloat(val);
      } else if (["total_packing_qty", "packed_in_plastic_bag", "case_no_start", "case_no_end", "total_case"].includes(key)) {
        payload[key] = parseInt(val, 10);
      } else {
        payload[key] = val;
      }
    });
    return payload;
  };
const updatePackingDetails = async (e) => {
    e.preventDefault();
        try {
            console.log(form.case_no_start)
        await API.post("api/packing/packingdetail/update-by-case/", {
            case_no_start: form.case_no_start,
            client: client_name,
            marka,
            updates,
        });
        console.log( {
            case_no_start: form.case_no_start,
            client: client_name,
            marka,
            updates,
        })
        dispatch(resetChoice());
        dispatch(setNextCaseNumber(form.case_no_end+1 ));
        handleNetwt();
        alert("Packing details updated successfully!");
        navigate("/row-packing-list");
        } catch (error) {
        alert("Update failed: " + (error.response?.data?.error || error.message));
        }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.part_no) return alert("Part number is required.");
    if (parseFloat(form.total_net_wt) > parseFloat(form.total_gross_wt)) {
      return alert("Total gross weight must be more than net weight.");
    }
    try {
        await API.post(`api/packing/net-weight/`, {
          part_no: form.part_no,
          net_wt: parseFloat(form.net_wt),
        });
      } catch (err) {
        alert(err.response?.data?.error || "Error submitting data");
        return;
      }
    try {
      if (passedData.part_no) {
        await API.post("/api/packing/packing/delete-by-partno/", {
          part_no: form.part_no,
          qty: parseInt(form.total_packing_qty, 10) || 0,
          client: client_name,
          marka,
        });
      }
      const payload = preparePayload();
      await API.post("/api/packing/packing-details/", payload);
      
      if (window.confirm("Add more items to this case?")) {
        navigate("/row-packing-list");
      } else {
        setCaseupdate("d");
      }
    //   setForm(initialForm);
    } catch (error) {
      alert("Error submitting form: " + (error.response?.data?.error || error.message));
    }
  };

  

  return (
    <div>
      {caseupdate ? (
        <form onSubmit={updatePackingDetails} className="space-y-4 p-4 max-w-md mx-auto">
          {Object.entries(updates).map(([key, value]) => (
            <div key={key}>
              <label className="block font-semibold mb-1">{key}</label>
              <input
                name={key}
                type="number"
                value={value}
                onChange={(e) => handleInputChange(e, true)}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit Updates
          </button>
        </form>
      ) : (
        <>
          <Navbar2 />
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
          {Object.entries(form).map(([key, value]) => {
            if (notShow.includes(key)) return null;

            return key === "net_wt" ? (
              <div key={key}>
                 <div className="p-4">
      <label className="block mb-2 font-semibold">Net Wiegth</label>
      <select
        value={selectedOption}
        onChange={handleSelectChangeNetwt}
        className="border px-2 py-1"
      >
        <option value="">-- Select --</option>
        {netWt.map((opt, index) => (
          <option key={index} value={opt.net_wt}>
            {`${opt.net_wt}     ---   ${opt.count}`}
          </option>
        ))}
        <option value="Other">New Net Wiegth</option>
      </select>

       {selectedOption === "Other" && (
        <div className="mt-2">
          <input
            name="net wt"
            type="text"
            placeholder="Enter custom option"
            value={customInput}
            onChange={handleCustomInputChange}
            className="border px-2 py-1"
          />
        </div>
      )}
    </div>
              </div>
            ) : (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="block text-sm font-medium text-gray-700 mb-1 capitalize"
                  >
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    id={key}
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={disable.includes(key)}
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    className={`w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      disable.includes(key)
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                </div>
              );
          })}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Submit
          </button>
        </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Mix;