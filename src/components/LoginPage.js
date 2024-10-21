// src/components/LoginPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import "firebase/auth"; // Import Firebase Authentication
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
require("firebase/auth");

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const userSnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );
      const adminSnapshot = await getDocs(
        query(collection(db, "admin"), where("email", "==", email))
      );
      const s_adminSnapshot = await getDocs(
        query(collection(db, "s_admin"), where("email", "==", email))
      );

      if (userSnapshot.size > 0) {
        // User exists in the 'user' collection
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/graduate-dashboard");
      } else if (adminSnapshot.size > 0) {
        // User exists in the 'admin' collection
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/admin-dashboard");
      } else if (s_adminSnapshot.size > 0) {
        // User exists in the 's_admin' collection
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/SuperAdminDashboard");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            Login
          </button>
          <p
            className="text-blue-500 text-center mt-4 cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
          <p
            className="text-blue-500 text-center mt-4 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Register
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
