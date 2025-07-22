import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadResume from "./pages/UploadResume";
import BulkResumeScanner from "./pages/BulkResumeScanner";
import JDMatcher from "./pages/JDMatcher";
import ResumeAdvisor from './pages/ResumeAdvisor';
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout"; // ✅ import Layout
import CourseImpact from "./pages/CourseImpact"; // adjust path as needed


function App() {
  return (
    <Router>
      <Layout> {/* ✅ Wrap all routes inside Layout */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/bulk" element={<BulkResumeScanner />} />
          <Route path="/matcher" element={<JDMatcher />} />
          <Route path="/resume-advisor" element={<ResumeAdvisor />} />
          <Route path="/course-impact" element={<CourseImpact />} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
