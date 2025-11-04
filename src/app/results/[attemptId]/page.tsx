"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Question {
  question_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: string[];
  user_selected_answers: string[];
  is_correct: boolean;
  marks: number;
  marks_awarded: number;
  explanation: string;
}

interface ResultSummary {
  score: number;
  total_marks: number;
  percentage: number;
  passed: boolean;
  start_time?: string;
  end_time?: string;
}

const TestResultPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ResultSummary | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!attemptId) return;

    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please log in again");
          router.push("/login");
          return;
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

        const resultUrl = `${baseUrl}/api/exams/results/${attemptId}/`;
        const questionsUrl = `${baseUrl}/api/exams/attempt/${attemptId}/questions/`;

        const [resultRes, questionsRes] = await Promise.all([
          axios.get(resultUrl, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(questionsUrl, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (resultRes.data.success && resultRes.data.result)
          setSummary(resultRes.data.result);
        else throw new Error("Invalid result data");

        if (questionsRes.data.success && Array.isArray(questionsRes.data.questions))
          setQuestions(questionsRes.data.questions);
        else throw new Error("Invalid questions data");
      } catch (err) {
        console.error("❌ Error fetching test results:", err);
        alert("Failed to load test results. Please try again.");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading your results...
      </div>
    );

  if (!summary)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        No result data found.
      </div>
    );

  // ✅ Count correct & wrong
  const correctCount = questions.filter((q) => q.is_correct).length;
  const wrongCount = questions.length - correctCount;

  // ✅ Calculate time taken
  const getTimeTaken = () => {
    if (!summary.start_time || !summary.end_time) return "N/A";
    const start = new Date(summary.start_time);
    const end = new Date(summary.end_time);
    const diffMs = end.getTime() - start.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          ✅ Test Completed Successfully!
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Here’s your performance summary and detailed review.
        </p>

        {/* ✅ Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-green-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Correct Answers</p>
            <p className="text-xl font-bold text-green-700">{correctCount}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Wrong Answers</p>
            <p className="text-xl font-bold text-red-700">{wrongCount}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Time Taken</p>
            <p className="text-xl font-bold text-blue-700">{getTimeTaken()}</p>
          </div>
        </div>

        {/* ✅ Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-10">
          <div
            className={`h-4 rounded-full ${
              summary.percentage >= 50
                ? "bg-gradient-to-r from-green-400 to-green-600"
                : "bg-gradient-to-r from-red-400 to-red-600"
            }`}
            style={{ width: `${summary.percentage}%` }}
          ></div>
        </div>

        {/* ✅ Question Review Section */}
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`border-l-4 pb-6 pl-4 ${
                q.is_correct ? "border-green-500" : "border-red-500"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">
                  Q{index + 1}. {q.question_text}
                </h3>
                <div className="text-sm">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      q.is_correct
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {q.is_correct ? "✓ Correct" : "✗ Incorrect"} (
                    {q.marks_awarded}/{q.marks} marks)
                  </span>
                </div>
              </div>

              {/* ✅ Options highlighting */}
              <ul className="space-y-2 mb-3">
                {q.options.map((opt, i) => {
                  const isCorrect = q.correct_answers.includes(opt);
                  const isUserSelected = q.user_selected_answers.includes(opt);

                  return (
                    <li
                      key={i}
                      className={`p-3 rounded-md border transition ${
                        isCorrect
                          ? "bg-green-50 border-green-400 text-green-800 font-medium"
                          : isUserSelected && !isCorrect
                          ? "bg-red-50 border-red-400 text-red-800 font-medium"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      {opt}
                    </li>
                  );
                })}
              </ul>

              {/* ✅ Explanation */}
              {q.explanation && (
                <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Explanation:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ✅ Back button */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
