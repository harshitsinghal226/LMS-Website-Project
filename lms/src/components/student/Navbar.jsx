import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);

  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-10 md:px-14 lg:px-36 py-3 border-b ${
        isCourseListPage
          ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-slate-200 shadow-sm"
          : "bg-gradient-to-b from-emerald-50/80 to-teal-50/60 backdrop-blur border-transparent shadow-sm"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-24 lg:w-32 cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
      />
      <div className="hidden md:flex items-center gap-6 text-slate-600">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              | <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 rounded-full cursor-pointer shadow hover:shadow-md transition"
          >
            Create Account
          </button>
        )}
      </div>
      {/* For Phone Screens */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-slate-600">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={becomeEducator}>
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              | <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="user-icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
