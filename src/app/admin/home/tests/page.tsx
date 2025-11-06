"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Award,
  FileText,
  Briefcase,
  GraduationCap,
  BookOpen,
  Trash2,
  Edit,
  PlusCircle,
} from "lucide-react";

// All possible icon options for categories
const Icons: Record<string, any> = {
  Award,
  FileText,
  Briefcase,
  GraduationCap,
  BookOpen,
};

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  gradient?: string;
}

export default function AdminTestsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Category>({
    id: "",
    name: "",
    description: "",
    icon: "Award",
    gradient: "from-blue-500 via-cyan-500 to-teal-600",
  });

  const [isEditing, setIsEditing] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const BASE_URL = `${API_BASE_URL}/api/categories`;

  // --- Fetch all categories from backend ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await res.json();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- Handle input changes ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Create or Update Category ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast({ title: "Error ❌", description: "Name and description are required" });
      return;
    }

    const url = isEditing
      ? `${BASE_URL}/${formData.id}/update/`
      : `${BASE_URL}/create/`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save category: ${errText}`);
      }

      toast({
        title: isEditing ? "✅ Category Updated" : "✅ Category Created",
      });

      setFormData({
        id: "",
        name: "",
        description: "",
        icon: "Award",
        gradient: "from-blue-500 via-cyan-500 to-teal-600",
      });
      setIsEditing(false);
      fetchCategories();
    } catch (err: any) {
      toast({ title: "Error ❌", description: err.message });
    }
  };

  // --- Delete category ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}/delete`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");

      toast({ title: "🗑️ Category deleted" });
      fetchCategories();
    } catch (err: any) {
      toast({ title: "Error ❌", description: err.message });
    }
  };

  // --- Edit category (fill form) ---
  const handleEdit = (cat: Category) => {
    setFormData(cat);
    setIsEditing(true);
  };

  // --- Reset form ---
  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      description: "",
      icon: "Award",
      gradient: "from-blue-500 via-cyan-500 to-teal-600",
    });
  };

  // --- UI STATES ---
  if (loading)
    return <p className="text-center py-20 text-gray-600">Loading categories...</p>;
  if (error)
    return <p className="text-center py-20 text-red-600">{error}</p>;

  // --- RENDER ---
  return (
    <section className="py-10 px-6 md:px-16">
      <motion.h2
        className="text-3xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧠 Manage Test Categories (Admin)
      </motion.h2>

      {/* --- Form --- */}
      <Card className="mb-10 max-w-3xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                required
              />
            </div>

            <div>
              <Label>Icon</Label>
              <Input
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="Award, FileText, Briefcase..."
                list="iconList"
              />
              <datalist id="iconList">
                {Object.keys(Icons).map((key) => (
                  <option key={key} value={key} />
                ))}
              </datalist>
            </div>

            <div>
              <Label>Gradient (Tailwind)</Label>
              <Input
                name="gradient"
                value={formData.gradient}
                onChange={handleChange}
                placeholder="from-blue-500 via-cyan-500 to-teal-600"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                {isEditing ? (
                  <>
                    Update Category <Edit className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Add Category <PlusCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* --- List of Categories --- */}
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComp = Icons[cat.icon || "Award"] || Award;
          return (
            <Card
              key={cat.id}
              className="group relative hover:shadow-lg border border-gray-200 rounded-2xl"
            >
              <CardContent className="p-6 space-y-3">
                <div
                  className={`p-3 inline-block bg-gradient-to-br ${
                    cat.gradient || "from-blue-500 via-cyan-500 to-teal-600"
                  } rounded-xl`}
                >
                  <IconComp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{cat.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {cat.description}
                </p>

                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cat)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
