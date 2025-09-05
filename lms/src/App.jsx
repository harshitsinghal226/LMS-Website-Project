import { Route, Routes, useMatch } from "react-router-dom";
import "./App.css";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import Home from "./pages/student/Home";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
// import Loading from "./components/student/Loading";
import PaymentRedirect from "./components/student/PaymentRedirect";
import Educator from "./pages/educator/Educator";
import Dashboard from "./pages/educator/Dashboard";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Navbar from "./components/student/Navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import RoleSelectionModal from "./components/student/RoleSelectionModal";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

function App() {
  const isEducator = useMatch("/educator/*");
  const { showRoleSelection, setShowRoleSelection } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50 to-white text-slate-800 antialiased">
      <ToastContainer />
      {!isEducator && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<PaymentRedirect />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleSelection}
        onClose={() => setShowRoleSelection(false)}
      />
    </div>
  );
}

export default App;
