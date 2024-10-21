// src/components/GraduateManagement.js
import React, { useState, useEffect } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GraduateManagement = () => {
  const [graduates, setGraduates] = useState([]);
  const [newGraduate, setNewGraduate] = useState({
    email: "",
    firstName: "",
    lastName: "",
    otherDetails: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [graduateToDelete, setGraduateToDelete] = useState(null);

  useEffect(() => {
    const fetchGraduates = async () => {
      const querySnapshot = await getDocs(collection(db, "graduates"));
      setGraduates(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchGraduates();
  }, []);

  const handleAddGraduate = async () => {
    try {
      // Check if email already exists
      const emailQuery = query(
        collection(db, "graduates"),
        where("email", "==", newGraduate.email)
      );
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
        toast.error("Email already exists.");
        return;
      }

      // Add new graduate
      const docRef = await addDoc(collection(db, "graduates"), newGraduate);
      setGraduates([...graduates, { ...newGraduate, id: docRef.id }]);
      toast.success("Graduate added successfully!");
      closeModal(); // Close the modal after successful addition
    } catch (error) {
      toast.error("Error adding graduate.");
    }
  };

  const handleUpdateGraduate = async (id) => {
    try {
      const graduateDoc = doc(db, "graduates", id);
      await updateDoc(graduateDoc, newGraduate);
      setGraduates(
        graduates.map((grad) =>
          grad.id === id ? { ...newGraduate, id } : grad
        )
      );
      toast.success("Graduate updated successfully!");
      closeModal();
    } catch (error) {
      toast.error("Error updating graduate.");
    }
  };

  const openDeleteConfirm = (graduate) => {
    setGraduateToDelete(graduate);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setGraduateToDelete(null);
  };

  const handleDeleteGraduate = async () => {
    if (graduateToDelete) {
      try {
        await deleteDoc(doc(db, "graduates", graduateToDelete.id));
        setGraduates(graduates.filter((grad) => grad.id !== graduateToDelete.id));
        toast.success("Graduate deleted successfully!");
        closeDeleteConfirm();
      } catch (error) {
        toast.error("Error deleting graduate.");
      }
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewGraduate({
      email: "",
      firstName: "",
      lastName: "",
      otherDetails: "",
      password: "",
    });
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Graduates</h3>
      <button
        onClick={openModal}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-md shadow-lg transition duration-200 mb-4"
      >
        Add Graduate
      </button>

      {/* Modal for adding new graduate */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-3/5">
            <h4 className="text-lg font-semibold mb-2">Add Graduate</h4>
            <input
              type="email"
              placeholder="Email"
              value={newGraduate.email}
              onChange={(e) =>
                setNewGraduate({ ...newGraduate, email: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="First Name"
              value={newGraduate.firstName}
              onChange={(e) =>
                setNewGraduate({ ...newGraduate, firstName: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newGraduate.lastName}
              onChange={(e) =>
                setNewGraduate({ ...newGraduate, lastName: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Other Details"
              value={newGraduate.otherDetails}
              onChange={(e) =>
                setNewGraduate({ ...newGraduate, otherDetails: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={newGraduate.password}
              onChange={(e) =>
                setNewGraduate({ ...newGraduate, password: e.target.value })
              }
              className="border p-2 rounded mb-2 w-full"
            />
            <button
              onClick={handleAddGraduate}
              className="bg-blue-600 text-white p-2 rounded mr-2"
            >
              Add Graduate
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

      {/* Confirmation Modal for Deletion */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md w-3/5">
            <h4 className="text-lg font-semibold mb-2">Confirm Deletion</h4>
            <p>Are you sure you want to delete {graduateToDelete?.firstName} {graduateToDelete?.lastName}?</p>
            <div className="mt-4">
              <button
                onClick={handleDeleteGraduate}
                className="bg-red-600 text-white p-2 rounded mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteConfirm}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4 mt-6">Graduates</h3>
      <div className="grid grid-cols-1 gap-4">
        {graduates.map((grad) => (
          <div
            key={grad.id}
            className="border rounded-lg p-4 shadow-md w-auto bg-gray-100"
          >
            <h4 className="font-bold text-xl">
              {grad.firstName} {grad.lastName}
            </h4>
            <p>
              <strong>Email:</strong> {grad.email}
            </p>
            <p>
              <strong>Details:</strong> {grad.otherDetails}
            </p>
            <div className="mt-2">
              <button
                onClick={() => handleUpdateGraduate(grad.id)}
                className="bg-blue-500 text-white p-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => openDeleteConfirm(grad)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default GraduateManagement;
