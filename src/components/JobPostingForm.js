import React, { useState } from "react";
import { firestore } from "../services/firebase";
import { toast } from "react-toastify";

const JobPostingForm = ({ employerId }) => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  });

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection("jobs").add({
        ...jobData,
        employerId,
        postedDate: new Date().toISOString(),
      });
      toast.success("Job posted successfully");
      setJobData({
        title: "",
        description: "",
        requirements: "",
        location: "",
        salary: "",
      });
    } catch (error) {
      toast.error("Error posting job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1">
          Job Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={jobData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      {/* Add similar input fields for description, requirements, location, and salary */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post Job
      </button>
    </form>
  );
};

export default JobPostingForm;
