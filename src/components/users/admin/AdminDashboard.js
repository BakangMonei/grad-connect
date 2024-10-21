// src/components/AdminDashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobManagement from "./JobManagement";
import ApplicationManagement from "./ApplicationManagement";
import AdminProfile from "./AdminProfile";
import GraduateManagement from "./GraduateManagement";
import { getAuth } from "firebase/auth";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const navigate = useNavigate();
  const auth = getAuth();

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
      case "jobs":
        return <JobManagement />;
      case "applications":
        return <ApplicationManagement />;
      case "profile":
        return <AdminProfile />;
      case "graduateapplications":
        return <GraduateManagement />;
      default:
        return <JobManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white flex-shrink-0">
        <div className="p-6 text-2xl font-bold">Admin Dashboard</div>
        <nav className="mt-6">
          <ul>
            <li
              onClick={() => setActiveTab("jobs")}
              className={`p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "jobs" ? "bg-blue-700" : ""
              }`}
            >
              Job Management
            </li>
            <li
              onClick={() => setActiveTab("applications")}
              className={`p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "applications" ? "bg-blue-700" : ""
              }`}
            >
              Application Management
            </li>
            <li
              onClick={() => setActiveTab("graduateapplications")}
              className={`p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "graduateapplications" ? "bg-blue-700" : ""
              }`}
            >
              Graduate Management
            </li>
            <li
              onClick={() => setActiveTab("profile")}
              className={`p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "profile" ? "bg-blue-700" : ""
              }`}
            >
              Profile
            </li>
            <li
              onClick={handleLogout}
              className="p-4 cursor-pointer hover:bg-red-500"
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
        </header>
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
