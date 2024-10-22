// src/components/users/graduate/JobPosts.js
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsCollection = collection(db, "jobs");
      const jobSnapshot = await getDocs(jobsCollection);
      const jobList = jobSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const applicationsQuery = query(
      collection(db, "graduateapplications"),
      where("userId", "==", currentUser.uid)
    );

    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(applicationsQuery, (snapshot) => {
      const applications = {};
      snapshot.forEach((doc) => {
        applications[doc.data().jobId] = {
          id: doc.id,
          status: doc.data().status,
        };
      });
      setAppliedJobs(applications);
    });

    // Clean up the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  const handleCVUpload = async () => {
    if (!selectedCV || !selectedJob) {
      toast.error("Please select a job and upload a CV.");
      return;
    }

    try {
      const cvRef = ref(storage, `cvs/${uuidv4()}_${selectedCV.name}`);
      await uploadBytes(cvRef, selectedCV);

      const applicationData = {
        jobId: selectedJob.id,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        timestamp: serverTimestamp(),
        cvName: selectedCV.name,
        status: "Pending",
      };

      const docRef = await addDoc(
        collection(db, "graduateapplications"),
        applicationData
      );

      toast.success("Application submitted successfully!");

      setAppliedJobs((prev) => ({
        ...prev,
        [selectedJob.id]: { id: docRef.id, status: "Pending" },
      }));
      setSelectedJob(null);
      setSelectedCV(null);
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  const handleDeleteApplication = async (jobId) => {
    const applicationId = appliedJobs[jobId]?.id;
    if (!applicationId) return;

    try {
      await deleteDoc(doc(db, "graduateapplications", applicationId));
      toast.success("Application deleted successfully!");

      setAppliedJobs((prev) => {
        const updated = { ...prev };
        delete updated[jobId];
        return updated;
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className={`border p-4 rounded-lg shadow-md ${
            appliedJobs[job.id]?.status === "Approved"
              ? "bg-green-100"
              : appliedJobs[job.id]?.status === "Declined"
              ? "bg-red-100"
              : appliedJobs[job.id]
              ? "bg-yellow-100"
              : "bg-white"
          }`}
          onClick={() => setSelectedJob(job)}
        >
          <h3 className="text-xl font-bold">{job.title}</h3>
          <p>
            <strong>Experience:</strong> {job.experience}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Qualifications:</strong> {job.qualifications}
          </p>
          <p>
            <strong>Skills:</strong> {job.skills}
          </p>
          <p>
            <strong>Type:</strong> {job.type}
          </p>
          {appliedJobs[job.id] && (
            <div>
              <p className="font-semibold">
                Status: {appliedJobs[job.id].status}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the card click
                  handleDeleteApplication(job.id);
                }}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Application
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Popover for CV upload */}
      {selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Apply for {selectedJob.title}
            </h3>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setSelectedCV(e.target.files[0])}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCVUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit Application
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default JobPosts;
