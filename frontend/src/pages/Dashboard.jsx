import React from "react";
import { Link } from "react-router-dom";
import img2 from '../images/upload2.svg';
import img5 from '../images/upload5.svg';

const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">🚀 Resume Intelligence Dashboard</h1>
      

    <div className="flex justify-center gap-6 mb-6">
  <img
    src={img2}
    alt="Resume Scanner Illustration"
    className="w-64"
  />
  <img
    src={img5}
    alt="Resume Scanner Illustration"
    className="w-64"
  />
</div>


      <p className="text-gray-700 text-lg mb-6">
        Welcome to <strong>CVision</strong> – your AI-powered assistant for smart hiring and resume analysis.
        This tool helps recruiters, job seekers, and analysts extract insights, match candidates, and improve resumes — all in one place.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Feature 1 */}
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">📤 Bulk Resume Upload</h2>
          <p className="text-gray-600 mb-3">
            Upload multiple resumes in one go. Our system parses, categorizes, and summarizes each resume efficiently.
          </p>
          <Link
            to="/bulk"
            className="text-blue-600 hover:underline font-medium"
          >
            Try Bulk Upload →
          </Link>
        </div>

        {/* Feature 2 */}
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">📌 JD Matcher</h2>
          <p className="text-gray-600 mb-3">
            Match resumes against any job description to find the best-fit candidates based on skills and relevance.
          </p>
          <Link
            to="/matcher"
            className="text-blue-600 hover:underline font-medium"
          >
            Try JD Matching →
          </Link>
        </div>

        {/* Feature 3 */}
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">🧠 Resume Advisor</h2>
          <p className="text-gray-600 mb-3">
            Upload your resume and get smart suggestions to improve your skills, achievements, and formatting.
          </p>
          <Link
            to="/resume-advisor"
            className="text-blue-600 hover:underline font-medium"
          >
            Get Advice →
          </Link>
        </div>

        {/* Feature 4 */}
        <div className="border p-4 rounded shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">📊 Smart Summary Dashboard</h2>
          <p className="text-gray-600 mb-3">
            View summaries, top skills, and categorized insights from uploaded resumes — all visualized for quick review.
          </p>
          <Link
            to="/bulk"
            className="text-blue-600 hover:underline font-medium"
          >
            View Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


















