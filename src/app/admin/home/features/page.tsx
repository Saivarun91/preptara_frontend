"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  is_active?: boolean;
}

export default function AdminFeaturesPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const API_URL = `${API_BASE}/home/features/`;

  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    gradient: "",
  });

  const iconOptions = [
    "Star",
    "Brain",
    "BarChart3",
    "BookOpen",
    "Rocket",
    "Lightbulb",
    "Target",
    "ShieldCheck",
    "Trophy",
    "Clock",
    "ChartLine",
    "TrendingUp",
    "Award",
    "Globe",
    "Zap",
  ];

  const fetchFeatures = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success && res.data.features) {
        setFeatures(res.data.features);
      } else {
        toast({
          title: "Error",
          description: "Unable to load features.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      toast({
        title: "Error",
        description: "Unable to load features.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        const res = await axios.put(`${API_URL}update/${editingId}/`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.success) {
          toast({
            title: "Updated",
            description: "Feature updated successfully.",
          });
          setEditingId(null);
        } else {
          toast({
            title: "Error",
            description: res.data.message || "Update failed",
            variant: "destructive",
          });
        }
      } else {
        const res = await axios.post(`${API_URL}add/`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.success) {
          toast({
            title: "Created",
            description: "Feature added successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: res.data.message || "Create failed",
            variant: "destructive",
          });
        }
      }

      setFormData({ title: "", description: "", icon: "", gradient: "" });
      fetchFeatures();
    } catch (error) {
      console.error("Error saving feature:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (feature: Feature) => {
    setEditingId(feature.id);
    setFormData({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      gradient: feature.gradient,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;

    try {
      const res = await axios.delete(`${API_URL}delete/${id}/`);
      if (res.data && res.data.success) {
        toast({
          title: "Deleted",
          description: "Feature deleted successfully.",
        });
        fetchFeatures();
      } else {
        toast({
          title: "Error",
          description: res.data?.message || "Failed to delete feature.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error deleting feature:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete feature.";
      toast({
        title: "Error deleting feature",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 container mx-auto px-4">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
          Feature Management
        </h2>
        <p className="text-muted-foreground text-lg">
          Add, edit, or delete homepage feature cards dynamically.
        </p>
      </motion.div>

      <Card className="max-w-3xl mx-auto mb-10 shadow-md border border-primary/10">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Feature" : "Create New Feature"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Enter feature title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Enter feature description"
              value={formData.description}
              onChange={handleChange}
              required
            />

            {/* ✅ Dropdown for Icon Selection */}
            <select
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full border rounded-md p-2 text-gray-700 focus:ring focus:ring-primary/30"
            >
              <option value="">Select an icon</option>
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>

            <Input
              name="gradient"
              placeholder="Gradient (e.g. from-blue-500 to-indigo-500)"
              value={formData.gradient}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-3">
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      icon: "",
                      gradient: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {editingId ? "Update Feature" : "Create Feature"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading features...</p>
        ) : features.length > 0 ? (
          features.map((feature) => (
            <Card
              key={feature.id}
              className="border border-primary/10 hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {feature.description}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Icon:</strong> {feature.icon || "—"}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Gradient:</strong> {feature.gradient || "—"}
                </p>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => handleEdit(feature)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(feature.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No features found. Add one using the form above.
          </p>
        )}
      </div>
    </section>
  );
}
