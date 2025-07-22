import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import img7 from '../images/upload7.svg';

export default function CourseImpact() {
  const [resume, setResume] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!resume) {
      alert("Please upload a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/course-impact-plot", formData, {
        responseType: "blob",
      });

      const imgBlob = new Blob([response.data], { type: "image/png" });
      const imgUrl = URL.createObjectURL(imgBlob);
      setImageUrl(imgUrl);
    } catch (err) {
      console.error("Failed to load course impact chart", err);
      alert("Error generating chart. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-pink-100 min-h-screen p-6">
      {/* Navigation */}
      <div className="flex justify-center gap-4 flex-wrap mb-6">
        <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Dashboard</Link>
        <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Upload</Link>
        <Link to="/resume-advisor" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Advisor</Link>
        <Link to="/bulk" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">Bulk Scan</Link>
        <Link to="/matcher" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">JD Matcher</Link>
      </div>

      <h2 className="text-2xl font-semibold text-center text-green-900 mb-4">
        <img
          src={img7}
          alt="Resume Scanner Illustration"
          className="w-64 mx-auto mb-6"
        />
        📊 Course Impact on Resume Score
      </h2>

      {/* Upload and Button */}
      <div className="text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setResume(e.target.files[0])}
          className="mb-4"
        />
        <br />
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
        >
          {loading ? "Generating..." : "Generate Course Impact"}
        </button>
      </div>

      {/* Chart */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Course Impact"
          className="w-full max-w-2xl mx-auto my-8 border rounded shadow"
        />
      )}
    </div>
  );
}
