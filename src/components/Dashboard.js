import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user?.name || "User"}!
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.userType === "graduate" ? (
          <>
            <DashboardCard
              title="Your Profile"
              description="View and edit your profile information"
              link="/graduate-profile"
            />
            <DashboardCard
              title="Job Search"
              description="Browse and apply for job opportunities"
              link="/job-search"
            />
            <DashboardCard
              title="Application Tracking"
              description="Track the status of your job applications"
              link="/application-tracking"
            />
            <DashboardCard
              title="Resume Builder"
              description="Create and update your resume"
              link="/resume-builder"
            />
          </>
        ) : (
          <>
            <DashboardCard
              title="Company Profile"
              description="Manage your company information"
              link="/employer-profile"
            />
            <DashboardCard
              title="Post a Job"
              description="Create a new job listing"
              link="/post-job"
            />
            <DashboardCard
              title="Manage Listings"
              description="View and edit your job listings"
              link="/manage-listings"
            />
            <DashboardCard
              title="Applicant Review"
              description="Review and manage job applications"
              link="/applicant-review"
            />
          </>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link }) => {
  return (
    <Link
      to={link}
      className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition duration-300"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default Dashboard;
