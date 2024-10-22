import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import {
  User,
  Briefcase,
  Files,
  GraduationCap,
  Menu,
  LogOut,
} from "lucide-react";

import AdminProfile from "./AdminProfile";
import ApplicationManagement from "./ApplicationManagement";
import GraduateManagement from "./GraduateManagement";
import JobManagement from "./JobManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [adminName, setAdminName] = useState({ firstName: "", lastName: "" });
  const navigate = useNavigate();
  const auth = getAuth();

  const navigationItems = [
    {
      id: "jobs",
      label: "Jobs",
      icon: <Briefcase size={20} />,
      component: <JobManagement />,
    },
    {
      id: "applications",
      label: "Applications",
      icon: <Files size={20} />,
      component: <ApplicationManagement />,
    },
    {
      id: "graduates",
      label: "Graduates",
      icon: <GraduationCap size={20} />,
      component: <GraduateManagement />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User size={20} />,
      component: <AdminProfile />,
    },
  ];

  useEffect(() => {
    const fetchAdminData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "admin", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminName({ firstName: data.firstName, lastName: data.lastName });
        }
      }
    };
    fetchAdminData();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderContent = () => {
    const activeItem = navigationItems.find((item) => item.id === activeTab);
    return activeItem ? activeItem.component : <JobManagement />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-white shadow-md text-gray-600 hover:bg-gray-50"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {adminName.firstName} {adminName.lastName}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 pt-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            className="p-6 flex items-center text-gray-600 hover:bg-gray-50 border-t"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {navigationItems.find((item) => item.id === activeTab)?.label}
            </h2>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
