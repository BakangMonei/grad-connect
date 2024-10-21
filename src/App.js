// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import GraduateDashboard from "./components/GraduateDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SplashScreen from "./components/SplashScreen";
import { auth } from "./services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  // Role-based access can be managed here. Example: using a simple role field from user metadata.
  // In a more complete setup, you could store user roles in Firestore and check them here.
  const isAdmin = user?.email === "admin@example.com"; // Replace with your logic to identify admin users

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/graduate-dashboard" element={<GraduateDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Redirect to login if user is not authenticated */}
        {!user && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;
