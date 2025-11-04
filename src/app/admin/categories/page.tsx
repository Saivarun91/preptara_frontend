"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiPlus, FiX, FiTrash2, FiEdit } from "react-icons/fi";

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();

  const BASE_URL = "http://127.0.0.1:8000/api/categories";

  // ------------------------
  // FETCH CATEGORIES
  // ------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
        const data: AdminCategory[] = await res.json();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ------------------------
  // SEARCH FUNCTIONALITY
  // ------------------------
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // ------------------------
  // ADD / UPDATE CATEGORY
  // ------------------------
  const handleSaveCategory = async () => {
    if (!categoryData.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const url = editMode
      ? `${BASE_URL}/${editId}/update/`
      : `${BASE_URL}/create/`;
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save category: ${res.status} - ${errText}`);
      }

      const newCategory = await res.json();

      if (editMode) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editId ? newCategory : c))
        );
        setFilteredCategories((prev) =>
          prev.map((c) => (c.id === editId ? newCategory : c))
        );
        alert("✅ Category updated successfully!");
      } else {
        setCategories((prev) => [...prev, newCategory]);
        setFilteredCategories((prev) => [...prev, newCategory]);
        alert("✅ Category added successfully!");
      }

      setShowModal(false);
      setEditMode(false);
      setCategoryData({ name: "", description: "" });
      setEditId(null);
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  };

  // ------------------------
  // DELETE SINGLE CATEGORY
  // ------------------------
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}/delete/`, { method: "DELETE" });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to delete: ${res.status} - ${errText}`);
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setFilteredCategories((prev) => prev.filter((c) => c.id !== id));
      alert("✅ Category deleted successfully!");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  };

  // ------------------------
  // EDIT CATEGORY
  // ------------------------
  const handleEditCategory = (cat: AdminCategory) => {
    setCategoryData({ name: cat.name, description: cat.description });
    setEditId(cat.id);
    setEditMode(true);
    setShowModal(true);
  };

  // ------------------------
  // HANDLE SELECT CATEGORY (for bulk delete)
  // ------------------------
  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ------------------------
  // BULK DELETE CATEGORIES
  // ------------------------
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one category to delete.");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories?`))
      return;

    try {
      for (const id of selectedIds) {
        await fetch(`${BASE_URL}/${id}/delete/`, { method: "DELETE" });
      }

      setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setFilteredCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      alert("✅ Selected categories deleted successfully!");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  };

  // ------------------------
  // CONDITIONAL UI STATES
  // ------------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading categories...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        {error}
      </div>
    );

  // ------------------------
  // PAGE UI
  // ------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h2
          className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Manage Categories
        </motion.h2>

        {/* Search + Add/Delete */}
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          <Input
            type="text"
            placeholder="🔍 Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 rounded-xl border border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 transition-all shadow-sm px-4 py-2 text-gray-700"
          />

          <div className="flex gap-3">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
              onClick={() => {
                setEditMode(false);
                setCategoryData({ name: "", description: "" });
                setShowModal(true);
              }}
            >
              <FiPlus /> Add Category
            </Button>

            {selectedIds.length > 0 && (
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                onClick={handleBulkDelete}
              >
                <FiTrash2 /> Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="cursor-pointer bg-white rounded-2xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full relative">
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(cat.id)}
                    onChange={() => handleSelect(cat.id)}
                  />
                </div>

                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-2xl font-semibold text-indigo-700 mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {cat.description || "No description available."}
                    </p>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-all"
                      onClick={() => router.push(`/admin/categories/${cat.id}`)}
                    >
                      View
                    </Button>

                    <Button
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition-all flex items-center gap-1"
                      onClick={() => handleEditCategory(cat)}
                    >
                      <FiEdit /> Edit
                    </Button>

                    <Button
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 rounded-lg transition-all"
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <FiX size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <Input
                  type="text"
                  value={categoryData.name}
                  onChange={(e) =>
                    setCategoryData({ ...categoryData, name: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={categoryData.description}
                  onChange={(e) =>
                    setCategoryData({ ...categoryData, description: e.target.value })
                  }
                  className="w-full border rounded p-2 h-24 resize-none"
                />
              </div>

              <Button
                onClick={handleSaveCategory}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium shadow-md"
              >
                {editMode ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
