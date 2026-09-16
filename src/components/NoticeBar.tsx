"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetGeneralSettings } from "@/hooks/GeneralSettings/useGetGeneralSettings";

interface Notice {
  id: string;
  text: string;
  bgColor: string;
  textColor: string;
}

export default function NoticeBar() {
  const { settings } = useGetGeneralSettings();
  const [currentNotice, setCurrentNotice] = useState(0);

  // Build notices list from backend settings (only titles from newsAndOffers)
  const notices: Notice[] = (settings?.newsAndOffers || [])
    .filter((item) => item && item.title && (item.isActive ?? true))
    .map((item) => ({
      id: String(item.id ?? item.title),
      text: item.title,
      bgColor: "bg-purple-600",
      textColor: "text-white",
    }));

  // Auto-advance notices every 4 seconds
  useEffect(() => {
    if (!notices.length) return;
    const timer = setInterval(() => {
      setCurrentNotice((prev) => (prev + 1) % notices.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [notices.length]);

  const nextNotice = () => {
    if (!notices.length) return;
    setCurrentNotice((prev) => (prev + 1) % notices.length);
  };

  const prevNotice = () => {
    if (!notices.length) return;
    setCurrentNotice((prev) => (prev - 1 + notices.length) % notices.length);
  };

  if (!notices.length) return null;

  return (
    <div className={`relative ${notices[currentNotice].bgColor} ${notices[currentNotice].textColor} py-3 overflow-hidden`}>
      <div className="max-w-7xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
