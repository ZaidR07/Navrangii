"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useGetVariable } from "@/hooks/variable/useGetVariable";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sectionColors = [
  "bg-pink-100", "bg-blue-100", "bg-purple-100", "bg-yellow-100",
  "bg-green-100", "bg-red-100", "bg-indigo-100", "bg-orange-100",
];

export default function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  const { data: variablesData } = useGetVariable();

  const sections = variablesData?.section || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 h-[90vh] max-h-[800px] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center text-gray-900">Shop by Section</h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            {/* Sections Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-4">
                {sections.map((section: string, idx: number) => {
                  const bgColor = sectionColors[idx % sectionColors.length];
                  return (
                    <Link
                      key={section}
                      href={`/products?section=${encodeURIComponent(section)}`}
                      className="group block"
                      onClick={onClose}
                    >
                      <div className="flex flex-col items-center p-4 rounded-lg border border-gray-100 hover:bg-purple-50 transition-colors">
                        <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200`}>
                          <span className="text-2xl font-bold text-gray-700">{section.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors text-center">
                          {section}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
