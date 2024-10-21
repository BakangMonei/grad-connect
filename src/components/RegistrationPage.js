// src/components/RegistrationPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, createUserWithEmailAndPassword } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

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

      alert("Registration successful! You are now registered as a graduate.");
      navigate("/login");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register as a Graduate
        </h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
            required
          />
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
          <textarea
            placeholder="Other Details (e.g., educational background, interests)"
            value={otherDetails}
            onChange={(e) => setOtherDetails(e.target.value)}
            className="w-full p-3 mb-4 border rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg"
          >
            Register
          </button>
          <p
            className="text-blue-500 text-center mt-4 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
