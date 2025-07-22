import { useState } from "react";
import axios from "axios";
import img from '../images/upload.svg';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState(null);
  const [summary, setSummary] = useState(""); // ✅ Summary state
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCategory("");
    setFeatures(null);
    setSummary(""); // ✅ Reset summary on file change
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a resume file first!");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/classify", formData, {

        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log("✅ Response:", res.data);

      setCategory(res.data.category);
      setSummary(res.data.summary);  // ✅ Save summary
      setFeatures(res.data.features);
    } catch (err) {
      alert("Upload failed. Please check your backend Sid.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4 py-10">
      <img src={img} alt="Upload" className="w-64 mb-6" />

      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Upload Resume for AI Classification
      </h1>

      <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl border border-blue-200">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Classify Resume"}
        </button>

        {category && (
          <div className="mt-6 text-green-600 font-semibold text-center">
            ✅ Predicted Category: <span className="text-black">{category}</span>
          </div>
        )}

        {summary && (
          <div className="mt-4 bg-blue-50 p-4 text-blue-800 rounded border border-blue-200">
            <strong>📝 Resume Summary:</strong>
            <p className="mt-1 whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {features && (
          <div className="mt-4 text-sm text-gray-700 bg-gray-50 p-4 rounded border">
            <p><strong>👤 Name:</strong> {features.Name || "Not Found"}</p>
            <p><strong>🧠 Experience:</strong> {features.Experience || "Not Found"}</p>
            <p><strong>🛠 Skills:</strong> {features.Skills || "Not Found"}</p>
            <p><strong>🎓 Education:</strong> {features.Education || "Not Found"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
