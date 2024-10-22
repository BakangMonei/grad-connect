// src/components/SplashScreen.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to the login page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5 }}
          className="text-center text-white"
        >
          <h1 className="text-4xl font-bold">Welcome to Grad-Connect</h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
            className="h-1 bg-white mt-4 rounded"
          ></motion.div>
          <p className="mt-4 text-lg">Connecting graduates to opportunities.</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;
