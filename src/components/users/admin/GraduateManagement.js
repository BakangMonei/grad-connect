// src/components/GraduateManagement.js
import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
} from "../../../services/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GraduateManagement = () => {
  const [graduates, setGraduates] = useState([]);
  const [newGraduate, setNewGraduate] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    otherDetails: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [graduateToDelete, setGraduateToDelete] = useState(null);

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "graduates"));
        setGraduates(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } catch (error) {
        toast.error("Failed to load graduates.");
      }
    };
    fetchGraduates();
  }, []);

  const handleAddGraduate = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newGraduate.email,
        newGraduate.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "graduates", user.uid), {
        firstName: newGraduate.firstName,
        lastName: newGraduate.lastName,
        email: newGraduate.email,
        otherDetails: newGraduate.otherDetails,
        userId: user.uid,
        createdAt: new Date(),
      });

      setGraduates([...graduates, { ...newGraduate, id: user.uid }]);
      toast.success("Graduate added successfully!");
      closeModal();
    } catch (error) {
      toast.error(`Error adding graduate: ${error.message}`);
    }
  };

  const handleDeleteGraduate = async () => {
    if (graduateToDelete) {
      try {
        await deleteDoc(doc(db, "graduates", graduateToDelete.id));
        setGraduates(
          graduates.filter((grad) => grad.id !== graduateToDelete.id)
        );
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      otherDetails: "",
    });
  };

  const openDeleteConfirm = (graduate) => {
    setGraduateToDelete(graduate);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setGraduateToDelete(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold mb-6">Manage Graduates</h3>
      <button
        onClick={openModal}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md mb-4 transition duration-200"
      >
        Add Graduate
      </button>

      {/* Modal for adding new graduate */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h4 className="text-lg font-semibold mb-4">Add Graduate</h4>
            <form onSubmit={handleAddGraduate}>
              <input
                type="text"
                placeholder="First Name"
                value={newGraduate.firstName}
                onChange={(e) =>
                  setNewGraduate({ ...newGraduate, firstName: e.target.value })
                }
                className="w-full p-3 mb-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newGraduate.lastName}
                onChange={(e) =>
                  setNewGraduate({ ...newGraduate, lastName: e.target.value })
                }
                className="w-full p-3 mb-3 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newGraduate.email}
                onChange={(e) =>
                  setNewGraduate({ ...newGraduate, email: e.target.value })
                }
                className="w-full p-3 mb-3 border rounded"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newGraduate.password}
                onChange={(e) =>
                  setNewGraduate({ ...newGraduate, password: e.target.value })
                }
                className="w-full p-3 mb-3 border rounded"
                required
              />
              <textarea
                placeholder="Other Details (e.g., educational background, interests)"
                value={newGraduate.otherDetails}
                onChange={(e) =>
                  setNewGraduate({
                    ...newGraduate,
                    otherDetails: e.target.value,
                  })
                }
                className="w-full p-3 mb-3 border rounded"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeModal}
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Add Graduate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <h4 className="text-lg font-semibold mb-2">Confirm Deletion</h4>
            <p>
              Are you sure you want to delete{" "}
              <strong>
                {graduateToDelete?.firstName} {graduateToDelete?.lastName}
              </strong>
              ?
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeDeleteConfirm}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGraduate}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4 mt-6">Graduates List</h3>
      <div className="grid grid-cols-1 gap-4">
        {graduates.map((grad) => (
          <div
            key={grad.id}
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <h4 className="font-bold text-lg">
              {grad.firstName} {grad.lastName}
            </h4>
            <p className="text-sm">
              <strong>Email:</strong> {grad.email}
            </p>
            <p className="text-sm">
              <strong>Details:</strong> {grad.otherDetails}
            </p>
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => openDeleteConfirm(grad)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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
