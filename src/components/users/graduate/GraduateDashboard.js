import React, { useEffect, useState } from "react";
import { auth, db } from "../../../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { getAuth } from "firebase/auth";
import JobPosts from "./JobPosts";
import GraduateProfile from "./GraduateProfile";

const GraduateDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [userData, setUserData] = useState({});
  const [jobApplications, setJobApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

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
        return <GraduateProfile/>

    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-600 text-white flex-shrink-0">
        <div className="p-6 text-2xl font-bold">Graduate Dashboard</div>
        <div>
          {userData.firstName} {userData.lastName}
        </div>
        <nav className="mt-6">
          <ul>
            <li
              onClick={() => setActiveTab("JobPosts")}
              className={`p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "jobs" ? "bg-blue-700" : ""
              }`}
            >
              Dashboard
            </li>
            
            <li
              onClick={() => setActiveTab("profile")}
              className={`p-4 cursor-pointer hover:bg-blue-500 ${
                activeTab === "graduateapplications" ? "bg-blue-700" : ""
              }`}
            >
              My Profile
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

export default GraduateDashboard;
