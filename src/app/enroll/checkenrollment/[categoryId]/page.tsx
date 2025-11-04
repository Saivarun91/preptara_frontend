// "use client";

// import { useEffect, useState } from "react";

// interface PageProps {
//   params: { categoryId: string };
// }

// interface EnrollmentResponse {
//   already_enrolled: boolean;
//   message?: string;
//   error?: string;
// }

// export default function CheckEnrollmentPage({ params }: PageProps) {
//   const categoryId = params.categoryId;

//   const [enrolled, setEnrolled] = useState<boolean | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [enrolling, setEnrolling] = useState(false);

//   // ✅ Fetch enrollment status when component mounts
//   useEffect(() => {
//     const fetchEnrollment = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Please log in to continue.");
//           setEnrolled(false);
//           setLoading(false);
//           return;
//         }

//         const res = await fetch(
//           `http://127.0.0.1:8000/api/enrollments/check/${categoryId}/`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data: EnrollmentResponse = await res.json();

//         if (!res.ok) {
//           setError(data.error || "Failed to fetch enrollment status");
//           setEnrolled(false);
//         } else {
//           setEnrolled(data.already_enrolled);
//         }
//       } catch (err: any) {
//         console.error("❌ Enrollment check failed:", err);
//         setError("Something went wrong while checking enrollment.");
//         setEnrolled(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEnrollment();
//   }, [categoryId]);

//   // ✅ Handle Enrollment
//   const handleEnroll = async () => {
//     setEnrolling(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Please log in to enroll in this course.");
//         setEnrolling(false);
//         return;
//       }

//       const res = await fetch("http://127.0.0.1:8000/api/enrollments/create/", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           course_name: categoryId, // or course_id depending on backend
//           duration_months: 3, // optional
//         }),
//       });

//       const data: EnrollmentResponse = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Enrollment failed. Try again later.");
//       } else {
//         setEnrolled(true);
//         alert(data.message || "Enrollment successful!");
//       }
//     } catch (err: any) {
//       console.error("❌ Enrollment error:", err);
//       setError("Something went wrong while enrolling.");
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   // ✅ Render UI
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
//       <h1 className="text-2xl font-semibold mb-6">
//         Course ID: <span className="text-blue-600">{categoryId}</span>
//       </h1>

//       {loading ? (
//         <p className="text-gray-500">Checking enrollment...</p>
//       ) : error ? (
//         <div className="bg-red-100 text-red-700 p-3 rounded-lg shadow-md mb-4">
//           ⚠️ {error}
//         </div>
//       ) : enrolled ? (
//         <div className="bg-green-100 text-green-700 p-4 rounded-lg shadow-md">
//           ✅ You are already enrolled in this course.
//         </div>
//       ) : (
//         <button
//           onClick={handleEnroll}
//           disabled={enrolling}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition disabled:bg-gray-400"
//         >
//           {enrolling ? "Enrolling..." : "Unlock Free Access"}
//         </button>
//       )}
//     </div>
//   );
// }
