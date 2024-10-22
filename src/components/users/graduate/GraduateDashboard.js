import React, { useEffect, useState } from "react";
import { auth, db } from "../../../services/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import JobPosts from "./JobPosts";
import GraduateProfile from "./GraduateProfile";
import {
  FaBars,
  FaUser,
  FaBriefcase,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const GraduateDashboard = () => {
  const [activeTab, setActiveTab] = useState("JobPosts");
  const [userData, setUserData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "graduates", user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "JobPosts":
        return <JobPosts />;
      case "profile":
        return <GraduateProfile />;
      default:
        return <JobPosts />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-blue-600 text-white w-64 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <div className="flex items-center justify-between p-6">
          <span className="text-2xl font-bold">Graduate Dashboard</span>
          <button
            className="text-white focus:outline-none lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars size={24} />
          </button>
        </div>
        <div className="px-6">
          <p className="text-sm">
            {userData.firstName} {userData.lastName}
          </p>
        </div>
        <nav className="mt-6">
          <ul>
            <li
              onClick={() => setActiveTab("JobPosts")}
              className={`flex items-center p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "JobPosts" ? "bg-blue-700" : ""
              }`}
            >
              <FaBriefcase className="mr-3" />
              Dashboard
            </li>

            <li
              onClick={() => setActiveTab("profile")}
              className={`flex items-center p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "profile" ? "bg-blue-700" : ""
              }`}
            >
              <FaUser className="mr-3" />
              My Profile
            </li>

            <li
              onClick={handleLogout}
              className="flex items-center p-4 cursor-pointer hover:bg-red-500"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6 lg:ml-64">
        <header className="flex justify-between items-center mb-6">
          <button
            className="text-blue-600 focus:outline-none lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars size={24} />
          </button>
          <h2 className="text-2xl font-bold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
        </header>
        <main>{renderContent()}</main>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default GraduateDashboard;
