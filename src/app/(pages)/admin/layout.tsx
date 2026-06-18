"use client";

import { useState, ReactNode, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useCurrentAdmin } from "@/hooks/admin/useCurrentAdmin";
import { useRouter } from "next/navigation";
import PageLoading from "@/components/page-loading";

interface AuthCheckWrapperProps {
  children: ReactNode;
}

export default function AuthCheckWrapper({ children }: AuthCheckWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { data:user, isLoading, isError, error } = useCurrentAdmin();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Only redirect when query is done and user is definitely not authenticated
    // Check if error is 401/403 (not admin) vs other errors (network etc)
    if (!isLoading) {
      const status = (error as any)?.response?.status;
      if (!user && isError && (status === 401 || status === 403)) {
        // Not authenticated - redirect to admin login
        router.push("/admin");
      }
    }
  }, [isLoading, user, isError, error, router]);

  if (isLoading) {
    return <PageLoading />;
  }

  // If no user and no explicit auth error, still show loading briefly
  // (could be a timing issue on first render after refresh)
  if (!user && !isError) {
    return <PageLoading />;
  }

  // Auth error that isn't 401/403 - could be network issue, show the UI
  if (isError && !user) {
    const status = (error as any)?.response?.status;
    if (status === 401 || status === 403) {
      return <PageLoading />; // Will redirect via useEffect
    }
    // Network or other error - still try to show UI
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-900/10">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Right Side Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 w-full relative z-[60]">
          <Header />
        </header>

        {/* Main content area */}
        <main className="flex-1 px-5 py-5 overflow-y-auto overflow-x-hidden  transition-all duration-300 bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="min-h-full w-full  ">{children}</div>
        </main>
      </div>
    </div>
  );
}