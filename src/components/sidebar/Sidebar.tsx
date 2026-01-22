"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Users, ShoppingCart, FileText } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return pathname === path
      ? "bg-red-900 text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

  return (
    <aside className="w-60 bg-white border-r min-h-screen p-4">
      <nav className="space-y-2">
        {user?.role === "ADMIN" && (
          <>
            <Link
              href="/products"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive(
                "/products",
              )}`}
            >
              <Package size={20} />
              <span>Products</span>
            </Link>

            <Link
              href="/users"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive(
                "/users",
              )}`}
            >
              <Users size={20} />
              <span>Users</span>
            </Link>
          </>
        )}

        <Link
          href="/transactions"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive(
            "/transactions",
          )}`}
        >
          <ShoppingCart size={20} />
          <span>Transactions</span>
        </Link>

        <Link
          href="/reports"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive(
            "/reports",
          )}`}
        >
          <FileText size={20} />
          <span>Reports</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
