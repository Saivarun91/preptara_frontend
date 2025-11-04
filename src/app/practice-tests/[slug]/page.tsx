"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Enrollment {
  id: string;
  user_name: string;
  course_name: string;
  duration_months: number;
  enrolled_date: string;
  expiry_date: string;
}

export default function PracticeTestDetailPage() {
   const searchParams = useSearchParams();
  const router = useRouter();

  const categoryId = searchParams.get("categoryId");
  console.log(categoryId)
  const duration = searchParams.get("duration");
  console.log(duration)
 

  const [category, setCategory] = useState<Category | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);

  // ✅ Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/`);
        const data = await res.json();
        if (data.success) {
          setCategory(data.data);
        }
      } catch (err) {
        console.error("Error fetching category:", err);
      }
    };
    fetchCategory();
  }, [categoryId]);

  // ✅ Check if the user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setIsEnrolled(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/enrollments/check/${categoryId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data.success && data.enrolled) {
          setIsEnrolled(true);
          setEnrollmentData(data.data);
        } else {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Error checking enrollment:", err);
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [categoryId]);

  // ✅ Unlock free access (enroll user)
const handleUnlockAccess = async () => {
  if (!categoryId) {
    alert("Category ID not found. Please try again.");
    return;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Please log in first.");
    router.push("/login");
    return;
  }

  try {
    setUnlocking(true);
    const res = await fetch("http://127.0.0.1:8000/api/enrollments/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_id: categoryId, // ✅ send only when ready
        duration_months: duration,
      }),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Course unlocked successfully!");
      setIsEnrolled(true);
      setEnrollmentData(data.data);
    } else {
      alert("⚠️ " + data.message);
    }
  } catch (error) {
    console.error("Error unlocking access:", error);
  } finally {
    setUnlocking(false);
  }
};

  // ✅ Start test (navigate to test start page)
  const handleStartTest = () => {
    router.push(`/practice-tests/${categoryId}/start`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-lg rounded-2xl border border-sky-100">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-sky-700">
              {category.name}
            </CardTitle>
            <p className="text-gray-600 mt-2">{category.description}</p>
          </CardHeader>

          <CardContent className="mt-6">
            {isEnrolled ? (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-semibold">
                  ✅ You are already enrolled in this course.
                </p>
                <Button
                  onClick={handleStartTest}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Start Test
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-gray-700 font-medium">
                  Unlock free access to this course to start learning!
                </p>
                <Button
                  onClick={handleUnlockAccess}
                  disabled={unlocking}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg"
                >
                  {unlocking ? "Unlocking..." : "Unlock Free Access"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {enrollmentData && (
          <div className="mt-6 bg-white rounded-xl shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Enrollment Details
            </h2>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>
                <strong>ID:</strong> {enrollmentData.id}
              </li>
              <li>
                <strong>User:</strong> {enrollmentData.user_name}
              </li>
              <li>
                <strong>Course:</strong> {enrollmentData.course_name}
              </li>
              <li>
                <strong>Enrolled:</strong>{" "}
                {new Date(enrollmentData.enrolled_date).toLocaleDateString()}
              </li>
              <li>
                <strong>Expires:</strong>{" "}
                {new Date(enrollmentData.expiry_date).toLocaleDateString()}
              </li>
            </ul>
          </div>
        )}
      </motion.div>
    </div>
  );
}
