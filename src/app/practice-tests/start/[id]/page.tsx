"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  marks: number;
  explanation: string;
}

interface TestData {
  attempt_id: string;
  questions: Question[];
  time_limit: number;
  category_name: string;
  test_name: string;
  description: string;
}

export default function StartTestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [testData, setTestData] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  // ✅ Check Enrollment
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login first.");
          router.push("/login");
          return;
        }
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await axios.get(
          `${API_BASE_URL}/api/enrollments/check/${id}/test`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEnrolled(res.data.already_enrolled);
      } catch (err) {
        console.error("Enrollment check failed:", err);
        setEnrolled(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) checkEnrollment();
  }, [id, router]);

  // ✅ Fetch Test
  useEffect(() => {
    if (enrolled !== true || !id) return;

    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await axios.post(
          `${API_BASE_URL}/api/exams/start/`,
          { category_id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTestData(res.data);
        setSubmitted(false);
        setAnswers({});
        setCurrentIndex(0);
        setTimeLeft(res.data.time_limit * 60);
      } catch (err) {
        console.error("❌ Failed to load test:", err);
        alert("Failed to load test. Please try again.");
      }
    };

    fetchTest();
  }, [id, enrolled]);

  // ✅ Timer
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleAnswer = (qid: string, ans: string, isMultiple = false) => {
    if (isMultiple) {
      const current = Array.isArray(answers[qid]) ? [...(answers[qid] as string[])] : [];
      setAnswers({
        ...answers,
        [qid]: current.includes(ans) ? current.filter((a) => a !== ans) : [...current, ans],
      });
    } else {
      setAnswers({ ...answers, [qid]: ans });
    }
  };

  // ✅ Submit Test
  const handleSubmit = async () => {
    if (!testData) return;
    try {
      const token = localStorage.getItem("token");
      const user_answers = Object.entries(answers).map(([qid, ans]) => ({
        question_id: qid,
        selected_answers: Array.isArray(ans) ? ans : [ans],
      }));

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      await axios.post(
        `${API_BASE_URL}/api/exams/attempt/${testData.attempt_id}/submit/`,
        { user_answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
      router.push(`/results/${testData.attempt_id}`);
    } catch (err: any) {
      console.error("❌ Submission error:", err);
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen text-lg">Checking enrollment...</div>;

  if (enrolled === false)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Unlock Free Access</h2>
          <button
            onClick={() => setEnrolled(true)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            🔓 Unlock Free Access
          </button>
        </div>
      </div>
    );

  if (!testData)
    return <div className="flex justify-center items-center h-screen text-lg">Loading test...</div>;

  const q = testData.questions[currentIndex];
  const totalQuestions = testData.questions.length;
  const answeredCount = Object.values(answers).filter(
    (a) => a && (Array.isArray(a) ? a.length > 0 : true)
  ).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Pagination for navigator
  const questionsPerPage = 20;
  const totalPages = Math.ceil(totalQuestions / questionsPerPage);
  const start = page * questionsPerPage;
  const end = start + questionsPerPage;
  const currentPageQuestions = testData.questions.slice(start, end);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Improved Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md py-6 px-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{testData.category_name}</h1>
          <p className="text-gray-200 text-sm mt-1">{testData.description}</p>
          <p className="mt-2 font-semibold text-yellow-300">🧩 {testData.test_name}</p>
        </div>
        <div className="bg-blue-500 px-5 py-2 rounded-xl text-lg font-semibold">
          ⏱ Time Limit: {Math.floor(testData.time_limit)} mins
        </div>
      </div>

      <div className="flex flex-1">
        {/* ✅ Question Navigator */}
        <div className="w-1/4 bg-white shadow-lg p-5 flex flex-col rounded-r-2xl">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            🧭 Question Navigator
          </h2>
          <p className="text-sm text-gray-600">
            Answered: <span className="text-green-600 font-semibold">{answeredCount}</span> /{" "}
            {totalQuestions}
          </p>
          <p className="text-sm text-gray-600 mb-4">Remaining: {totalQuestions - answeredCount}</p>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {currentPageQuestions.map((question, i) => {
              const globalIndex = start + i;
              let bgColor = "bg-gray-200 text-gray-700 hover:bg-gray-300"; // not answered
              if (answers[question.id]) bgColor = "bg-blue-500 text-white"; // answered
              if (globalIndex === currentIndex) bgColor = "bg-green-500 text-white"; // current

              return (
                <button
                  key={question.id}
                  onClick={() => setCurrentIndex(globalIndex)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${bgColor}`}
                >
                  {globalIndex + 1}
                </button>
              );
            })}
          </div>

          {/* Page navigation */}
          <div className="flex justify-between mt-auto">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              ◀
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              ▶
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitted}
            className={`mt-4 w-full py-2 rounded-lg font-semibold ${
              submitted
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {submitted ? "Submitted" : "Submit Test"}
          </button>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Timer + Progress */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  Answered: {answeredCount}/{totalQuestions} ({progressPercent}%)
                </p>
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xl font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                ⏱ {formatTime(timeLeft)}
              </div>
            </div>

            {/* Question */}
            <h3 className="text-xl font-semibold mb-3">
              Q{currentIndex + 1}. {q.question_text}
            </h3>
            <span className="text-blue-600 font-medium">{q.marks} Mark</span>

            {/* Options */}
            <div className="flex flex-col gap-4 mt-5">
              {(Array.isArray(q.options) ? q.options : []).map((opt: string, i: number) => {
                const isMultiple =
                  q.question_type.toUpperCase() === "MCQ" && q.options.length > 2;
                const checked = isMultiple
                  ? Array.isArray(answers[q.id]) &&
                    (answers[q.id] as string[]).includes(opt)
                  : answers[q.id] === opt;

                return (
                  <label
                    key={i}
                    className="flex items-center gap-3 cursor-pointer bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <input
                      type={isMultiple ? "checkbox" : "radio"}
                      name={q.id}
                      value={opt}
                      checked={checked}
                      onChange={() => handleAnswer(q.id, opt, isMultiple)}
                    />
                    <span className="text-gray-800">{opt}</span>
                  </label>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Previous
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1))}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save & Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className={`px-6 py-2 rounded-lg font-semibold ${
                    submitted
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {submitted ? "Submitted" : "Submit Test"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
