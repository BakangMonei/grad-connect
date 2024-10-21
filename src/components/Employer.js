// src/components/Employer.js
import React, { useState } from "react";
import { db } from "../services/firebase";
import { addDoc, collection } from "firebase/firestore";

const Employer = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const postJob = async () => {
    await addDoc(collection(db, "jobs"), {
      title: jobTitle,
      location,
      type: jobType,
    });
    alert("Job posted successfully!");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Job Title"
        className="block w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="block w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        placeholder="Job Type"
        className="block w-full p-2 mb-2 border rounded"
      />
      <button
        onClick={postJob}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Post Job
      </button>
    </div>
  );
};

export default Employer;
