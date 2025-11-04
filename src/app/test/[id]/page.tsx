"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function StartTestDashboard() {
  const router = useRouter();
  const { id } = useParams(); // test/category ID

  const [loading, setLoading] = useState(true);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  // ✅ Check enrollment status on mount
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in first!");
          setAlreadyEnrolled(false);
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://127.0.0.1:8000/api/enrollments/check/${id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAlreadyEnrolled(res.data.already_enrolled);
      } catch (err: any) {
        console.error("Enrollment check failed:", err);
        setError("Failed to check enrollment");
        setAlreadyEnrolled(false);
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [id]);

  // ✅ Enroll (Unlock Free Access)
  const handleUnlock = async () => {
    try {
      setEnrolling(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first!");
        return;
      }

      await axios.post(
        `http://127.0.0.1:8000/api/enrollments/create/`,
        {
          course_name: id,
          duration_months: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Free access unlocked successfully!");
      setAlreadyEnrolled(true);
    } catch (err: any) {
      console.error(err);
      alert("❌ Failed to unlock free access");
    } finally {
      setEnrolling(false);
    }
  };

  // ✅ Navigate to actual test
  const handleStartTest = () => {
    router.push(`/test/${id}`);
  };

  // --- UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Checking enrollment...
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">🚀 Start Your Test</h1>
        <p className="text-gray-600 mb-8">
          Prepare to take the test for this course. Make sure you have a stable internet
          connection before you start.
        </p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {alreadyEnrolled ? (
          <button
            onClick={handleStartTest}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg"
          >
            ▶ Start Test
          </button>
        ) : (
          <button
            onClick={handleUnlock}
            disabled={enrolling}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg disabled:bg-gray-400"
          >
            {enrolling ? "Unlocking..." : "🔓 Unlock Free Access"}
          </button>
        )}
      </div>
    </div>
  );
}
