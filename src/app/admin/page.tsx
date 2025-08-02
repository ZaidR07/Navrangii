"use client";

import LoginForm from "@/components/login-form";
import ModeToggle from "@/components/mode-toggle";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function AdminLoginPage() {


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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent"
            >
              Admin Login
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 dark:text-gray-300 mt-2"
            >
              Welcome back! Please sign in to continue.
            </motion.p>
          </div>
          
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
}
