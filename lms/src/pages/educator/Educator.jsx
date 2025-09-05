import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../../components/educator/Navbar";
import Footer from "../../components/educator/Footer";
import Sidebar from "../../components/educator/Sidebar";
import { AppContext } from "../../context/AppContext";
// import Loading from "../../components/student/Loading";

const Educator = () => {
  const { isSignedIn } = useUser();
  const { isEducator, userData } = useContext(AppContext);

  // Show loading while checking authentication
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  // Show loading while user data is being fetched
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if user is not an educator
  if (!isEducator) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">{<Outlet />}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Educator;
