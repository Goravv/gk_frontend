import API from "../../api";

export default function CopyFromEstimateButton({ onSuccess }) {
  const handleClick = async () => {
    await API.post("/api/packing/packing/copy-from-estimate/");
    onSuccess();
  };

  return (
    <button onClick={handleClick} className="bg-purple-600 text-white px-4 py-2 rounded mt-4">
      Copy from Estimate
    </button>
  );
}
