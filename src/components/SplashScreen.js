// src/components/SplashScreen.js
import React from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold">Welcome to Grad-Connect</h1>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-white text-blue-500 px-6 py-2 rounded"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
