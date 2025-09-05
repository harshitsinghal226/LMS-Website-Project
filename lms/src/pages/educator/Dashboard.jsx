import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
// import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      // console.log("Fetching dashboard data...");
      
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // console.log("Dashboard response:", data);

      if (data.success) {
        setDashboardData(data.dashboardData);
        setFilteredEnrollments(data.dashboardData.enrolledStudentsData || []);
      } else {
        setError(data.message || "Failed to fetch dashboard data");
        toast.error(data.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      // console.error("Dashboard error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dashboard data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter enrollments based on search term
  useEffect(() => {
    if (dashboardData && dashboardData.enrolledStudentsData) {
      const filtered = dashboardData.enrolledStudentsData.filter(item =>
        item.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEnrollments(filtered);
    }
  }, [searchTerm, dashboardData]);

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">No Dashboard Data</h3>
          <p className="text-gray-600 mb-6">Your dashboard is empty. Start by adding courses and enrolling students.</p>
          <button
            onClick={() => navigate("/educator/add-course")}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
          >
            Add Your First Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="space-y-6 w-full">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard</h1>
          <p className="text-gray-600">Monitor your courses, students, and earnings in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {dashboardData.enrolledStudentsData?.length || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <img src={assets.patients_icon} alt="enrollments" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {dashboardData.totalCourses || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <img src={assets.appointments_icon} alt="courses" className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {currency}{dashboardData.totalEarnings || 0}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <img src={assets.earning_icon} alt="earnings" className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Latest Enrollments</h2>
            <div className="flex gap-4">
              <div className="relative">
                <img 
                  src={assets.search_icon} 
                  alt="search" 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search students or courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
                />
              </div>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Enrollments Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((item, index) => (
                    <tr key={index} className="hover:bg-emerald-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.student.imageUrl}
                            alt="Profile"
                            className="w-10 h-10 rounded-full mr-3"
                            onError={(e) => {
                              e.target.src = assets.profile_img;
                              e.target.onerror = null;
                            }}
                          />
                          <span className="text-sm font-medium text-gray-900">{item.student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.courseTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-lg font-medium mb-2">
                          {searchTerm ? "No enrollments found" : "No enrollments yet"}
                        </p>
                        <p className="text-sm">
                          {searchTerm 
                            ? "Try adjusting your search terms" 
                            : "Start by adding courses and enrolling students"
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600 text-center">
              Showing {filteredEnrollments.length} of {dashboardData.enrolledStudentsData?.length || 0} enrollments
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
