"use client";

import LoginForm from "@/components/login-form";
import ModeToggle from "@/components/mode-toggle";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function LoginPage() {


  useEffect(() => {
    const keepServerAlive = () => {
      // Array of endpoints to ping
      const endpoints = ["/keep-alive", "/keep-alive2"];
    
      // Random interval between 4-5 minutes (avoiding exact 5-minute intervals)
      const getRandomInterval = () => 4 * 60 * 1000 + Math.random() * (60 * 1000);
    
      // Ping random endpoint
      const pingServer = () => {
        const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
        const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
    
        axios.get(`${serverUrl}${endpoint}`).catch((error) => {
          console.log(`Keep-alive request to ${endpoint} failed:`, error.message);
        });
    
        // Schedule next ping with random interval
        setTimeout(pingServer, getRandomInterval());
      };
    
      // Start the first ping
      pingServer();
    };
    keepServerAlive();
  }, []);
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 transition-all px-4 py-8 overflow-hidden text-gray-900 dark:text-gray-100">
      
      {/* Theme Toggle */}
      <div className="absolute right-4 top-4 z-10">
        <ModeToggle />
      </div>

      {/* Background Decorative Blobs - visible only in dark mode */}
      <div className="hidden dark:block absolute -top-24 -left-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-purple-bright/30 blur-3xl animate-pulse" />
      <div className="hidden dark:block absolute -bottom-24 -right-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-purple-button/30 blur-3xl animate-pulse" />

      {/* Centered Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl bg-background p-6 sm:p-8 ring-1 ring-white/10 dark:ring-white/5 backdrop-blur-sm shadow-xl shadow-purple-300 dark:shadow-none"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-400">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            Login to your dashboard
          </p>
        </div>
        <LoginForm />
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 mt-6 text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 px-2">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  );
}
