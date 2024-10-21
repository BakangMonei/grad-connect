// src/components/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      // Check for the user in different collections
      const userSnapshot = await getDocs(
        query(collection(db, "graduates"), where("email", "==", email))
      );
      const adminSnapshot = await getDocs(
        query(collection(db, "admin"), where("email", "==", email))
      );
      const sAdminSnapshot = await getDocs(
        query(collection(db, "s_admin"), where("email", "==", email))
      );

      // Sign in the user if they exist in one of the collections
      await signInWithEmailAndPassword(auth, email, password);

      if (userSnapshot.size > 0) {
        navigate("/graduate-dashboard");
      } else if (adminSnapshot.size > 0) {
        navigate("/admin-dashboard");
      } else if (sAdminSnapshot.size > 0) {
        navigate("/SuperAdminDashboard");
      } else {
        setError("Invalid email or password. Please check your credentials.");
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
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
            required
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
