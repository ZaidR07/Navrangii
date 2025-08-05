"use client";

import React from "react";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { useLogout } from "@/hooks/admin/useLogout";
import { useCurrentAdmin } from "@/hooks/admin/useCurrentAdmin";

export default function Header() {
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: user, isLoading, isError } = useCurrentAdmin();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header
      className="
        flex items-center justify-between w-full px-6 py-4
        bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-lg
        border-b border-purple-200/30 dark:border-purple-700/30 shadow-sm
      "
    >
      {/* Mobile Centered Welcome */}
      <div className="sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="text-center">
          <p className="text-xs font-medium bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
            Welcome
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isLoading ? 'Loading...' : user?.email || 'User'}
          </p>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Welcome Text */}
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            Welcome back,
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {isLoading ? 'Loading...' : user?.email || 'User'}
          </span>
        </div>

        {/* Mode Toggle */}
        <ModeToggle />

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label="Logout"
        >
          {isLoggingOut ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LogOut className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}