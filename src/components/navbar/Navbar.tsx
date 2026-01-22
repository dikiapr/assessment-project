"use client";

import { useRouter } from "next/navigation";
import { authAPI } from "@/src/services/api";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      authAPI.logout();
      router.push("/login");
    }
  };

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold text-gray-800">Food Store App</h1>

      <div className="flex items-center gap-4">
        {/* User Info */}
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={18} />
            <div>
              <p className="font-medium text-gray-800">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
