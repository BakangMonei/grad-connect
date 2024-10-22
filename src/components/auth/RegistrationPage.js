// src/components/RegistrationPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  createUserWithEmailAndPassword,
} from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { User, Mail, Lock, Info, ArrowLeftCircle, Loader2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Register the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user information in Firestore under "graduates" collection
      await setDoc(doc(db, "graduates", user.uid), {
        firstName,
        lastName,
        email,
        otherDetails,
        userId: user.uid,
        createdAt: new Date(),
      });

      toast.success(
        "Registration successful! You are now registered as a graduate."
      );
      navigate("/login");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Register as a Graduate
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Create your account to access graduate opportunities.
        </p>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <User className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <User className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Mail className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <Lock className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative">
            <textarea
              placeholder="Other Details (e.g., educational background, interests)"
              value={otherDetails}
              onChange={(e) => setOtherDetails(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <Info className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Register"
            )}
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-700 flex items-center justify-center mt-4"
            >
              <ArrowLeftCircle className="h-5 w-5 mr-1" />
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegistrationPage;
