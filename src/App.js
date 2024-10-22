// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegistrationPage from "./components/auth/RegistrationPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import GraduateDashboard from "./components/users/graduate/GraduateDashboard";
import AdminDashboard from "./components/users/admin/AdminDashboard";
import JobPosts from "./components/users/graduate/JobPosts";
import SplashScreen from "./pages/SplashScreen";
import { auth } from "./services/firebase";
import GraduateManagement from "./components/users/admin/GraduateManagement";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

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
        <Route path="/GraduateManagement" element={<GraduateManagement />} />
        <Route path="/JobPosts" element={<JobPosts />} />

        {/* Redirect to login if user is not authenticated */}
        {!user && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;
