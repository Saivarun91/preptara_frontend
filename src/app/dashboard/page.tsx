"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiFileText,
  FiTrendingUp,
  FiAward,
  FiLogOut,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardStats {
  username: string;
  total_tests: number;
  best_score: number;
  average_score: number;
  unlocked_courses: number;
}

interface Test {
  id: string;
  title: string;
  date: string;
  total_questions: number;
  answered: number;
  status: "Completed" | "Pending" | "In Progress";
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id");

    //   if (!token || !userId) {
    //     window.location.href = "/auth";
    //     return;
    //   }

      const dashboardRes = await axios.post(
        `http://127.0.0.1:8000/api/dashboard/user/${userId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (dashboardRes.data.success) setStats(dashboardRes.data.dashboard);

      const testsRes = await axios.get(
        `http://127.0.0.1:8000/api/dashboard/tests/user/${userId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (testsRes.data.success) {
        setTests(testsRes.data.tests);
        setFilteredTests(testsRes.data.tests);
      }
    } catch (err: any) {
      console.error("Error loading dashboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Refresh dashboard every 30 seconds to get latest test results
    const interval = setInterval(() => {
      fetchDashboard();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Filter logic
  useEffect(() => {
    let filtered = tests;
    if (activeTab !== "All") filtered = filtered.filter((t) => t.status === activeTab);
    if (search.trim())
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredTests(filtered);
  }, [activeTab, search, tests]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/auth";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-blue-600">{stats?.username || "User"}</span>
          </h1>
          <p className="text-gray-500">
            Track your progress and continue your learning journey 🚀
          </p>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
        >
          <FiLogOut /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            icon: <FiFileText className="text-green-600 text-3xl" />,
            label: "Total Tests",
            value: stats?.total_tests || 0,
          },
          {
            icon: <FiAward className="text-yellow-500 text-3xl" />,
            label: "Best Score",
            value: `${stats?.best_score || 0}%`,
          },
          {
            icon: <FiTrendingUp className="text-blue-600 text-3xl" />,
            label: "Average Score",
            value: `${stats?.average_score || 0}%`,
          },
          {
            icon: <FiAward className="text-purple-600 text-3xl" />,
            label: "Courses Unlocked",
            value: stats?.unlocked_courses || 0,
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 backdrop-blur-lg border border-blue-100 rounded-2xl p-6 shadow-md flex flex-col justify-between transition-transform"
          >
            <div className="flex items-center gap-3 mb-3">
              {item.icon}
              <p className="text-gray-600 font-medium">{item.label}</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tests Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg border border-blue-100 shadow-lg rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" /> Test Overview
            </h2>
            <p className="text-gray-500 text-sm">
              View all your tests and progress in one place
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="All">All ({tests.length})</TabsTrigger>
              <TabsTrigger value="Completed">
                Completed ({tests.filter((t) => t.status === "Completed").length})
              </TabsTrigger>
              <TabsTrigger value="In Progress">
                In Progress (
                {tests.filter((t) => t.status === "In Progress").length})
              </TabsTrigger>
              <TabsTrigger value="Pending">
                Pending ({tests.filter((t) => t.status === "Pending").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Input
          placeholder="🔍 Search tests..."
          className="mb-4 focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredTests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No tests found for this filter.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredTests.map((test) => (
              <motion.div
                key={test.id}
                whileHover={{ scale: 1.02 }}
                className="border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 flex justify-between items-center shadow-sm"
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {test.title}
                  </h3>
                  <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <FiCalendar /> {test.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFileText /> {test.answered} / {test.total_questions} answered
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      test.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : test.status === "Pending"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {test.status}
                  </span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Continue
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
