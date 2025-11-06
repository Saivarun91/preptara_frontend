"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Enrollment {
  id: string;
  user_name: string;
  course_name?: string;
  category?: {
    id: string;
    name: string;
  };
  duration_months: number;
  enrolled_date: string;
  expiry_date: string;
  status: string;
  payment?: {
    id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    amount: number;
    currency: string;
    status: string;
    paid_at: string;
  };
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Replace with your actual token retrieval logic
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ Fetch enrollments from backend
  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/api/enrollments/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch enrollments");
      const result = await res.json();

      // Add `status` dynamically (active/expired)
      const today = new Date();
      const updatedData = result.data.map((item: any) => ({
        ...item,
        id: item.id || item._id || "",
        course_name: item.category?.name || item.course_name || "Unknown Course",
        status: new Date(item.expiry_date) > today ? "active" : "expired",
      }));

      setEnrollments(updatedData);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // ✅ Handle remove
  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this enrollment?")) return;

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${API_BASE_URL}/api/admin/enrollments/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete enrollment");

      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      alert("Enrollment deleted successfully");
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      alert("Failed to delete enrollment");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Enrollments</h1>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Loading enrollments...</p>
      ) : enrollments.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No enrollments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200 rounded-lg shadow-md bg-white">
            <thead className="bg-gradient-to-r from-sky-300 to-sky-400 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">User Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Course</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Duration (months)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Enrolled On</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Expiry</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enroll) => (
                <tr
                  key={enroll.id}
                  className="hover:bg-sky-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                    {enroll.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {enroll.course_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {enroll.duration_months}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {new Date(enroll.enrolled_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {new Date(enroll.expiry_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {enroll.payment ? (
                      <div className="text-sm">
                        <div className="font-medium">₹{enroll.payment.amount}</div>
                        <div className={`text-xs ${
                          enroll.payment.status === "completed" ? "text-green-600" : "text-orange-600"
                        }`}>
                          {enroll.payment.status}
                        </div>
                        {enroll.payment.razorpay_payment_id && (
                          <div className="text-xs text-gray-500">
                            ID: {enroll.payment.razorpay_payment_id.substring(0, 8)}...
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No payment</span>
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-semibold ${
                      enroll.status === "active"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {enroll.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white text-sm"
                      onClick={() => setSelectedStudent(enroll)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-400 text-red-500 text-sm hover:bg-red-50"
                      onClick={() => handleRemove(enroll.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{selectedStudent.user_name} Details</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">Course:</span> {selectedStudent.course_name}
              </p>
              <p>
                <span className="font-medium">Duration:</span> {selectedStudent.duration_months} month(s)
              </p>
              <p>
                <span className="font-medium">Enrolled On:</span>{" "}
                {new Date(selectedStudent.enrolled_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Expiry:</span>{" "}
                {new Date(selectedStudent.expiry_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className={selectedStudent.status === "active" ? "text-green-600" : "text-red-500"}>
                  {selectedStudent.status}
                </span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="default"
                className="bg-gray-700 hover:bg-gray-800 text-white"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
