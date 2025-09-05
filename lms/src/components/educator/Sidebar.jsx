import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    isEducator && (
      <div className={`${isCollapsed ? 'w-20' : 'md:w-72 w-20'} border-r min-h-screen text-base border-emerald-200 py-4 flex flex-col bg-white transition-all duration-300 ease-in-out relative shadow-lg`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 bg-white border-2 border-emerald-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-10"
        >
          <svg 
            className={`w-4 h-4 text-emerald-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Logo Section */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-center">
            {isCollapsed ? (
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-gray-800">SKILLFORGE</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-2">
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/educator"}
              className={({ isActive }) =>
                `flex items-center mb-2 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-105"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border-r-4 border-transparent hover:border-emerald-300"
                }`
              }
            >
              <img 
                src={item.icon} 
                alt="" 
                className={`w-6 h-6 transition-all duration-200 ${
                  isCollapsed ? 'mx-auto' : 'mr-3'
                }`}
              />
              <span className={`${isCollapsed ? 'hidden' : 'block'} transition-opacity duration-300 font-medium`}>
                {item.name}
              </span>
              
              {/* Active indicator for collapsed state */}
              {isCollapsed && (
                <div className="absolute right-2 w-2 h-2 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-emerald-100">
          <div className={`text-center ${isCollapsed ? 'hidden' : 'block'}`}>
            <p className="text-xs text-gray-500">Educator Portal</p>
            <p className="text-xs text-emerald-600 font-medium">v1.0.0</p>
          </div>
        </div>
      </div>
    )
  );
};

export default Sidebar;
