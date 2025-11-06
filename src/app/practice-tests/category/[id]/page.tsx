"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export interface PracticeTest {
  id: string;
  title: string;
  questions: number;
  duration: number;
  avg_score?: number;
  attempts?: number;
}

export default function CategoryTestsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [categoryName, setCategoryName] = useState("");
  const [tests, setTests] = useState<PracticeTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        // Fetch category info
        const catRes = await fetch(`${API_BASE_URL}/api/categories/${id}/`);
        if (!catRes.ok) throw new Error("Category not found");
        const catData = await catRes.json();
        setCategoryName(catData.name);
        setSelectedCategory(catData);

        // Check if user enrolled
        const token = localStorage.getItem("token");
        if (token) {
          const enrollRes = await fetch(
            `${API_BASE_URL}/api/enrollments/check/${id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const enrollData = await enrollRes.json();
          if (enrollData.success || enrollData.already_enrolled) {
            setIsEnrolled(true);
          }
          
        }

        // Fetch tests
        const testRes = await fetch(
          `${API_BASE_URL}/api/tests/category/${id}/`
        );
        if (!testRes.ok) throw new Error("Failed to fetch tests");
        const testData: PracticeTest[] = await testRes.json();
        setTests(testData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [id]);

  const handleStartTest = (testId: string) => {
    if (isEnrolled) {
      router.push(`/practice-tests/start/${testId}`);
    } else {
      setSelectedTestId(testId);
      setIsModalOpen(true);
    }
  };

  // ✅ FIXED REDIRECT PATH HERE
  const handleUnlockRedirect = (duration: string) => {
    if (selectedCategory) {
      setIsModalOpen(false);
      router.push(`/enroll?categoryId=${selectedCategory.id}&duration=${duration}`);
    }
  };

  if (loading) return <p className="text-center py-20">Loading tests...</p>;
  if (error) return <p className="text-center py-20 text-red-600">{error}</p>;
  if (!tests.length)
    return <p className="text-center py-20">No tests in this category</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-10 text-center">{categoryName} Tests</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tests.map((test) => (
          <Card
            key={test.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-semibold">
                {test.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-gray-700">{test.questions} Questions</div>
              <div className="text-gray-700">{test.duration} mins</div>

              {test.avg_score !== undefined && (
                <div className="text-gray-700">
                  Avg Score: {test.avg_score}%
                </div>
              )}
              {test.attempts !== undefined && (
                <div className="text-gray-700">Attempts: {test.attempts}</div>
              )}

              <Button
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => handleStartTest(test.id)}
              >
                Start Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ✅ Unlock Full Access Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCategory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-3xl w-full mx-4 p-8 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-600 mb-4">
                Unlock Full Access
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Continue your test journey with unlimited access to all questions
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3 Months Plan */}
                <div className="border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-1">3 Months Access</h3>
                  <p className="text-gray-500 mb-3">
                    Access to all tests in this course
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">₹199</p>
                  <p className="text-gray-600 mb-4 space-y-1">
                    ✓ All test sets <br />
                    ✓ Performance analytics <br />
                    ✓ Detailed explanations <br />
                    ✓ Progress tracking <br />
                    ✓ Priority support <br />
                    ✓ Regular updates
                  </p>
                  <Button
                    onClick={() => handleUnlockRedirect("3-months")}
                    className="bg-blue-600 text-white w-full hover:bg-blue-700"
                  >
                    Get 3 Months Access
                  </Button>
                </div>

                {/* 1 Month Plan */}
                <div className="border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold mb-1">1 Month Access</h3>
                  <p className="text-gray-500 mb-3">
                    Access to all tests in this course
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-3">₹99</p>
                  <p className="text-gray-600 mb-4 space-y-1">
                    ✓ All test sets <br />
                    ✓ Basic analytics <br />
                    ✓ Answer explanations <br />
                    ✓ Test results tracking <br />
                    ✓ Email support
                  </p>
                  <Button
                    onClick={() => handleUnlockRedirect("1-month")}
                    className="bg-green-500 text-white w-full hover:bg-green-600"
                  >
                    Get 1 Month Access
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black hover:bg-gray-400 px-6"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
