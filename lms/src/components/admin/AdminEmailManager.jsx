import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AdminEmailManager = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const [adminEmails, setAdminEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchAdminEmails();
  }, []);

  const fetchAdminEmails = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/admin-emails", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setAdminEmails(data.adminEmails);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch admin emails");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsAdding(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-admin-email",
        { email: newEmail.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setNewEmail("");
        fetchAdminEmails();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add email");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveEmail = async (emailId) => {
    if (!window.confirm("Are you sure you want to remove this email from the allowed list?")) {
      return;
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/remove-admin-email",
        { emailId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchAdminEmails();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to remove email");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Admin Email Management</h2>
        <p className="text-sm text-gray-500">Manage which email addresses can access the admin dashboard</p>
      </div>

      <div className="p-6">
        {/* Add Email Form */}
        <form onSubmit={handleAddEmail} className="mb-6">
          <div className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address to allow admin access"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !newEmail.trim()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? "Adding..." : "Add Email"}
            </button>
          </div>
        </form>

        {/* Admin Emails List */}
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">
            Allowed Admin Emails ({adminEmails.length})
          </h3>
          
          {adminEmails.length === 0 ? (
            <p className="text-gray-500 text-sm">No admin emails configured yet.</p>
          ) : (
            <div className="space-y-3">
              {adminEmails.map((adminEmail) => (
                <div
                  key={adminEmail._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{adminEmail.email}</span>
                      <span className="text-xs text-gray-500">
                        Added by {adminEmail.addedBy?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Added on {new Date(adminEmail.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEmail(adminEmail._id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmailManager;
