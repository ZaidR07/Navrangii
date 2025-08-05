"use client";

import LoginForm from "@/components/login-form";
import ModeToggle from "@/components/mode-toggle";
import { motion } from "framer-motion";

export default function AdminLoginPage() {



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
