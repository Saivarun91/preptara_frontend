"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Student {
  id: string;
  fullname: string;
  email: string;
  phone_number: string;
}

function EnrollmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get("categoryId");
  const durationQuery = searchParams.get("duration") as "1-month" | "3-months" | null;

  const [category, setCategory] = useState<Category | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
  const [duration, setDuration] = useState<"1-month" | "3-months">(durationQuery || "1-month");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      try {
        // ✅ Fetch category
        const catRes = await fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/`);
        if (!catRes.ok) throw new Error("Failed to fetch category");
        const catData: Category = await catRes.json();
        setCategory(catData);

        // ✅ Fetch student info
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not logged in");

        const studentRes = await fetch("http://127.0.0.1:8000/api/users/me/", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!studentRes.ok) throw new Error("Failed to fetch student info");
        const studentData: Student = await studentRes.json();
        setStudent(studentData);

        // ✅ Check if already enrolled
        const enrollmentRes = await fetch(
          `http://127.0.0.1:8000/api/enrollments/check/${categoryId}/`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (enrollmentRes.ok) {
          const data = await enrollmentRes.json();
          if (data.already_enrolled) setAlreadyEnrolled(true);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load enrollment data. Please try again.");
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (!enrollmentDate) return;
    const date = new Date(enrollmentDate);
    date.setMonth(date.getMonth() + (duration === "1-month" ? 1 : 3));
    setExpiryDate(date.toISOString().split("T")[0]);
  }, [enrollmentDate, duration]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !category || !student) {
      alert("Missing data. Try again.");
      return;
    }

    try {
      setProcessingPayment(true);
      const token = localStorage.getItem("token");
      const durationMonths = duration === "1-month" ? 1 : 3;
      const amount = duration === "1-month" ? 99 : 299;

      // Create Razorpay order
      const orderRes = await fetch("http://127.0.0.1:8000/api/enrollments/payment/create-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          category_id: categoryId,
          duration_months: durationMonths,
          amount: amount,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        alert(orderData.message || "Failed to create payment order");
        setProcessingPayment(false);
        return;
      }

      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        alert("Failed to load Razorpay SDK");
        setProcessingPayment(false);
        return;
      }

      // Initialize Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100, // Convert to paise
        currency: orderData.currency,
        name: "Course Enrollment",
        description: `Enrollment for ${category.name} - ${duration}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyRes = await fetch("http://127.0.0.1:8000/api/enrollments/payment/verify/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payment_id: orderData.payment_id,
                category_id: categoryId,
                duration_months: durationMonths,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccess(true);
            } else {
              alert(verifyData.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: student.fullname,
          email: student.email,
          contact: student.phone_number,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Try again.");
      setProcessingPayment(false);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!category || !student)
    return <p className="text-center py-20 text-red-600">Failed to load data</p>;

  if (success)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-200 to-blue-200">
        <Card className="p-10 rounded-3xl shadow-xl bg-white">
          <CardContent className="text-center">
            <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Enrolled Successfully!</h1>
            <p className="text-gray-700 mb-4">
              You have successfully enrolled for <strong>{category.name}</strong> for{" "}
              <strong>{duration}</strong>.
            </p>
            <Button
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              onClick={() => router.push("/practice-tests")}
            >
              Back to Practice Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  if (alreadyEnrolled)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-200 to-blue-200">
        <Card className="p-10 rounded-3xl shadow-xl bg-white">
          <CardContent className="text-center">
            <CheckCircle className="mx-auto text-green-500 w-20 h-20 mb-6" />
            <h1 className="text-3xl font-bold mb-4">Already Enrolled!</h1>
            <p className="text-gray-700 mb-4">
              You are already enrolled in <strong>{category.name}</strong>. Enjoy your course!
            </p>
            <Button
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
              onClick={() => router.push("/practice-tests")}
            >
              Go to Practice Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border border-gray-200 rounded-3xl shadow-lg">
        <CardContent className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-blue-100 to-blue-50">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
            <p className="text-gray-600 mt-2">{category.description}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="px-4 py-2 rounded-full bg-blue-200 text-blue-800 font-semibold">
              Selected Plan: {duration}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg border rounded-3xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Student Info</h2>
            <p><strong>Name:</strong> {student.fullname}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone_number}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border rounded-3xl bg-gray-50">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard /> Payment
            </h2>
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <p className="text-sm text-gray-600 mb-2">Course Details</p>
                <p className="font-semibold">{category.name}</p>
                <p className="text-sm text-gray-500">Duration: {duration}</p>
              </div>
              <div className="flex justify-between border-t pt-4 font-bold text-lg">
                <span>Total Amount:</span>
                <span className="text-blue-600">{duration === "1-month" ? "₹99" : "₹299"}</span>
              </div>
              <Button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4 disabled:opacity-50"
              >
                {processingPayment ? "Processing..." : "Pay with Razorpay"}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Secure payment powered by Razorpay
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Force dynamic rendering since this page depends on search params
export const dynamic = 'force-dynamic';

export default function EnrollmentPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading...</p>}>
      <EnrollmentContent />
    </Suspense>
  );
}
