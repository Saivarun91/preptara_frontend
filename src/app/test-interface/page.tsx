// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { motion } from "framer-motion";
// import { Card, CardContent, Progress } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Clock, CheckCircle, Flag } from "lucide-react";

// // Interface for questions returned from backend
// interface Question {
//   id: string;
//   question_text: string;
//   options: string[];
//   question_type: "single" | "multiple";
//   marks: number;
//   correct_answers: string[];
// }

// export default function ExamInterface() {
//   const { examId } = useParams(); // from route: /exams/[examId]
//   const router = useRouter();

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0); // seconds
//   const [testAttemptId, setTestAttemptId] = useState<string | null>(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [totalMarks, setTotalMarks] = useState(0);

//   // ------------------ START EXAM ------------------
//   useEffect(() => {
//     const startExam = async () => {
//       try {
//         const res = await fetch(`/api/exams/start/${examId}`, { method: "POST" });
//         const data = await res.json();
//         if (data.success) {
//           setQuestions(data.questions);
//           setTestAttemptId(data.test_attempt_id);
//           setTimeLeft(data.duration * 60); // minutes -> seconds
//           setTotalMarks(data.total_marks);
//         } else {
//           alert(data.message);
//           router.push("/student/exams");
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Failed to start exam");
//         router.push("/student/exams");
//       }
//     };
//     startExam();
//   }, [examId]);

//   // ------------------ TIMER & AUTO SUBMIT ------------------
//   useEffect(() => {
//     if (!timeLeft || submitted) return;

//     const timer = setInterval(async () => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           autoSubmit(); // auto submit when time ends
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, submitted]);

//   // ------------------ HANDLE ANSWERS ------------------
//   const handleAnswerChange = (questionId: string, option: string, checked: boolean) => {
//     setAnswers((prev) => {
//       const prevAns = prev[questionId] || [];
//       let updated = checked ? [...prevAns, option] : prevAns.filter((o) => o !== option);
//       // Single choice radio: only one option
//       const question = questions.find((q) => q.id === questionId);
//       if (question?.question_type === "single") updated = [option];
//       return { ...prev, [questionId]: updated };
//     });
//   };

//   // ------------------ SAVE PROGRESS ------------------
//   const saveProgress = async () => {
//     if (!testAttemptId) return;
//     try {
//       await fetch(`/api/exams/save/${testAttemptId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ answers: Object.entries(answers).map(([id, answer]) => ({ id, answer })) }),
//       });
//     } catch (err) {
//       console.error("Failed to save progress", err);
//     }
//   };

//   // ------------------ SUBMIT EXAM ------------------
//   const handleSubmit = async () => {
//     if (!testAttemptId) return;

//     try {
//       const res = await fetch(`/api/exams/submit/${testAttemptId}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ answers: Object.entries(answers).map(([id, answer]) => ({ id, answer })) }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setScore(data.score);
//         setTotalMarks(data.total_marks);
//         setSubmitted(true);
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit exam");
//     }
//   };

//   // ------------------ AUTO SUBMIT ------------------
//   const autoSubmit = async () => {
//     if (!testAttemptId) return;
//     try {
//       const res = await fetch(`/api/exams/auto-submit/${testAttemptId}`, { method: "POST" });
//       const data = await res.json();
//       if (data.success) {
//         setScore(data.score);
//         setTotalMarks(data.total_marks);
//         setSubmitted(true);
//       }
//     } catch (err) {
//       console.error("Auto submit failed", err);
//     }
//   };

//   // ------------------ TIMER FORMATTING ------------------
//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   if (!questions.length) return <p className="text-center py-20">Loading exam...</p>;

//   if (submitted) {
//     const correctCount = questions.filter((q) => {
//       const ans = answers[q.id] || [];
//       return JSON.stringify(ans.sort()) === JSON.stringify(q.correct_answers.sort());
//     }).length;
//     const wrongCount = Object.keys(answers).length - correctCount;

//     return (
//       <div className="min-h-screen pt-16 flex items-center justify-center p-4">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl w-full">
//           <Card>
//             <CardContent className="p-8 text-center">
//               <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
//               <h2 className="text-3xl font-bold mb-2">Test Completed!</h2>
//               <p className="mb-4">Score: {score}/{totalMarks}</p>
//               <p>Correct: {correctCount} | Wrong: {wrongCount}</p>
//               <Button className="mt-4" onClick={() => router.push("/student/exams")}>Back to Exams</Button>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     );
//   }

//   const question = questions[currentQuestion];
//   const progress = ((currentQuestion + 1) / questions.length) * 100;

//   return (
//     <div className="min-h-screen pt-16 bg-background">
//       {/* Header */}
//       <div className="bg-card border-b sticky top-16 z-10 p-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-xl font-bold">{`Question ${currentQuestion + 1} of ${questions.length}`}</h1>
//           <Progress value={progress} className="mt-2" />
//         </div>
//         <div className="flex items-center gap-4">
//           <Clock className="h-5 w-5 text-primary" />
//           <span>{formatTime(timeLeft)}</span>
//           <Button variant="destructive" onClick={handleSubmit} className="ml-2">
//             <Flag className="w-4 h-4 mr-1" /> Submit Test
//           </Button>
//         </div>
//       </div>

//       {/* Question */}
//       <div className="container mx-auto px-4 py-8">
//         <Card>
//           <CardContent>
//             <p className="mb-4 font-semibold">{question.question_text} ({question.marks} marks)</p>
//             <div className="space-y-2">
//               {question.options.map((opt) => (
//                 <label key={opt} className="block cursor-pointer">
//                   <input
//                     type={question.question_type === "multiple" ? "checkbox" : "radio"}
//                     name={question.id}
//                     value={opt}
//                     checked={(answers[question.id] || []).includes(opt)}
//                     onChange={(e) => handleAnswerChange(question.id, opt, e.target.checked)}
//                     className="mr-2"
//                   />
//                   {opt}
//                 </label>
//               ))}
//             </div>
//             <div className="flex justify-between mt-4">
//               <Button
//                 disabled={currentQuestion === 0}
//                 onClick={() => setCurrentQuestion(currentQuestion - 1)}
//               >
//                 Previous
//               </Button>
//               <Button
//                 disabled={currentQuestion === questions.length - 1}
//                 onClick={() => setCurrentQuestion(currentQuestion + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//             <Button className="mt-4 w-full" onClick={saveProgress}>Save Progress</Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
