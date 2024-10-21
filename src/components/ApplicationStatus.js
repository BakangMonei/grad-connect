// src/components/ApplicationStatus.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "applications"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        setApplications(querySnapshot.docs.map((doc) => doc.data()));
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Application Status</h2>
      {applications.map((application, index) => (
        <div key={index} className="p-4 border mb-2 rounded">
          <h3 className="font-bold">{application.jobTitle}</h3>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatus;
