"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Notice {
  id: number;
  text: string;
  bgColor: string;
  textColor: string;
}

const notices: Notice[] = [
  {
    id: 1,
    text: "🎉 Free Shipping on Orders Above ₹2,999 - Limited Time Offer!",
    bgColor: "bg-purple-600",
    textColor: "text-white"
  },
  {
    id: 2,
    text: "💕 New Couple Collection - Perfect Matching Outfits for Him & Her",
    bgColor: "bg-purple-600",
    textColor: "text-white"
  },
  {
    id: 3,
    text: "⭐ Get 50% OFF on All Fashion Items - Awesome August Sale!",
    bgColor: "bg-purple-600",
    textColor: "text-white"
  },
  {
    id: 4,
    text: "🚚 Easy Returns & Exchange - 30 Day Return Policy",
    bgColor: "bg-purple-600",
    textColor: "text-white"
  },
  {
    id: 5,
    text: "💎 Premium Jewelry Collection - Handcrafted with Love",
    bgColor: "bg-purple-600",
    textColor: "text-white"
  }
];

export default function NoticeBar() {
  const [currentNotice, setCurrentNotice] = useState(0);

  // Auto-advance notices every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextNotice = () => {
    setCurrentNotice((prev) => (prev + 1) % notices.length);
  };

  const prevNotice = () => {
    setCurrentNotice((prev) => (prev - 1 + notices.length) % notices.length);
  };

  return (
    <div className={`relative ${notices[currentNotice].bgColor} ${notices[currentNotice].textColor} py-3 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Chevron */}
          <motion.button
            onClick={prevNotice}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Notice Text Container */}
          <div className="flex-1 text-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNotice}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-sm md:text-base font-medium"
              >
                {notices[currentNotice].text}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Chevron */}
          <motion.button
            onClick={nextNotice}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>


      </div>

      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear"
        }}
        style={{
          width: "200%",
          height: "100%",
          top: 0,
          left: "-100%"
        }}
      />
    </div>
  );
}
