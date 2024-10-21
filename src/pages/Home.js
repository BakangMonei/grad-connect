import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPasswordPage";

const Home = () => {
  const [authMode, setAuthMode] = useState("login");
  const [showRegisterPopover, setShowRegisterPopover] = useState(false);
  const { user } = useContext(AuthContext);

  if (user) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Welcome to Grad-Connect
        </h1>
        <p className="text-center">You are logged in as {user.email}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      <h1 className="text-3xl font-bold text-center mb-8">
        Welcome to Grad-Connect
      </h1>
      <div className="mb-8">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${authMode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${authMode === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setShowRegisterPopover(true)}
          >
            Register
          </button>
          <button
            className={`px-4 py-2 rounded ${authMode === 'forgotPassword' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setAuthMode('forgotPassword')}
          >
            Forgot Password
          </button>
        </div>
        {authMode === 'login' && <Login />}
        {authMode === 'forgotPassword' && <ForgotPassword />}
      </div>
      {showRegisterPopover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowRegisterPopover(false)}
            >
              &times;
            </button>
            <Register onClose={() => setShowRegisterPopover(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
