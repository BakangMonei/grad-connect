import React from "react";
import { Link } from "react-router-dom";

const JobListing = ({ job }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
      <p className="text-gray-600 mb-2">{job.company}</p>
      <p className="text-sm text-gray-500 mb-4">{job.location}</p>
      <p className="mb-4">{job.description.substring(0, 150)}...</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted on: {job.postedDate}
        </span>
        <Link
          to={`/job/${job.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobListing;
