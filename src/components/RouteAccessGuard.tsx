"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageLoading from "@/components/page-loading";
import { useAuth } from "@/context/UserContext";
import { useCurrentAdmin } from "@/hooks/admin/useCurrentAdmin";

interface RouteAccessGuardProps {
  children: ReactNode;
}

export default function RouteAccessGuard({ children }: RouteAccessGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useAuth();
  const { data: currentAdmin, isLoading: isAdminLoading, error } = useCurrentAdmin();

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminSession = currentAdmin?.isAdmin === true || user?.isAdmin === true;
  const isCustomerSession = !!user && !user.isAdmin && !currentAdmin?.isAdmin;
  const status = (error as any)?.response?.status;
  const hasAdminAuthError = status === 401 || status === 403;

  useEffect(() => {
    if (isUserLoading || isAdminLoading) {
      return;
    }

    if (isAdminRoute) {
      if (isCustomerSession) {
        router.replace("/");
        return;
      }

      if (pathname === "/admin" && isAdminSession) {
        router.replace("/admin/dashboard");
        return;
      }

      if (pathname !== "/admin" && !isAdminSession && hasAdminAuthError) {
        router.replace("/admin");
      }

      return;
    }

    if (isAdminSession) {
      router.replace("/admin/dashboard");
    }
  }, [
    hasAdminAuthError,
    isAdminLoading,
    isAdminRoute,
    isAdminSession,
    isCustomerSession,
    isUserLoading,
    pathname,
    router,
  ]);

  if (isAdminRoute) {
    if (isCustomerSession) {
      return <PageLoading />;
    }

    if (pathname === "/admin") {
      if (isAdminLoading || isUserLoading) {
        return <PageLoading />;
      }

      return <>{children}</>;
    }

    if (isAdminLoading || isUserLoading) {
      return <PageLoading />;
    }

    if (!isAdminSession) {
      return <PageLoading />;
    }
  }

  return <>{children}</>;
}
