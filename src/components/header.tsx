"use client";

import React from "react";
import ModeToggle from "./mode-toggle";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/admin/useLogout";
import { useCurrentAdmin } from "@/hooks/admin/useCurrentAdmin";

export default function Header() {
  const { mutate: logout } = useLogout();
  const { data: user } = useCurrentAdmin();
 

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
            User
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
           {user?.name || "User"}
          </span>
        </div>

        {/* Mode Toggle */}
        <ModeToggle />

        {/* Logout Button */}
        <Button
          variant="default"
          size="sm"
          onClick={()=>logout()}
          className="
            flex items-center gap-2
            bg-gradient-to-r from-purple-600 to-violet-600
            hover:from-purple-700 hover:to-violet-700
            text-white
            transition-all duration-200 rounded-xl px-4 py-2
            shadow-md
          "
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>

      {/* Mobile logout */}
      <div className="sm:hidden absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="default"
          size="icon"
          onClick={()=>logout()}
          className="
            bg-gradient-to-r from-purple-600 to-violet-600
            hover:from-purple-700 hover:to-violet-700
            text-white
            rounded-full p-2 shadow-md
          "
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}