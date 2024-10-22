import React, { useEffect, useState } from "react";
import { auth, db } from "../../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GraduateProfile = () => {
  const [userData, setUserData] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [logs, setLogs] = useState([]); // For storing logs

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "graduates", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "graduates", user.uid);
      await updateDoc(docRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        otherDetails: userData.otherDetails,
      });
      toast.success("Profile updated successfully!");
    }
  };

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (user && newPassword) {
      try {
        await user.updatePassword(newPassword);
        setNewPassword("");
        toast.success("Password changed successfully!");
      } catch (error) {
        toast.error("Failed to change password. Please try again.");
        console.error("Error changing password:", error);
      }
    } else {
      toast.error("Please enter a new password.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Graduate Profile
      </h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            value={userData.firstName || ""}
            onChange={(e) =>
              setUserData({ ...userData, firstName: e.target.value })
            }
            placeholder="First Name"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Last Name</label>
          <input
            type="text"
            value={userData.lastName || ""}
            onChange={(e) =>
              setUserData({ ...userData, lastName: e.target.value })
            }
            placeholder="Last Name"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-600 mb-1">Other Details</label>
          <input
            type="text"
            value={userData.otherDetails || ""}
            onChange={(e) =>
              setUserData({ ...userData, otherDetails: e.target.value })
            }
            placeholder="Other Details"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Update Details
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Change Password
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500 w-full"
          />
          <button
            onClick={handleChangePassword}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Logs</h2>
        <div className="space-y-2">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div
                key={index}
                className="p-3 border rounded bg-gray-100 text-gray-700"
              >
                {log}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No logs available.</p>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default GraduateProfile;
