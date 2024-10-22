import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase";
import {
  Menu,
  X,
  Briefcase,
  User,
  LogOut,
  Clipboard,
  GraduationCap,
} from "lucide-react";
import JobManagement from "./JobManagement";
import ApplicationManagement from "./ApplicationManagement";
import AdminProfile from "./AdminProfile";
import GraduateManagement from "./GraduateManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "admin", user.uid);
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

  const navigationItems = [
    {
      id: "jobs",
      label: "Job Management",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      id: "applications",
      label: "Application Management",
      icon: <Clipboard className="w-5 h-5" />,
    },
    {
      id: "graduateapplications",
      label: "Graduate Management",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    const components = {
      jobs: JobManagement,
      applications: ApplicationManagement,
      profile: AdminProfile,
      graduateapplications: GraduateManagement,
    };
    const Component = components[activeTab] || JobManagement;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-blue-600 text-white flex flex-col`}
      >
        <div className="p-6 border-b border-blue-500">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="mt-2 text-sm font-medium">
            {userData.firstName} {userData.lastName}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-500 transition-colors ${
                    activeTab === item.id ? "bg-blue-700" : ""
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={handleLogout}
          className="p-4 flex items-center text-left hover:bg-red-500 transition-colors border-t border-blue-500"
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {navigationItems.find((item) => item.id === activeTab)?.label ||
                "Dashboard"}
            </h2>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-hidden">{renderContent()}</main>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdminDashboard;
