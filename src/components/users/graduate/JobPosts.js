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
import {
  Briefcase,
  MapPin,
  GraduationCap,
  Code,
  Clock,
  Upload,
  X,
  Trash2,
  FileCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: <Loader2 className="w-4 h-4" />,
    },
    Approved: {
      color: "bg-green-100 text-green-800",
      icon: <FileCheck className="w-4 h-4" />,
    },
    Declined: {
      color: "bg-red-100 text-red-800",
      icon: <AlertCircle className="w-4 h-4" />,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${config.color}`}
    >
      {config.icon}
      {status}
    </Badge>
  );
};

const JobCard = ({ job, appliedJobs, onSelect, onDelete }) => {
  const applicationStatus = appliedJobs[job.id]?.status;

  return (
    <Card
      className={`
      transition-all duration-200 hover:shadow-lg cursor-pointer
      ${
        applicationStatus === "Approved"
          ? "bg-green-50"
          : applicationStatus === "Declined"
          ? "bg-red-50"
          : appliedJobs[job.id]
          ? "bg-yellow-50"
          : "bg-white"
      }
    `}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          {job.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{job.experience}</span>
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{job.skills}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{job.type}</span>
          </div>

          {appliedJobs[job.id] && (
            <div className="space-y-2 mt-4">
              <StatusBadge status={applicationStatus} />
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(job.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Application
              </Button>
            </div>
          )}

          {!appliedJobs[job.id] && (
            <Button className="w-full mt-4" onClick={() => onSelect(job)}>
              <Upload className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const JobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

    return () => unsubscribe();
  }, [currentUser]);

  const handleCVUpload = async () => {
    if (!selectedCV || !selectedJob) {
      toast.error("Please select a job and upload a CV.");
      return;
    }

    setIsLoading(true);
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
      setSelectedJob(null);
      setSelectedCV(null);
    } catch (error) {
      console.error("Error uploading CV:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApplication = async (jobId) => {
    const applicationId = appliedJobs[jobId]?.id;
    if (!applicationId) return;

    try {
      await deleteDoc(doc(db, "graduateapplications", applicationId));
      toast.success("Application deleted successfully!");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 py-6 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-full pb-20">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              appliedJobs={appliedJobs}
              onSelect={setSelectedJob}
              onDelete={handleDeleteApplication}
            />
          ))}
        </div>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Apply for {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSelectedCV(e.target.files[0])}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleCVUpload} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default JobPosts;
