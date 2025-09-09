import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const AdminNavbar = () => {
  const { navigate } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center w-full px-4 sm:px-10 md:px-14 lg:px-36 py-3 border-b bg-white shadow-sm">
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
              {/* Admin Navigation Links */}
              <Link 
                to="/admin" 
                className="hover:text-emerald-600 transition-colors font-medium"
              >
                Admin Dashboard
              </Link>
              <Link 
                to="/" 
                className="hover:text-emerald-600 transition-colors"
              >
                Back to Site
              </Link>
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
            Sign In
          </button>
        )}
      </div>

      {/* For Phone Screens */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-slate-600">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <Link to="/admin" className="text-xs font-medium">Admin</Link>
              <Link to="/" className="text-xs">Site</Link>
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

export default AdminNavbar;
