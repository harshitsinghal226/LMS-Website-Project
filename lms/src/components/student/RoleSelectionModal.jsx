import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const [selectedRoles, setSelectedRoles] = useState(["student"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { createUserInDatabase } = useContext(AppContext);

  const handleRoleToggle = (role) => {
    if (selectedRoles.includes(role)) {
      // Don't allow removing the last role
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== role));
      }
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRoleSelection = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Create user in database with selected roles
      const success = await createUserInDatabase(selectedRoles);
      if (success) {
        toast.success(`Successfully signed up with roles: ${selectedRoles.join(', ')}!`);
        onClose();
      }
    } catch (error) {
      toast.error("Failed to create user profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Roles</h2>
          <p className="text-gray-600">Select how you want to use SKILLFORGE (you can have multiple roles)</p>
        </div>

        <div className="space-y-4 mb-6">
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRoles.includes("student") 
                ? "border-emerald-500 bg-emerald-50" 
                : "border-gray-200 hover:border-emerald-300"
            }`}
            onClick={() => handleRoleToggle("student")}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedRoles.includes("student") ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
              }`}>
                {selectedRoles.includes("student") && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Student</h3>
                <p className="text-sm text-gray-600">Learn from courses and track your progress</p>
              </div>
            </div>
          </div>

          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRoles.includes("educator") 
                ? "border-emerald-500 bg-emerald-50" 
                : "border-gray-200 hover:border-emerald-300"
            }`}
            onClick={() => handleRoleToggle("educator")}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedRoles.includes("educator") ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
              }`}>
                {selectedRoles.includes("educator") && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Educator</h3>
                <p className="text-sm text-gray-600">Create courses and teach students</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>Selected roles:</strong> {selectedRoles.join(', ')}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRoleSelection}
            disabled={isSubmitting || selectedRoles.length === 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? "Creating..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
