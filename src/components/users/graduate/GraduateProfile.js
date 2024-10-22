import React, { useEffect, useState } from "react";
import { auth, db } from "../../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Key, Save, Clock, AlertCircle } from "lucide-react";

const GraduateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otherDetails: "",
    lastUpdated: null,
  });
  const [newPassword, setNewPassword] = useState("");
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "graduates", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            ...data,
            email: user.email,
            lastUpdated: data.lastUpdated?.toDate(),
          });
          // Fetch last 5 logs if they exist
          setLogs(data.logs?.slice(-5) || []);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch profile data");
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!userData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "graduates", user.uid);
        const updateData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          otherDetails: userData.otherDetails,
          lastUpdated: new Date(),
          logs: [
            ...(userData.logs || []),
            `Profile updated on ${new Date().toLocaleString()}`,
          ].slice(-10), // Keep only last 10 logs
        };

        await updateDoc(docRef, updateData);
        toast.success("Profile updated successfully!");
        setLogs(updateData.logs);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await user.updatePassword(newPassword);
        setNewPassword("");
        toast.success("Password changed successfully!");

        // Add password change to logs
        const docRef = doc(db, "graduates", user.uid);
        const newLogs = [
          ...(userData.logs || []),
          `Password changed on ${new Date().toLocaleString()}`,
        ].slice(-10);
        await updateDoc(docRef, { logs: newLogs });
        setLogs(newLogs);
      }
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h2>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={userData.firstName || ""}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={userData.lastName || ""}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={userData.email || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Details
            </label>
            <textarea
              value={userData.otherDetails || ""}
              onChange={(e) =>
                setUserData({ ...userData, otherDetails: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
              rows="3"
              placeholder="Add any additional information"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              disabled={isLoading}
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Change Password
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
            placeholder="Enter new password"
            disabled={isLoading}
          />
          <button
            onClick={handleChangePassword}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            disabled={isLoading}
          >
            <Key className="w-4 h-4" />
            {isLoading ? "Changing..." : "Update Password"}
          </button>
        </div>
      </div>

      {/* Activity Logs Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Activity
          </h2>
        </div>

        {logs.length > 0 ? (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-md text-sm text-gray-600"
              >
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>{log}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No recent activity to display.
          </p>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default GraduateProfile;
