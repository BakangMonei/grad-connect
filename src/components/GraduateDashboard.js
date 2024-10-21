// src/components/GraduateDashboard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const GraduateDashboard = () => {
  const [userData, setUserData] = useState({});
  const [jobApplications, setJobApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const navigate = useNavigate();

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

    const fetchJobApplications = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        setJobApplications(querySnapshot.docs.map((doc) => doc.data()));
      }
    };

    const fetchRecommendedJobs = async () => {
      // Replace this with your recommendation logic based on the user's profile.
      const q = query(collection(db, "jobs"));
      const querySnapshot = await getDocs(q);
      setRecommendedJobs(querySnapshot.docs.map((doc) => doc.data()));
    };

    fetchUserData();
    fetchJobApplications();
    fetchRecommendedJobs();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {userData.firstName}
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Profile Information</h3>
          <p>
            <strong>Name:</strong> {userData.firstName} {userData.lastName}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Details:</strong> {userData.otherDetails}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Your Job Applications</h3>
          {jobApplications.length > 0 ? (
            <ul className="list-disc pl-5">
              {jobApplications.map((app, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>Job Title:</strong> {app.jobTitle}
                  </p>
                  <p>
                    <strong>Status:</strong> {app.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no job applications yet.</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Recommended Jobs</h3>
          {recommendedJobs.length > 0 ? (
            <ul className="list-disc pl-5">
              {recommendedJobs.map((job, index) => (
                <li key={index} className="mb-2">
                  <p>
                    <strong>Title:</strong> {job.title}
                  </p>
                  <p>
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p>
                    <strong>Type:</strong> {job.type}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No job recommendations at the moment.</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default GraduateDashboard;
