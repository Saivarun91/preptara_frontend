"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/adminnavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, FileText, Activity } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: "Users" | "BookOpen" | "FileText" | "Activity";
}

interface ActivityItem {
  user: string;
  action: string;
  time: string;
}

const iconMap: Record<string, React.ElementType> = { Users, BookOpen, FileText, Activity };

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------ Auth Check ------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      router.push("/admin/auth");
    }
  }, [router]);

  // ------------------ Fetch Dynamic Dashboard Data ------------------
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await fetch("/api/admin/stats");
      const statsData: Stat[] = await statsRes.json();

      const activityRes = await fetch("/api/admin/recent-activity");
      const activityData: ActivityItem[] = await activityRes.json();

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null || loading) {
    return <p className="text-center py-20">Loading admin dashboard...</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* <AdminSidebar /> */}

      <div className="flex-1 flex flex-col">
        {/* <AdminNavbar /> */}

        <main className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Welcome, Admin 👋</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = iconMap[stat.icon];
              return (
                <Card
                  key={idx}
                  className="border border-gray-200 rounded-2xl shadow hover:shadow-lg transition-all"
                >
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentActivity.length === 0 ? (
                  <p className="text-gray-500">No recent activity yet.</p>
                ) : (
                  recentActivity.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between p-3 bg-gray-50 rounded-lg shadow-sm"
                    >
                      <div>
                        <p className="font-medium">{item.user}</p>
                        <p className="text-sm text-gray-500">{item.action}</p>
                      </div>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Top Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li>UPSC Civil Services - 5420 students</li>
                  <li>JEE Main & Advanced - 11000 students</li>
                  <li>NEET Medical - 9500 students</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 shadow rounded-xl p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-2">Manage Categories</h2>
              <p className="text-gray-600 mb-3">Create, edit, or delete categories.</p>
              <button
                onClick={() => router.push("/admin/categories")}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Categories
              </button>
            </div>

            <div className="bg-white border border-gray-200 shadow rounded-xl p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-2">Manage Tests</h2>
              <p className="text-gray-600 mb-3">View or create practice tests.</p>
              <button
                onClick={() => router.push("/admin/tests")}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Tests
              </button>
            </div>

            <div className="bg-white border border-gray-200 shadow rounded-xl p-6 hover:shadow-lg transition">
              <h2 className="text-lg font-semibold mb-2">User Management</h2>
              <p className="text-gray-600 mb-3">View or manage student accounts.</p>
              <button
                onClick={() => router.push("/admin/users")}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Manage Users
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
