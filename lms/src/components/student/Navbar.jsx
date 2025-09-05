import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, isEducator, isStudent, updateUserRoles } = useContext(AppContext);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const handleRoleToggle = async (role) => {
    if (isSwitchingRole) return;
    
    setIsSwitchingRole(true);
    try {
      // If user already has the role, remove it; otherwise add it
      const action = (isEducator && role === "educator") || (isStudent && role === "student") ? "remove" : "add";
      await updateUserRoles(action, role);      
    } catch (error) {
      toast.error("Error toggling role:", error);
    } finally {
      setIsSwitchingRole(false);
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-10 md:px-14 lg:px-36 py-3 border-b ${
        isCourseListPage
          ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-emerald-200 shadow-sm"
          : "bg-gradient-to-b from-emerald-50/80 to-green-50/60 backdrop-blur border-transparent shadow-sm"
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
              {/* Role Toggle Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleRoleToggle("student")}
                  disabled={isSwitchingRole}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isStudent 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } disabled:opacity-50`}
                >
                  {isSwitchingRole ? "..." : "Student"}
                </button>
                <button 
                  onClick={() => handleRoleToggle("educator")}
                  disabled={isSwitchingRole}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isEducator 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } disabled:opacity-50`}
                >
                  {isSwitchingRole ? "..." : "Educator"}
                </button>
              </div>

              {/* Navigation Links */}
              {isEducator && (
                <Link 
                  to="/educator" 
                  className="hover:text-emerald-600 transition-colors font-medium"
                >
                  Educator Dashboard
                </Link>
              )}
              {isStudent && (
                <Link to="/my-enrollments" className="hover:text-emerald-600 transition-colors">
                  My Enrollments
                </Link>
              )}
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 hover:from-emerald-700 hover:to-green-700 transform hover:-translate-y-0.5"
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
              {/* Role Toggle Buttons */}
              <div className="flex gap-1">
                <button 
                  onClick={() => handleRoleToggle("student")}
                  disabled={isSwitchingRole}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isStudent 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-200 text-gray-700"
                  } disabled:opacity-50`}
                >
                  {isSwitchingRole ? "..." : "S"}
                </button>
                <button 
                  onClick={() => handleRoleToggle("educator")}
                  disabled={isSwitchingRole}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isEducator 
                      ? "bg-emerald-600 text-white" 
                      : "bg-gray-200 text-gray-700"
                  } disabled:opacity-50`}
                >
                  {isSwitchingRole ? "..." : "E"}
                </button>
              </div>

              {/* Navigation Links */}
              {isEducator && (
                <Link to="/educator" className="text-xs">Dashboard</Link>
              )}
              {isStudent && (
                <Link to="/my-enrollments" className="text-xs">Enrollments</Link>
              )}
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
