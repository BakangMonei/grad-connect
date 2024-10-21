// src/components/Profile.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p>Welcome, {auth.currentUser?.email}</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 w-full rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
