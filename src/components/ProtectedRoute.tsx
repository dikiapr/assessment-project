"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/src/services/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    const user = authAPI.getCurrentUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (requireAdmin && user.role !== "ADMIN") {
      router.push("/transactions");
      return;
    }
  }, [router, requireAdmin]);

  return <>{children}</>;
};

export default ProtectedRoute;
