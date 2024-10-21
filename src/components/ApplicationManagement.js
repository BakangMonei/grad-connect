// src/components/ApplicationManagement.js
import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [editApplicationId, setEditApplicationId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      const querySnapshot = await getDocs(collection(db, "applications"));
      setApplications(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchApplications();
  }, []);

  const handleUpdateApplication = async (id) => {
    try {
      const applicationDoc = doc(db, "applications", id);
      await updateDoc(applicationDoc, { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      setEditApplicationId(null);
      setNewStatus("");
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      await deleteDoc(doc(db, "applications", id));
      setApplications(applications.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Manage Applications</h3>
      <ul>
        {applications.map((app) => (
          <li key={app.id} className="mb-2 flex justify-between items-center">
            <div>
              <p>
                <strong>Job:</strong> {app.jobTitle}
              </p>
              <p>
                <strong>Applicant ID:</strong> {app.userId}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
            </div>
            <div>
              <input
                type="text"
                placeholder="Update Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border p-2 rounded mr-2"
              />
              <button
                onClick={() => handleUpdateApplication(app.id)}
                className="text-blue-500 mr-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteApplication(app.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationManagement;
