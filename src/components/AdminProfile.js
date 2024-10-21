// src/components/AdminProfile.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phoneNumber: "",
    background: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      console.log("Fetching admin data...");
      const user = auth.currentUser;
      if (user) {
        try {
          // Reference to the document in the 'admin' collection using the user's uid
          const docRef = doc(db, "admin", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setAdminData(docSnap.data());
          } else {
            console.warn("No such document found! Creating new document...");
            // Create a new admin document with default values.
            await setDoc(docRef, {
              ...adminData,
              email: user.email || "",
            });
            console.log("New document created for admin.");
            toast.info("Profile not found. A new profile has been created.");
            setAdminData({
              ...adminData,
              email: user.email || "",
            });
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
          toast.error("Failed to load profile data.");
        }
      } else {
        console.warn("No user is currently authenticated.");
      }
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "admin", user.uid);
        await updateDoc(docRef, adminData);
        console.log("Profile updated successfully:", adminData);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "admin", user.uid);
        await deleteDoc(docRef); // Delete user data from Firestore
        await user.delete(); // Delete user from Firebase Auth
        console.log("Account deleted successfully for user:", user.uid);
        toast.success("Account deleted successfully!");
        // Optionally, redirect to login or home page
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        Admin Profile
      </h3>
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={adminData.firstName}
            onChange={(e) =>
              setAdminData({ ...adminData, firstName: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md transition duration-200"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={adminData.lastName}
            onChange={(e) =>
              setAdminData({ ...adminData, lastName: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md transition duration-200"
          />
          <input
            type="text"
            placeholder="Location"
            value={adminData.location}
            onChange={(e) =>
              setAdminData({ ...adminData, location: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md transition duration-200"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={adminData.phoneNumber}
            onChange={(e) =>
              setAdminData({ ...adminData, phoneNumber: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md transition duration-200"
          />
          <input
            type="text"
            placeholder="Background"
            value={adminData.background}
            onChange={(e) =>
              setAdminData({ ...adminData, background: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md transition duration-200"
          />
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md shadow-sm transition duration-200"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Email:</strong> {adminData.email}
          </p>
          <p>
            <strong>First Name:</strong> {adminData.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {adminData.lastName}
          </p>
          <p>
            <strong>Location:</strong> {adminData.location}
          </p>
          <p>
            <strong>Phone Number:</strong> {adminData.phoneNumber}
          </p>
          <p>
            <strong>Background:</strong> {adminData.background}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md shadow-sm transition duration-200"
          >
            Edit Profile
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-md shadow-sm transition duration-200"
          >
            Delete Account
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;
