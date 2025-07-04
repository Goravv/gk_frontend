import Separate from "./seprate";
import Mix from "./mix";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setChoice } from "../../app/Slices/choiceSlice";
import CaseNumberFetcher from "../caseNoFetcher";

const StartPacking = () => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState("");
  const [choices,setChoices] = useState(useSelector((state) => state.choice.choice));
  const selectedClient = useSelector((state) => state.client.selectedClient);
    const client_name = selectedClient?.client_name;
    const marka = selectedClient?.marka;
  const handleChoices=()=>{
    dispatch(setChoice(selected));;
    setChoices(selected);
  }

  return (
    <div>
      <CaseNumberFetcher client_name={client_name} marka={marka} />
      {choices === "Separate" ? <Separate /> : choices === "Mix" ? <Mix /> :  (
      <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md space-y-4">
        <h2 className="text-xl font-bold text-gray-700">
          Choose Packing Type
        </h2>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="packingType"
              value="Separate"
              checked={selected === "Separate"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-blue-600"
            />
            <span>Single item packing</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="packingType"
              value="Mix"
              checked={selected === "Mix"}
              onChange={(e) => setSelected(e.target.value)}
              className="accent-blue-600"
            />
            <span>Multiple items packing</span>
          </label>
        </div>

        <button
          onClick={handleChoices}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Start Packing
        </button>
      </div>
    )}
    </div>
  );
};

export default StartPacking;
