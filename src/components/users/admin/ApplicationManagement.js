// src/components/admin/ApplicationStatus.js
import React, { useEffect, useState } from "react";
import { db, storage } from "../../../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up a real-time listener for the applications collection
    const unsubscribe = onSnapshot(
      collection(db, "graduateapplications"),
      (snapshot) => {
        const applicationsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(applicationsList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications.");
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, "graduateapplications", applicationId);
      await updateDoc(applicationRef, { status: newStatus });
      toast.success("Application status updated!");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await deleteDoc(doc(db, "graduateapplications", applicationId));
      toast.success("Application deleted!");
      setSelectedApplication(null);
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application.");
    }
  };

  const handleDownloadCV = async (cvName) => {
    try {
      const cvRef = ref(storage, `cvs/${cvName}`);
      const url = await getDownloadURL(cvRef);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading CV:", error);
      toast.error("Failed to download CV.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Manage Applications</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-center text-gray-500">No applications found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className={`border p-4 rounded-lg shadow-md ${
                application.status === "Approved"
                  ? "bg-green-100"
                  : application.status === "Declined"
                  ? "bg-red-100"
                  : "bg-yellow-100"
              }`}
            >
              <h3 className="text-lg font-bold">{application.jobId}</h3>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {application.userEmail}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {application.status || "Pending"}
              </p>
              <button
                onClick={() => setSelectedApplication(application)}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Application Details */}
      {selectedApplication && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">Application Details</h3>
            <p>
              <strong>Job ID:</strong> {selectedApplication.jobId}
            </p>
            <p>
              <strong>Email:</strong> {selectedApplication.userEmail}
            </p>
            <p>
              <strong>CV:</strong>{" "}
              <button
                onClick={() => handleDownloadCV(selectedApplication.cvName)}
                className="text-blue-500 underline"
              >
                Download CV
              </button>
            </p>
            <p>
              <strong>Status:</strong> {selectedApplication.status || "Pending"}
            </p>
            <div className="mt-4">
              <select
                value={selectedApplication.status || "Pending"}
                onChange={(e) =>
                  handleUpdateStatus(selectedApplication.id, e.target.value)
                }
                className="border rounded px-3 py-2 w-full"
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleDeleteApplication(selectedApplication.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Application
              </button>
              <button
                onClick={() => setSelectedApplication(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ApplicationStatus;
