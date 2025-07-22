import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "Upload", path: "/" },
    { label: "JD Matcher", path: "/matcher" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Bulk Upload", path: "/bulk" },
    { label: "Resume Advisor", path: "/resume-advisor" },
    { label: "Course Impact", path: "/course-impact" },


 // ✅ Add this line
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">
            CVision
          </h1>
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium px-3 py-2 rounded-md transition ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-blue-600 hover:bg-blue-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
