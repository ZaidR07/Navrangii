"use client";

import { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useCurrentAdmin } from "@/hooks/admin/useCurrentAdmin";
import { useRouter } from "next/navigation";
import PageLoading from "@/components/page-loading";
import PageError from "@/components/page-error";

interface AuthCheckWrapperProps {
  children: ReactNode;
}

export default function AuthCheckWrapper({ children }: AuthCheckWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { data:user, isLoading, isError } = useCurrentAdmin();


useEffect(() => {
  if (!isLoading && !user && !isError) {
    router.push("/");
  }
}, [isLoading, user, isError, router]);
  
  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    return <PageError />;
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
        <header className="flex-shrink-0 w-full">
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
