"use client";

import { Loader2 } from "lucide-react";

interface LoaderSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoaderSpinner({ 
  message = "Loading...", 
  size = "md" 
}: LoaderSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-purple-600 dark:text-purple-400`} />
      <p className={`mt-4 font-medium text-purple-700 dark:text-purple-300 ${textSizeClasses[size]}`}>
        {message}
      </p>
    </div>
  );
}
