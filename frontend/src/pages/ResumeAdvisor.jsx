import React, { useState } from "react";
import img4 from '../images/upload4.svg';

const ResumeAdvisor = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setSuggestions(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please upload a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    setLoading(true);
    setError("");
    setSuggestions(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/resume_advisor/advise", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("API response not ok");
      }

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to get advice. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📄 Resume Advisor</h1>
      {/* ✅ Add SVG Illustration */}
      <img
        src={img4}
        alt="Resume Scanner Illustration"
        className="w-64 mx-auto mb-6"
      />
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="mb-2"
        />
        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={!resumeFile || loading}
        >
          {loading ? "Analyzing..." : "Get Advice"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {suggestions && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">🧠 Advice Summary</h2>
          <p className="mb-2">{suggestions.summary}</p>

          <h3 className="font-semibold">🛠️ Skills Suggestions:</h3>
          <ul className="list-disc list-inside">
            {(suggestions.skills || []).map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h3 className="font-semibold mt-4">🏆 Achievements Advice:</h3>
          <ul className="list-disc list-inside">
            {(suggestions.achievements || []).map((ach, index) => (
              <li key={index}>{ach}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeAdvisor;
