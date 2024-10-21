import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { firestore } from "../services/firebase";
import { toast } from "react-toastify";
import JobPostingForm from "../components/JobPostingForm";

const EmployerProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const doc = await firestore.collection("employers").doc(user.uid).get();
      if (doc.exists) {
        setProfile(doc.data());
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firestore.collection("employers").doc(user.uid).update(profile);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Employer Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="companyName" className="block mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Add similar input fields for industry, companySize, etc. */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Company Name:</strong> {profile.companyName}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Industry:</strong> {profile.industry}
          </p>
          <p>
            <strong>Company Size:</strong> {profile.companySize}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Job Postings</h2>
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showJobForm ? "Cancel" : "Post a New Job"}
        </button>
        {showJobForm && <JobPostingForm employerId={user.uid} />}
      </div>
    </div>
  );
};

export default EmployerProfile;
