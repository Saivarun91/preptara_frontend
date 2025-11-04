"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function AdminNavbar() {
  const router = useRouter();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") setAdminName(localStorage.getItem("name"));

    const handleStorageChange = () => {
      const role = localStorage.getItem("role");
      if (role === "admin") setAdminName(localStorage.getItem("name"));
      else setAdminName(null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = () => router.push("/auth");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setAdminName(null);
    router.push("/auth");
  };

  return (
    <nav
      className="
        fixed top-0 left-0 
        w-full h-16 
        bg-white shadow-md 
        border-b border-gray-200 
        p-4 flex justify-between items-center 
        text-gray-800 
        z-50
      "
    >
      {/* Logo */}
      <div
        className="text-2xl font-bold cursor-pointer hover:text-blue-600 transition"
        onClick={() => router.push("/admin")}
      >
        <span className="text-black">Prep</span>
        <span className="text-blue-600">Tara</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        <div className="relative cursor-pointer text-gray-600 hover:text-blue-600 transition">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-2 w-2"></span>
        </div>

        {adminName ? (
          <div className="relative">
            <Button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              variant="ghost"
              className="p-0 hover:bg-gray-100 rounded-full transition"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                  {adminName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold">{adminName}</p>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push("/admin/settings");
                  }}
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={handleLogin}
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}
