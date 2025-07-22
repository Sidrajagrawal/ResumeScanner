import { useState } from "react";
import axios from "axios";
import img3 from '../images/upload3.svg';

export default function JDMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription || !resume) {
      alert("Please provide a job description and upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("resume", resume);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/classify", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Match failed", error);
      alert("Matching failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow border border-black">
         <img
        src={img3}
        alt="Resume Scanner Illustration"
        className="w-64 mx-auto mb-6"
      />
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">🎯 JD Matcher</h2>

      <textarea
        rows="6"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-blue-500"
      />

      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setResume(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleMatch}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full"
      >
        {loading ? "Matching..." : "Match Resume"}
      </button>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded border">
          <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Match Results:</h3>
          <p><strong>Similarity Score:</strong> {(result.similarity * 100).toFixed(2)}%</p>
          <p><strong>Summary:</strong> {result.summary}</p>
        </div>
      )}
    </div>
  );
}
