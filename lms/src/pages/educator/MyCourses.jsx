import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
// import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses || []);
      } else {
        setError(data.message || "Failed to fetch courses");
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      // console.error("Error fetching courses:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch courses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Courses</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchEducatorCourses}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="w-full">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-100 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h2>
              <p className="text-gray-600">Manage and track your published courses</p>
            </div>
            <button
              onClick={() => navigate("/educator/add-course")}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              + Add New Course
            </button>
          </div>
        </div>

        {courses && courses.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Earnings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published On
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-emerald-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={course.courseThumbnail}
                            alt="Course Image"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {course.courseTitle}
                            </div>
                            <div className="text-sm text-gray-500">
                              {course.courseDescription?.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currency}{" "}
                        {Math.floor(
                          course.enrolledStudents?.length * 
                          (course.coursePrice - (course.discount * course.coursePrice) / 100) || 0
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.enrolledStudents?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No courses added yet</h3>
              <p className="text-gray-500 mb-6">
                Start creating amazing courses to share your knowledge with students!
              </p>
              <button
                onClick={() => navigate("/educator/add-course")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
              >
                Add Your First Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
