"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/src/services/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = authAPI.getCurrentUser();

    if (user) {
      // Jika sudah login, redirect ke halaman sesuai role
      if (user.role === "ADMIN") {
        router.push("/products");
      } else {
        router.push("/transactions");
      }
    } else {
      // Jika belum login, redirect ke login
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}
