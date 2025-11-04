"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiTrash2, FiUpload, FiPlus, FiX } from "react-icons/fi";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answers: number[];
  explanation: string;
}

interface CsvFile {
  id: string;
  filename: string;
  uploaded_at?: string;
  question_count?: number;
  // optionally backend may include question_ids: string[]
  question_ids?: string[];
}

export default function QuestionManagement() {
  const params = useParams();
  const id = params.id;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const { token } = useAuth();
  console.log("token : ", token);

  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "MCQ",
    options: [""],
    correct_answers: [] as number[],
    explanation: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  // --- NEW: CSV files state & modal
  const [csvFiles, setCsvFiles] = useState<CsvFile[]>([]);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [loadingCsvFiles, setLoadingCsvFiles] = useState(false);
  const [deletingCsvId, setDeletingCsvId] = useState<string | null>(null);

  // ✅ CREATE EXAM FUNCTION
  const createExam = async (
    category_id: string,
    title: string,
    duration: number,
    questions_per_test: number,
    description?: string,
    passing_score: number = 60
  ) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/exams/create/",
        {
          category_id,
          title,
          duration,
          questions_per_test,
          description,
          passing_score,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Exam created successfully!");
      return res.data.exam_id;
    } catch (err: any) {
      console.error("Failed to create exam:", err);
      alert(err.response?.data?.message || "Failed to create exam");
      return null;
    }
  };

  // ✅ FETCH QUESTIONS INITIALLY
  const fetchQuestions = async () => {
    try {
      setLoadingQuestions(true);
      const res = await axios.get("http://127.0.0.1:8000/api/questions/", {
        params: { category_id: id },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("questions : ", res.data);
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // --- NEW: fetch CSV files for this category/test only
  const fetchCsvFiles = async () => {
    try {
      setLoadingCsvFiles(true);
      const token = localStorage.getItem("token"); // or however you store it

      const res = await axios.get(
        "http://127.0.0.1:8000/api/exams/questions/csv-files/",
        {
          params: { category_id: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // expected shape: { csv_files: [...] }
      setCsvFiles(res.data.csv_files || []);
    } catch (err) {
      console.error("Failed to fetch csv files", err);
      setCsvFiles([]);
    } finally {
      setLoadingCsvFiles(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchCsvFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  // ✅ CSV UPLOAD HANDLER
  const handleCsvUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      alert("Please select a CSV file first!");
      return;
    }

    const formData = new FormData();
    formData.append("csv_file", csvFile);
    formData.append("category_id", id as string);

    try {
      setUploading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/exams/questions/upload-csv/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message || "CSV uploaded successfully");
      // refresh questions and csv files to reflect new upload
      await fetchQuestions();
      await fetchCsvFiles();
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setCsvFile(null);
    }
  };

  // ✅ DELETE SINGLE QUESTION (fixed)
  const handleDelete = async (qid: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete("http://127.0.0.1:8000/api/exams/questions/bulk-delete/", {
        headers: { Authorization: `Bearer ${token}` },
        data: { question_ids: [qid] }, // ✅ fixed: delete single question
      });
      setQuestions((prev) => prev.filter((q) => q.id !== qid));
      alert("Question deleted successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete question");
    }
  };

  // ✅ BULK DELETE QUESTIONS
  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question to delete!");
      return;
    }

    if (!confirm(`Delete ${selectedQuestions.length} selected question(s)?`))
      return;

    try {
      const res = await axios.delete(
        "http://127.0.0.1:8000/api/exams/questions/bulk-delete/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: { question_ids: selectedQuestions },
        }
      );

      alert(res.data.message || "Selected questions deleted successfully!");
      setQuestions((prev) =>
        prev.filter((q) => !selectedQuestions.includes(q.id))
      );
      setSelectedQuestions([]);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Bulk delete failed");
    }
  };

  // --- NEW: Delete CSV file (and its questions)
  const handleDeleteCsv = async (csvId: string) => {
    if (!confirm("Delete this CSV and its questions? This cannot be undone.")) return;

    try {
      setDeletingCsvId(csvId);
      // assume delete endpoint is: DELETE /api/exams/questions/csv-files/{csvId}/
      const res = await axios.delete(
        `http://127.0.0.1:8000/api/exams/questions/csv-files/${csvId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If backend returns deleted_question_ids, remove them locally.
      const deletedIds: string[] | undefined = res.data?.deleted_question_ids;
      if (Array.isArray(deletedIds) && deletedIds.length > 0) {
        setQuestions((prev) => prev.filter((q) => !deletedIds.includes(q.id)));
      } else {
        // otherwise refresh the questions list to reflect backend deletion
        await fetchQuestions();
      }

      // refresh csv files list too
      await fetchCsvFiles();

      alert(res.data.message || "CSV deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete csv file", err);
      alert(err.response?.data?.message || "Failed to delete CSV file");
    } finally {
      setDeletingCsvId(null);
    }
  };

  // ✅ ADD QUESTION SUBMIT
  const handleAddQuestionSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/questions/create/",
        {
          ...newQuestion,
          category_id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Question added successfully!");
      await fetchQuestions();
      setShowModal(false);
      setNewQuestion({
        question_text: "",
        question_type: "MCQ",
        options: [""],
        correct_answers: [],
        explanation: "",
      });
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add question");
    }
  };

  // ✅ Option Management
  const addOption = () =>
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    const updatedCorrect = newQuestion.correct_answers.includes(index)
      ? newQuestion.correct_answers.filter((i) => i !== index)
      : [...newQuestion.correct_answers, index];
    setNewQuestion({ ...newQuestion, correct_answers: updatedCorrect });
  };

  const toggleSelectQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  // ✅ Pagination
  const totalPages = Math.max(1, Math.ceil(questions.length / questionsPerPage));
  const startIndex = (currentPage - 1) * questionsPerPage;
  const currentQuestions = questions.slice(
    startIndex,
    startIndex + questionsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ✅ UI STARTS HERE
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Question Management</h1>
        <div className="flex gap-3">
          {selectedQuestions.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            >
              <FiTrash2 /> Delete Selected ({selectedQuestions.length})
            </button>
          )}

          {/* Add Question */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            <FiPlus /> Add Question
          </button>

          {/* NEW: View CSVs for this test */}
          <button
            onClick={() => {
              // open csv modal and ensure latest list
              fetchCsvFiles();
              setShowCsvModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
            title="View uploaded CSV files for this test"
          >
            <FiUpload /> CSV Files
          </button>
        </div>
      </div>

      {/* CSV Upload */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">
          Upload Questions via CSV (Optional)
        </h2>
        <form
          onSubmit={handleCsvUpload}
          className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        >
          <input
            type="file"
            accept=".csv"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCsvFile(e.target.files ? e.target.files[0] : null)
            }
            className="border border-gray-300 p-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
            disabled={uploading}
          >
            <FiUpload /> {uploading ? "Uploading..." : "Upload CSV"}
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Questions List
        </h2>

        {loadingQuestions ? (
          <p className="text-gray-500">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-600 italic">No questions found.</p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {currentQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm hover:shadow-md transition-shadow ${
                    selectedQuestions.includes(q.id) ? "ring-2 ring-red-400" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-blue-700 mb-2 text-lg">
                      {q.question_text}
                    </h3>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(q.id)}
                      onChange={() => toggleSelectQuestion(q.id)}
                      className="w-5 h-5 accent-red-500"
                    />
                  </div>

                  <p className="text-sm mb-2">
                    <span className="font-medium text-gray-700">Type:</span>{" "}
                    {q.question_type}
                  </p>
                  <ul className="mb-3 text-sm text-gray-800 list-disc pl-5 space-y-1">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={`${
                          q.correct_answers.includes(idx)
                            ? "font-semibold text-green-600"
                            : ""
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  {q.explanation && (
                    <p className="text-gray-600 text-sm mb-2">
                      <span className="font-medium text-gray-700">
                        Explanation:
                      </span>{" "}
                      {q.explanation}
                    </p>
                  )}
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm shadow-sm transition-all"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
                }`}
              >
                Prev
              </button>
              <span className="text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Add Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Question
            </h2>
            <form
              onSubmit={handleAddQuestionSubmit}
              className="space-y-4 max-h-[70vh] overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Question Text
                </label>
                <textarea
                  value={newQuestion.question_text}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question_text: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Question Type
                </label>
                <select
                  value={newQuestion.question_type}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question_type: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="SINGLE">Single Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Options
                </label>
                {newQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="flex-1 border rounded p-2"
                      placeholder={`Option ${idx + 1}`}
                      required
                    />
                    <input
                      type="checkbox"
                      checked={newQuestion.correct_answers.includes(idx)}
                      onChange={() => toggleCorrectAnswer(idx)}
                    />
                    <span className="text-sm">Correct</span>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  + Add Option
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Explanation
                </label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      explanation: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow-md"
              >
                Save Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW: CSV Files Modal */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 pt-16 pb-16 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCsvModal(false)}
            >
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Uploaded CSV Files for this Test
            </h2>

            {loadingCsvFiles ? (
              <p className="text-gray-500">Loading CSV files...</p>
            ) : csvFiles.length === 0 ? (
              <p className="text-gray-600 italic">No CSV files uploaded for this test.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {csvFiles.map((c) => (
                  <div key={c.id} className="border border-gray-200 rounded p-3 flex justify-between items-center bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-800">{c.filename}</div>
                      {c.uploaded_at && (
                        <div className="text-xs text-gray-500">Uploaded: {new Date(c.uploaded_at).toLocaleString()}</div>
                      )}
                      {typeof c.question_count === "number" && (
                        <div className="text-xs text-gray-500">Questions: {c.question_count}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteCsv(c.id)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm shadow-sm transition-all"
                        disabled={deletingCsvId === c.id}
                      >
                        {deletingCsvId === c.id ? "Deleting..." : <><FiTrash2/> Delete</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}





// "use client";

// import { useState, ChangeEvent, FormEvent, useEffect } from "react";
// import { FiTrash2, FiUpload, FiPlus, FiX } from "react-icons/fi";
// import axios from "axios";
// import { useParams } from "next/navigation";
// import { useAuth } from "@/contexts/AuthContext";

// interface Question {
//   id: string;
//   question_text: string;
//   question_type: string;
//   options: string[];
//   correct_answers: number[];
//   explanation: string;
// }

// export default function QuestionManagement() {
//   const params = useParams();
//   const id = params.id;
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [csvFile, setCsvFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [loadingQuestions, setLoadingQuestions] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
//   const { token } = useAuth();
//   console.log("token : ", token);

//   const [newQuestion, setNewQuestion] = useState({
//     question_text: "",
//     question_type: "MCQ",
//     options: [""],
//     correct_answers: [] as number[],
//     explanation: "",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const questionsPerPage = 10;

//   // ✅ CREATE EXAM FUNCTION
//   const createExam = async (
//     category_id: string,
//     title: string,
//     duration: number,
//     questions_per_test: number,
//     description?: string,
//     passing_score: number = 60
//   ) => {
//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/exams/create/",
//         {
//           category_id,
//           title,
//           duration,
//           questions_per_test,
//           description,
//           passing_score,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert(res.data.message || "Exam created successfully!");
//       return res.data.exam_id;
//     } catch (err: any) {
//       console.error("Failed to create exam:", err);
//       alert(err.response?.data?.message || "Failed to create exam");
//       return null;
//     }
//   };

//   // ✅ FETCH QUESTIONS INITIALLY
//   const fetchQuestions = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/questions/", {
//         params: { category_id: id },
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("questions : ", res.data);
//       setQuestions(res.data.questions || []);
//     } catch (err) {
//       console.error("Failed to fetch questions", err);
//     } finally {
//       setLoadingQuestions(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuestions();
//   }, [id, token]);

//   // ✅ CSV UPLOAD HANDLER
//   const handleCsvUpload = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!csvFile) {
//       alert("Please select a CSV file first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("csv_file", csvFile);
//     formData.append("category_id", id as string);

//     try {
//       setUploading(true);
//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/exams/questions/upload-csv/",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       alert(res.data.message);
//       await fetchQuestions();
//     } catch (err: any) {
//       alert(err.response?.data?.message || "Upload failed");
//     } finally {
//       setUploading(false);
//       setCsvFile(null);
//     }
//   };

//   // ✅ DELETE SINGLE QUESTION (fixed)
//   const handleDelete = async (qid: string) => {
//     if (!confirm("Are you sure you want to delete this question?")) return;
//     try {
//       await axios.delete("http://127.0.0.1:8000/api/exams/questions/bulk-delete/", {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { question_ids: [qid] }, // ✅ fixed: delete single question
//       });
//       setQuestions((prev) => prev.filter((q) => q.id !== qid));
//       alert("Question deleted successfully!");
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to delete question");
//     }
//   };

//   // ✅ BULK DELETE QUESTIONS
//   const handleBulkDelete = async () => {
//     if (selectedQuestions.length === 0) {
//       alert("Please select at least one question to delete!");
//       return;
//     }

//     if (!confirm(`Delete ${selectedQuestions.length} selected question(s)?`))
//       return;

//     try {
//       const res = await axios.delete(
//         "http://127.0.0.1:8000/api/exams/questions/bulk-delete/",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           data: { question_ids: selectedQuestions },
//         }
//       );

//       alert(res.data.message || "Selected questions deleted successfully!");
//       setQuestions((prev) =>
//         prev.filter((q) => !selectedQuestions.includes(q.id))
//       );
//       setSelectedQuestions([]);
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.message || "Bulk delete failed");
//     }
//   };

//   // ✅ ADD QUESTION SUBMIT
//   const handleAddQuestionSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         "http://127.0.0.1:8000/api/questions/create/",
//         {
//           ...newQuestion,
//           category_id: id,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert(res.data.message || "Question added successfully!");
//       await fetchQuestions();
//       setShowModal(false);
//       setNewQuestion({
//         question_text: "",
//         question_type: "MCQ",
//         options: [""],
//         correct_answers: [],
//         explanation: "",
//       });
//     } catch (err: any) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to add question");
//     }
//   };

//   // ✅ Option Management
//   const addOption = () =>
//     setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ""] });

//   const updateOption = (index: number, value: string) => {
//     const newOptions = [...newQuestion.options];
//     newOptions[index] = value;
//     setNewQuestion({ ...newQuestion, options: newOptions });
//   };

//   const toggleCorrectAnswer = (index: number) => {
//     const updatedCorrect = newQuestion.correct_answers.includes(index)
//       ? newQuestion.correct_answers.filter((i) => i !== index)
//       : [...newQuestion.correct_answers, index];
//     setNewQuestion({ ...newQuestion, correct_answers: updatedCorrect });
//   };

//   const toggleSelectQuestion = (id: string) => {
//     setSelectedQuestions((prev) =>
//       prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
//     );
//   };

//   // ✅ Pagination
//   const totalPages = Math.ceil(questions.length / questionsPerPage);
//   const startIndex = (currentPage - 1) * questionsPerPage;
//   const currentQuestions = questions.slice(
//     startIndex,
//     startIndex + questionsPerPage
//   );

//   const goToPage = (page: number) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   // ✅ UI STARTS HERE
//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Question Management</h1>
//         <div className="flex gap-3">
//           {selectedQuestions.length > 0 && (
//             <button
//               onClick={handleBulkDelete}
//               className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//             >
//               <FiTrash2 /> Delete Selected ({selectedQuestions.length})
//             </button>
//           )}
//           <button
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//           >
//             <FiPlus /> Add Question
//           </button>
//         </div>
//       </div>

//       {/* CSV Upload */}
//       <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
//         <h2 className="text-xl font-semibold mb-3 text-gray-800">
//           Upload Questions via CSV (Optional)
//         </h2>
//         <form
//           onSubmit={handleCsvUpload}
//           className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
//         >
//           <input
//             type="file"
//             accept=".csv"
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setCsvFile(e.target.files ? e.target.files[0] : null)
//             }
//             className="border border-gray-300 p-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
//           />
//           <button
//             type="submit"
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all"
//             disabled={uploading}
//           >
//             <FiUpload /> {uploading ? "Uploading..." : "Upload CSV"}
//           </button>
//         </form>
//       </div>

//       {/* Questions List */}
//       <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">
//           Questions List
//         </h2>

//         {loadingQuestions ? (
//           <p className="text-gray-500">Loading questions...</p>
//         ) : questions.length === 0 ? (
//           <p className="text-gray-600 italic">No questions found.</p>
//         ) : (
//           <>
//             <div className="flex flex-col gap-4">
//               {currentQuestions.map((q) => (
//                 <div
//                   key={q.id}
//                   className={`border border-gray-200 rounded-lg p-5 bg-gray-50 shadow-sm hover:shadow-md transition-shadow ${
//                     selectedQuestions.includes(q.id) ? "ring-2 ring-red-400" : ""
//                   }`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-semibold text-blue-700 mb-2 text-lg">
//                       {q.question_text}
//                     </h3>
//                     <input
//                       type="checkbox"
//                       checked={selectedQuestions.includes(q.id)}
//                       onChange={() => toggleSelectQuestion(q.id)}
//                       className="w-5 h-5 accent-red-500"
//                     />
//                   </div>

//                   <p className="text-sm mb-2">
//                     <span className="font-medium text-gray-700">Type:</span>{" "}
//                     {q.question_type}
//                   </p>
//                   <ul className="mb-3 text-sm text-gray-800 list-disc pl-5 space-y-1">
//                     {q.options.map((opt, idx) => (
//                       <li
//                         key={idx}
//                         className={`${
//                           q.correct_answers.includes(idx)
//                             ? "font-semibold text-green-600"
//                             : ""
//                         }`}
//                       >
//                         {opt}
//                       </li>
//                     ))}
//                   </ul>
//                   {q.explanation && (
//                     <p className="text-gray-600 text-sm mb-2">
//                       <span className="font-medium text-gray-700">
//                         Explanation:
//                       </span>{" "}
//                       {q.explanation}
//                     </p>
//                   )}
//                   <button
//                     onClick={() => handleDelete(q.id)}
//                     className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm shadow-sm transition-all"
//                   >
//                     <FiTrash2 /> Delete
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center items-center gap-3 mt-8">
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
//                   currentPage === 1
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
//                 }`}
//               >
//                 Prev
//               </button>
//               <span className="text-gray-700 font-medium">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-4 py-2 rounded-md text-sm font-medium border transition-all ${
//                   currentPage === totalPages
//                     ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     : "bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Add Question Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
//             <button
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//               onClick={() => setShowModal(false)}
//             >
//               <FiX size={20} />
//             </button>
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//               Add New Question
//             </h2>
//             <form
//               onSubmit={handleAddQuestionSubmit}
//               className="space-y-4 max-h-[70vh] overflow-y-auto"
//             >
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Question Text
//                 </label>
//                 <textarea
//                   value={newQuestion.question_text}
//                   onChange={(e) =>
//                     setNewQuestion({
//                       ...newQuestion,
//                       question_text: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Question Type
//                 </label>
//                 <select
//                   value={newQuestion.question_type}
//                   onChange={(e) =>
//                     setNewQuestion({
//                       ...newQuestion,
//                       question_type: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
//                 >
//                   <option value="MCQ">MCQ</option>
//                   <option value="SINGLE">Single Choice</option>
//                   <option value="TRUE_FALSE">True/False</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Options
//                 </label>
//                 {newQuestion.options.map((opt, idx) => (
//                   <div key={idx} className="flex items-center gap-2 mb-2">
//                     <input
//                       type="text"
//                       value={opt}
//                       onChange={(e) => updateOption(idx, e.target.value)}
//                       className="flex-1 border rounded p-2"
//                       placeholder={`Option ${idx + 1}`}
//                       required
//                     />
//                     <input
//                       type="checkbox"
//                       checked={newQuestion.correct_answers.includes(idx)}
//                       onChange={() => toggleCorrectAnswer(idx)}
//                     />
//                     <span className="text-sm">Correct</span>
//                   </div>
//                 ))}
//                 <button
//                   type="button"
//                   onClick={addOption}
//                   className="text-blue-600 text-sm font-medium hover:underline"
//                 >
//                   + Add Option
//                 </button>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Explanation
//                 </label>
//                 <textarea
//                   value={newQuestion.explanation}
//                   onChange={(e) =>
//                     setNewQuestion({
//                       ...newQuestion,
//                       explanation: e.target.value,
//                     })
//                   }
//                   className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium shadow-md"
//               >
//                 Save Question
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


