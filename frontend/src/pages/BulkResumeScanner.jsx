import { useState } from "react";
import axios from "axios";
import img1 from '../images/upload1.svg';

export default function BulkResumeScanner() {
  const [resumes, setResumes] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResumeChange = (e) => {
    let files = Array.from(e.target.files);

    if (files.length > 10) {
      alert("⚠️ You can upload a maximum of 10 resumes.");
      files = files.slice(0, 10); // Limit to first 10 files
    }

    setResumes(files);
    setResultData(null); // Clear old results
  };

  const handleMatch = async () => {
    if (resumes.length === 0) {
      alert("Please upload at least one resume.");
      return;
    }

    const formData = new FormData();
    resumes.forEach((file) => formData.append("resumes", file));

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/bulk-scan", formData);
      console.log("📦 Backend response:", response.data);
      setResultData(response.data);
    } catch (error) {
      alert("Scanning failed. Check backend.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-2xl shadow mt-10 border border-black">
      <img
        src={img1}
        alt="Resume Scanner Illustration"
        className="w-64 mx-auto mb-6"
      />

      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
        Bulk Resume Scanner (Max 10 Resumes)
      </h2>

      <input
        type="file"
        multiple
        accept=".txt,.pdf"
        onChange={handleResumeChange}
        className="mb-2"
      />

      {resumes.length > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          📂 {resumes.length} file{resumes.length > 1 ? "s" : ""} selected
        </p>
      )}

      <button
        onClick={handleMatch}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
      >
        {loading ? "Scanning..." : "Scan Resumes"}
      </button>

      {resultData?.top_resumes?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">📊 Matched Results:</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-3">
            {resultData.top_resumes.map((res, i) => (
              <li key={i}>
                <strong>{res.filename}</strong>{" "}
                <span className="text-sm text-green-700 font-medium">
                  — Match: {res.match_percentage}%
                </span>
                <br />
                <span className="text-sm text-gray-600">{res.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
