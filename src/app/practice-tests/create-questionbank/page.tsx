"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  id: string;
  name: string;
}

interface Question {
  id: string;
  question_text: string;
}

export default function CreateQuestionBank() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Fetch categories and questions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const resCategories = await axios.get(`${API_BASE_URL}/api/categories/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(resCategories.data);

        const resQuestions = await axios.get(`${API_BASE_URL}/api/questions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(resQuestions.data);
      } catch (err) {
        alert("Failed to load categories or questions");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCategory || !name || selectedQuestions.length === 0) {
      alert("Please fill all required fields and select at least one question");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        category: selectedCategory,
        name,
        description,
        question_ids: selectedQuestions,
      };

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const res = await axios.post(
        `${API_BASE_URL}/api/question-bank/create/`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`✅ ${res.data.message}`);
      // Reset form
      setSelectedCategory("");
      setSelectedQuestions([]);
      setName("");
      setDescription("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create question bank");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Create Question Bank</h2>

      {/* Category */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Category *</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Name *</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter question bank name"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>

      {/* Questions */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Select Questions *</label>
        <div className="max-h-64 overflow-y-auto border rounded p-2">
          {questions.map((q) => (
            <label key={q.id} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(q.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedQuestions([...selectedQuestions, q.id]);
                  } else {
                    setSelectedQuestions(selectedQuestions.filter((id) => id !== q.id));
                  }
                }}
              />
              <span>{q.question_text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Creating..." : "Create Question Bank"}
      </button>
    </div>
  );
}
