// src/components/JobManagement.js
import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    type: "",
    skills: "",
    experience: "",
    qualifications: "",
  });
  const [editJobId, setEditJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      setJobs(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchJobs();
  }, []);

  const handleAddJob = async () => {
    try {
      const docRef = await addDoc(collection(db, "jobs"), newJob);
      setJobs([...jobs, { ...newJob, id: docRef.id }]);
      toast.success("Job added successfully!");
      setNewJob({
        title: "",
        location: "",
        type: "",
        skills: "",
        experience: "",
        qualifications: "",
      });
    } catch (error) {
      toast.error("Error adding job.");
    }
  };

  const handleUpdateJob = async () => {
    try {
      const jobDoc = doc(db, "jobs", editJobId);
      await updateDoc(jobDoc, newJob);
      setJobs(
        jobs.map((job) =>
          job.id === editJobId ? { ...newJob, id: editJobId } : job
        )
      );
      toast.success("Job updated successfully!");
      setIsModalOpen(false);
      setNewJob({
        title: "",
        location: "",
        type: "",
        skills: "",
        experience: "",
        qualifications: "",
      });
      setEditJobId(null);
    } catch (error) {
      toast.error("Error updating job.");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      setJobs(jobs.filter((job) => job.id !== id));
      toast.success("Job deleted successfully!");
    } catch (error) {
      toast.error("Error deleting job.");
    }
  };

  const openModal = (job) => {
    setNewJob(job);
    setEditJobId(job.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewJob({
      title: "",
      location: "",
      type: "",
      skills: "",
      experience: "",
      qualifications: "",
    });
    setEditJobId(null);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Job Postings</h3>

      {/* Form for adding new job */}
      <div className="mb-4 border p-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Job Title"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md w-full transition duration-200"
          />
          <select
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
          >
            <option value="">Select Location</option>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <select
            value={newJob.type}
            onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
            className="border border-gray-300 p-3 rounded-md w-full"
          >
            <option value="">Select Job Type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
          <input
            type="text"
            placeholder="Skills Required"
            value={newJob.skills}
            onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md w-full transition duration-200"
          />
          <input
            type="text"
            placeholder="Experience"
            value={newJob.experience}
            onChange={(e) =>
              setNewJob({ ...newJob, experience: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md w-full transition duration-200"
          />
          <input
            type="text"
            placeholder="Qualifications"
            value={newJob.qualifications}
            onChange={(e) =>
              setNewJob({ ...newJob, qualifications: e.target.value })
            }
            className="border border-gray-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 p-3 rounded-md w-full transition duration-200"
          />
          <button
            onClick={handleAddJob}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md shadow-lg transition duration-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Add Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 shadow-md w-auto bg-gray-100"
          >
            <h4 className="font-bold text-xl">{job.title}</h4>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Type:</strong> {job.type}
            </p>
            <p>
              <strong>Skills:</strong> {job.skills}
            </p>
            <p>
              <strong>Experience:</strong> {job.experience}
            </p>
            <p>
              <strong>Qualifications:</strong> {job.qualifications}
            </p>
            <div className="mt-2">
              <button
                onClick={() => openModal(job)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md mr-2 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteJob(job.id)}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for editing job */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-3/5 ">
            <h4 className="text-lg font-semibold mb-2">Edit Job</h4>
            <input
              type="text"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <select
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="">Select Location</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <select
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            >
              <option value="">Select Job Type</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
            <input
              type="text"
              placeholder="Skills Required"
              value={newJob.skills}
              onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Experience"
              value={newJob.experience}
              onChange={(e) =>
                setNewJob({ ...newJob, experience: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Qualifications"
              value={newJob.qualifications}
              onChange={(e) =>
                setNewJob({ ...newJob, qualifications: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              onClick={handleUpdateJob}
              className="bg-blue-600 text-white p-2 rounded mr-2"
            >
              Update Job
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default JobManagement;
