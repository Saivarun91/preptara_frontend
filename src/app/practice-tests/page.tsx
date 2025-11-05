"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; 

export interface TestCategory {
  id: string;
  name: string;
  description: string;
}

export default function PracticeTestsPage() {
  const { user, isLoggedIn } = useAuth();
  const [categories, setCategories] = useState<TestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/categories/");
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const data: TestCategory[] = await res.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleEnrollClick = (category: TestCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  const isEnrolled = (categoryId: string): boolean => {
    if (!user || !user.enrolled_courses) return false;
    return user.enrolled_courses.includes(categoryId);
  };

  // ✅ Redirect to enroll page when choosing unlock plan
  const handleUnlockRedirect = (duration: string) => {
    if (selectedCategory) {
      setIsModalOpen(false);
      window.location.href = `/enroll?categoryId=${selectedCategory.id}&duration=${duration}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-12 text-center">Practice Test Categories</h2>

      {loading && <p className="text-center py-20">Loading categories...</p>}
      {error && <p className="text-center py-20 text-red-600">{error}</p>}
      {!loading && !error && !categories.length && (
        <p className="text-center py-20">No categories found</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="cursor-pointer hover:shadow-2xl transition-all rounded-2xl border border-gray-200 h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                <p className="text-gray-600 text-sm">
                  {cat.description || "No description available"}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <Link href={`/practice-tests/category/${cat.id}`}>
                    <Button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                      View Tests
                    </Button>
                  </Link>
                  {isEnrolled(cat.id) ? (
                      <Button
                        disabled
                        className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                      >
                        Already Enrolled
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEnrollClick(cat)}
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                      >
                        Enroll
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
