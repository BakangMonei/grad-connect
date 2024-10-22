// src/components/AdminProfile.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../services/firebase";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  MapPin,
  Phone,
  Briefcase,
  Mail,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";

const AdminProfile = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-2 py-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <div>
        <span className="text-sm font-medium text-gray-500">{label}:</span>
        <span className="ml-2 text-sm">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <User className="h-5 w-5 text-gray-700 mr-2" />
        <h1 className="text-xl font-semibold">Admin Profile</h1>
      </div>
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm text-gray-600">
                First Name
              </label>
              <input
                id="firstName"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adminData.firstName}
                onChange={(e) =>
                  setAdminData({ ...adminData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm text-gray-600">
                Last Name
              </label>
              <input
                id="lastName"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adminData.lastName}
                onChange={(e) =>
                  setAdminData({ ...adminData, lastName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm text-gray-600">
                Location
              </label>
              <input
                id="location"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adminData.location}
                onChange={(e) =>
                  setAdminData({ ...adminData, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm text-gray-600">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adminData.phoneNumber}
                onChange={(e) =>
                  setAdminData({ ...adminData, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="background" className="text-sm text-gray-600">
              Background
            </label>
            <input
              id="background"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={adminData.background}
              onChange={(e) =>
                setAdminData({ ...adminData, background: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <ProfileField icon={Mail} label="Email" value={adminData.email} />
          <ProfileField
            icon={User}
            label="Name"
            value={`${adminData.firstName} ${adminData.lastName}`}
          />
          <ProfileField
            icon={MapPin}
            label="Location"
            value={adminData.location}
          />
          <ProfileField
            icon={Phone}
            label="Phone"
            value={adminData.phoneNumber}
          />
          <ProfileField
            icon={Briefcase}
            label="Background"
            value={adminData.background}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
