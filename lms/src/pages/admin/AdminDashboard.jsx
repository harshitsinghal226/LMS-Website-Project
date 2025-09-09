import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import AdminEmailManager from "../../components/admin/AdminEmailManager";
import Navbar from "../../components/student/Navbar";
import Footer from "../../components/student/Footer";

const AdminDashboard = () => {
  const { backendUrl, getToken, userData } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previousRequestCount, setPreviousRequestCount] = useState(0);

  // Check if user is admin
  const isAdmin = userData?.roles?.includes('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchRequests();
      
      // Set up polling to check for new requests every 5 seconds
      const interval = setInterval(() => {
        fetchRequests(true);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchRequests = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/educator-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        const newRequests = data.requests;
        const pendingRequests = newRequests.filter(req => req.status === 'pending');
        
        // Check if there are new pending requests
        if (showRefreshIndicator && pendingRequests.length > previousRequestCount) {
          toast.info(`📬 New educator request received! (${pendingRequests.length} pending)`);
        }
        
        setRequests(newRequests);
        setPreviousRequestCount(pendingRequests.length);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
      if (showRefreshIndicator) {
        setIsRefreshing(false);
      }
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/approve-educator-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Request approved successfully!");
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/reject-educator-request",
        { requestId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Request rejected successfully!");
        setSelectedRequest(null);
        setRejectReason("");
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage educator requests and admin access</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fetchRequests(true)}
                  disabled={isRefreshing}
                  className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors disabled:opacity-50"
                >
                  {isRefreshing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-emerald-600 mr-1"></div>
                      Refreshing...
                    </div>
                  ) : (
                    "Refresh"
                  )}
                </button>
                {isRefreshing && (
                  <div className="text-sm text-gray-500">
                    Auto-refreshing...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "requests"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Educator Requests
                </button>
                <button
                  onClick={() => setActiveTab("emails")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "emails"
                      ? "border-emerald-500 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Admin Emails
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "requests" && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Educator Requests</h2>
                <p className="text-sm text-gray-500">Review and approve/reject educator role requests</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requests.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No educator requests found
                        </td>
                      </tr>
                    ) : (
                      requests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={request.userId?.imageUrl || 'https://via.placeholder.com/40'}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.userId?.name || request.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {request.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApprove(request._id)}
                                  className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setSelectedRequest(request)}
                                  className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {request.status === 'rejected' && request.reason && (
                              <span className="text-xs text-gray-500">
                                Reason: {request.reason}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "emails" && <AdminEmailManager />}
        </div>
      </div>
      <Footer />

      {/* Reject Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject Educator Request
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please provide a reason for rejecting this request:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows="3"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setRejectReason("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest._id, rejectReason)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Reject Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
