import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { firestore } from "../services/firebase";

const ApplicationTracking = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const snapshot = await firestore
        .collection("applications")
        .where("graduateId", "==", user.uid)
        .get();
      const applicationsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(applicationsData);
    };
    fetchApplications();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Application Tracking</h1>
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="bg-white shadow-md rounded-lg p-4"
          >
            <h2 className="text-xl font-semibold mb-2">
              {application.jobTitle}
            </h2>
            <p className="text-gray-600 mb-2">{application.companyName}</p>
            <p className="text-sm text-gray-500 mb-2">
              Applied on:{" "}
              {new Date(application.appliedDate).toLocaleDateString()}
            </p>
            <p className="font-semibold">Status: {application.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTracking;
