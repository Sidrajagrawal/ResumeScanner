import { Link, useLocation } from "react-router-dom";
import img6 from '../images/upload6.svg'

export default function Layout({ children }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/upload", label: "Upload" },
    { path: "/bulk", label: "Bulk Scan" },
    { path: "/matcher", label: "JD Matcher" },
    { path: "/resume-advisor", label: "Advisor" },
    { path: "/course-impact", label: "Course Impact" }, // ✅ New entry
    
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">📄 CVision Resume Scanner</h1>
          <nav className="space-x-2 hidden md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm px-3 py-1 rounded ${
                  location.pathname === item.path
                    ? "bg-white text-blue-700 font-semibold"
                    : "hover:bg-blue-600 transition"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-pink-200 py-10 px-6 flex-1 min-h-[calc(100vh-120px)]">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
    <footer className="text-sm text-gray-800 py-2 border-t bg-green-200 mt-12">
  <div className="max-w-6xl mx-auto px-4 text-center">

    {/* Image at Top */}
    <img
      src={img6}
      alt="Resume Scanner Illustration"
      className="w-40 mx-auto mb-4"
    />

    {/* Heading */}
    <h3 className="text-lg font-semibold h-5 text-green-900">
      📘 Learn skills and improve your resume:
    </h3>

    {/* Learning Links */}
    <div className="flex justify-center flex-wrap gap-4 mb-4 text-blue-700 text-sm">
      <a href="https://www.geeksforgeeks.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">GeeksforGeeks</a>
      <a href="https://codingblocks.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Coding Blocks</a>
      <a href="https://www.apnacollege.in/" target="_blank" rel="noopener noreferrer" className="hover:underline">Apna College</a>
      <a href="https://leetcode.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">LeetCode</a>
      <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" className="hover:underline">Coursera</a>
      <a href="https://www.udemy.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Udemy</a>
    </div>

    {/* Quick Navigation Links */}
    <div className="flex justify-center flex-wrap gap-4 text-blue-800 text-sm mb-4">
      <Link to="/">Dashboard</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/bulk">Bulk Scan</Link>
      <Link to="/matcher">JD Matcher</Link>
      <Link to="/resume-advisor">Advisor</Link>
    </div>

    {/* About / Vision */}
    <p className="text-gray-700 max-w-3xl mx-auto text-xs italic mb-2">
      CVision is an AI-powered resume intelligence platform that helps recruiters and job seekers analyze, match, and improve resumes with smart insights.
    </p>

    {/* Contact */}
    <p className="text-xs text-gray-700">
      📬 Contact: <a href="mailto:team@cvision.ai" className="underline text-blue-700">team@cvision.ai</a>
    </p>

    {/* Social Links */}
    <div className="flex justify-center gap-4 mt-2 text-blue-800 text-sm">
      <a href="https://github.com/yourrepo" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
    </div>

    {/* Legal */}
    <div className="text-xs text-gray-600 mt-3">
      <a href="/privacy" className="underline mr-4">Privacy Policy</a>
      <a href="/terms" className="underline">Terms of Service</a>
    </div>

    {/* Copyright */}
    <p className="text-gray-600 mt-2 text-xs">
      © {new Date().getFullYear()} CVision. All rights reserved.
    </p>

  </div>
</footer>
 
    </div>
  );
}
