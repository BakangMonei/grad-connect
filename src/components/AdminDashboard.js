// src/components/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [graduates, setGraduates] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGraduates = async () => {
      const querySnapshot = await getDocs(collection(db, "graduates"));
      setGraduates(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    const fetchJobPostings = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      setJobPostings(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    const fetchApplications = async () => {
      const querySnapshot = await getDocs(collection(db, "applications"));
      setApplications(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchGraduates();
    fetchJobPostings();
    fetchApplications();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const handleDeleteGraduate = async (id) => {
    try {
      await deleteDoc(doc(db, "graduates", id));
      alert("Graduate record deleted.");
      setGraduates(graduates.filter((graduate) => graduate.id !== id));
    } catch (error) {
      alert(`Error deleting graduate: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Registered Graduates</h3>
          <ul className="list-disc pl-5">
            {graduates.map((graduate) => (
              <li key={graduate.id} className="mb-2">
                <p>
                  <strong>Name:</strong> {graduate.firstName}{" "}
                  {graduate.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {graduate.email}
                </p>
                <button
                  onClick={() => handleDeleteGraduate(graduate.id)}
                  className="text-red-500 mt-2"
                >
                  Delete Graduate
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Job Postings</h3>
          <ul className="list-disc pl-5">
            {jobPostings.map((job) => (
              <li key={job.id} className="mb-2">
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
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Applications</h3>
          <ul className="list-disc pl-5">
            {applications.map((app) => (
              <li key={app.id} className="mb-2">
                <p>
                  <strong>Job:</strong> {app.jobTitle}
                </p>
                <p>
                  <strong>Applicant:</strong> {app.userId}
                </p>
                <p>
                  <strong>Status:</strong> {app.status}
                </p>
              </li>
            ))}
          </ul>
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

export default AdminDashboard;
