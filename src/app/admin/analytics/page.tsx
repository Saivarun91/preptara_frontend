"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

// ✅ Define TypeScript interfaces for your analytics data
interface EnrollmentPerCourse {
  course: string;
  students: number;
}

interface RevenuePerCourse {
  course: string;
  revenue: number;
}

interface TopCourse {
  course: string;
  students: number;
}

interface AnalyticsData {
  success: boolean;
  totalCourses: number;
  activeCourses: number;
  enrollmentPerCourse: EnrollmentPerCourse[];
  revenuePerCourse: RevenuePerCourse[];
  topCourses: TopCourse[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth(); // ✅ Admin JWT token

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return; // wait for token

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const response = await axios.get<AnalyticsData>(
          `${API_BASE_URL}/api/categories/analytics/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAnalyticsData(response.data);
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? err.response?.data?.error
          : "Failed to fetch analytics";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading analytics...</div>;
  }

  if (error || !analyticsData?.success) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Failed to load analytics data"}
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of courses, enrollments, and revenue.
        </p>
      </motion.div>

      {/* Total Courses / Active Courses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" /> Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData.totalCourses}
            </p>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" /> Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData.activeCourses}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment per Course */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" /> Enrollment per Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {analyticsData.enrollmentPerCourse.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="font-medium">{course.course}</p>
                <p className="font-bold text-gray-900">
                  {course.students.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue per Course */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" /> Revenue per Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {analyticsData.revenuePerCourse.map((course, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="font-medium">{course.course}</p>
                <p className="font-bold text-gray-900">{course.revenue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Courses */}
      <Card className="border hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" /> Top Performing Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData.topCourses.map((course, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full">
                  {idx + 1}
                </div>
                <p className="font-medium">{course.course}</p>
              </div>
              <p className="font-bold text-gray-900">
                {course.students.toLocaleString()} students
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
