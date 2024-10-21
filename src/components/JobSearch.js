// src/components/JobSearch.js
import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const q = query(collection(db, "jobs"), where("title", ">=", searchTerm));
      const querySnapshot = await getDocs(q);
      setJobs(querySnapshot.docs.map((doc) => doc.data()));
    };

    fetchJobs();
  }, [searchTerm]);

  return (
    <div className="max-w-md mx-auto mt-10">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search jobs"
        className="block w-full p-2 mb-4 border rounded"
      />
      {jobs.map((job, index) => (
        <div key={index} className="p-4 border mb-2 rounded">
          <h3 className="font-bold">{job.title}</h3>
          <p>{job.location}</p>
          <p>{job.type}</p>
        </div>
      ))}
    </div>
  );
};

export default JobSearch;
