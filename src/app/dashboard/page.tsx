"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiFileText,
  FiTrendingUp,
  FiAward,
  FiLogOut,
  FiBookOpen,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

interface TestAttempt {
  id: string;
  title: string;
  date: string;
  total_questions: number;
  answered: number;
  status: string;
}

interface EnrolledCourse {
  id: string;
  course_name: string;
  price_paid: number;
  enrolled_date: string;
  expiry_date: string;
  duration_months: number;
}

export default function DashboardPage() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("test-attempts");
  const [search, setSearch] = useState("");
  const [dashboardStats, setDashboardStats] = useState({
    enrolled_courses_count: 0,
    attempts_count: 0,
  });
  const [tests, setTests] = useState<TestAttempt[]>([]);

  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  console.log("tests : ",tests)
  console.log("courses : ",courses)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  // Fetch dashboard stats
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/dashboard/stats/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setDashboardStats({
            enrolled_courses_count: response.data.dashboard.enrolled_courses || 0,
            attempts_count: response.data.dashboard.total_attempts || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, [isLoggedIn, user, baseUrl]);

  // Fetch test attempts
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchTestAttempts = async () => {
      try {
        setLoadingTests(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/dashboard/tests/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("test res : ",response.data)
        if (response.data.success) {
          setTests(response.data.tests || []);
        }
      } catch (error) {
        console.error("Error fetching test attempts:", error);
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTestAttempts();
  }, [isLoggedIn, user, baseUrl]);

  // Fetch enrolled courses
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchEnrolledCourses = async () => {
      try {
        setLoadingCourses(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${baseUrl}/api/enrollments/user/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          // Transform the data to match the expected format
          interface EnrollmentResponse {
  id: string;
  category?: {
    name?: string;
  };
  payment?: {
    amount?: number;
  };
  enrolled_date: string;
  expiry_date: string;
  duration_months: number;
}

          const transformedCourses = (response.data.data || []).map((enrollment: EnrollmentResponse) => ({
  id: enrollment.id,
  course_name: enrollment.category?.name || "Unknown Course",
  price_paid: enrollment.payment?.amount || 0,
  enrolled_date: enrollment.enrolled_date,
  expiry_date: enrollment.expiry_date,
  duration_months: enrollment.duration_months,
}));

          setCourses(transformedCourses);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchEnrolledCourses();
  }, [isLoggedIn, user, baseUrl]);

  // Filter tests based on search
  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // Filter courses based on search
  const filteredCourses = courses.filter((c) =>
    c.course_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading your dashboard...
      </div>
    );

  if (!isLoggedIn || !user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Please log in to access your dashboard.
      </div>
    );

  // // 🧩 ADMIN VIEW
  // if (user.role === "admin") {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
  //       <div className="flex justify-between items-center mb-10">
  //         <h1 className="text-3xl font-bold text-gray-800">
  //           Welcome, <span className="text-blue-600">{user.fullname || user.email}</span> 👋
  //         </h1>
  //         <Button
  //           onClick={logout}
  //           className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
  //         >
  //           <FiLogOut /> Logout
  //         </Button>
  //       </div>

  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //         <motion.div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
  //           <FiFileText className="text-blue-500 text-3xl mb-2" />
  //           <h2 className="text-lg font-semibold">Full Name</h2>
  //           <p className="text-gray-600">{user.fullname || "N/A"}</p>
  //         </motion.div>

  //         <motion.div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
  //           <FiCalendar className="text-green-500 text-3xl mb-2" />
  //           <h2 className="text-lg font-semibold">Email</h2>
  //           <p className="text-gray-600">{user.email}</p>
  //         </motion.div>

  //         <motion.div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
  //           <FiTrendingUp className="text-purple-500 text-3xl mb-2" />
  //           <h2 className="text-lg font-semibold">Phone Number</h2>
  //           <p className="text-gray-600">{user.phone_number || "N/A"}</p>
  //         </motion.div>
  //       </div>
  //     </div>
  //   );
  // }

  // 🧩 STUDENT VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-blue-600">{user.fullname || "Student"}</span>
          </h1>
          <p className="text-gray-500">
            Track your learning journey 🚀
          </p>
        </div>
        <Button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
        >
          <FiLogOut /> Logout
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 border border-blue-100 rounded-2xl p-6 shadow-md"
        >
          <FiBookOpen className="text-blue-600 text-3xl mb-2" />
          <p className="text-gray-600 font-medium">Number of Enrolled Courses</p>
          <p className="text-lg font-bold text-gray-800">
            {loadingStats ? "..." : dashboardStats.enrolled_courses_count}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 border border-blue-100 rounded-2xl p-6 shadow-md"
        >
          <FiFileText className="text-green-600 text-3xl mb-2" />
          <p className="text-gray-600 font-medium">No of Attempts</p>
          <p className="text-lg font-bold text-gray-800">
            {loadingStats ? "..." : tests.length}
          </p>
        </motion.div>
      </div>

      {/* Tabs Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 border border-blue-100 shadow-lg rounded-2xl p-6"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="test-attempts">
              Test Attempts ({tests.length})
            </TabsTrigger>
            <TabsTrigger value="enrolled-courses">
              Enrolled Courses ({courses.length})
            </TabsTrigger>
          </TabsList>

          <Input
            placeholder="🔍 Search..."
            className="mb-4 focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Test Attempts Tab */}
          <TabsContent value="test-attempts">
            {loadingTests ? (
              <p className="text-gray-500 text-center py-8">Loading test attempts...</p>
            ) : filteredTests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No test attempts found.
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
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Enrolled Courses Tab */}
          <TabsContent value="enrolled-courses">
            {loadingCourses ? (
              <p className="text-gray-500 text-center py-8">Loading enrolled courses...</p>
            ) : filteredCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No enrolled courses found.
              </p>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="border border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {course.course_name}
                        </h3>
                        <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <FiCalendar /> Enrolled: {new Date(course.enrolled_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar /> Expires: {new Date(course.expiry_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiTrendingUp /> Duration: {course.duration_months} month(s)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price Paid</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{course.price_paid.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {/* Timeline */}
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Start Date: {new Date(course.enrolled_date).toLocaleDateString()}</span>
                        <span className="text-blue-600">→</span>
                        <span>End Date: {new Date(course.expiry_date).toLocaleDateString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              ((new Date().getTime() - new Date(course.enrolled_date).getTime()) /
                                (new Date(course.expiry_date).getTime() - new Date(course.enrolled_date).getTime())) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
