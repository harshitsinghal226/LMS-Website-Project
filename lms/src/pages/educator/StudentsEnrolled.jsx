import React, { useContext, useEffect, useState } from "react";
// import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const navigate = useNavigate();
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents || []);
      } else {
        setError(data.message || "Failed to fetch enrolled students");
        toast.error(data.message || "Failed to fetch enrolled students");
      }
    } catch (error) {
      // console.error("Error fetching enrolled students:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch enrolled students";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600 font-medium">Loading enrolled students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Students</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchEnrolledStudents}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enrolled Students</h2>
          <p className="text-gray-600">View all students enrolled in your courses</p>
        </div>

        {enrolledStudents && enrolledStudents.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map((item, index) => (
                    <tr key={index} className="hover:bg-emerald-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.student.imageUrl}
                            alt="Student"
                            className="w-10 h-10 rounded-full object-cover"
        
                          />
                          <span className="text-sm font-medium text-gray-900">{item.student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.courseTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.purchaseDate || Date.now()).toLocaleDateString()}
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
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No students enrolled yet</h3>
              <p className="text-gray-500 mb-6">
                Start creating courses to attract students and build your teaching portfolio!
              </p>
              <button
                onClick={() => navigate("/educator/add-course")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-200"
              >
                Create Your First Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsEnrolled;
