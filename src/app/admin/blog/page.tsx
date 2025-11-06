
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image_url?: string; // optional for safety
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    author: "",
    date: "",
    readTime: "",
    image_url: "", // ✅ same name as backend
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const API_BASE = `${API_BASE_URL}/api/blogs/`;

  // ✅ Cloudinary Details
  const CLOUD_NAME = "dhy0krkef";
  const UPLOAD_PRESET = "preptara";

  // -------------------------
  // Fetch all blogs
  // -------------------------
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(API_BASE);
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // -------------------------
  // Handle input change
  // -------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------------
  // Handle image upload to Cloudinary
  // -------------------------
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("Uploading image...");

    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: imageData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, image_url: data.secure_url }));
        setMessage("✅ Image uploaded successfully!");
      } else {
        setMessage("❌ Image upload failed!");
      }
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      setMessage("❌ Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // -------------------------
  // Create or Update Blog
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        // UPDATE
        const res = await axios.put(`${API_BASE}${editingId}/update/`, formData);
        if (res.data.success) {
          setMessage("✅ Blog updated successfully!");
          setEditingId(null);
        }
      } else {
        // CREATE
        const res = await axios.post(`${API_BASE}create/`, formData);
        if (res.data.success) {
          setMessage("✅ Blog created successfully!");
        }
      }

      setFormData({
        title: "",
        excerpt: "",
        category: "",
        author: "",
        date: "",
        readTime: "",
        image_url: "",
      });
      fetchBlogs();
    } catch (err) {
      console.error("Error submitting blog:", err);
      setMessage("❌ Error submitting blog");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Edit Blog
  // -------------------------
  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime,
      image_url: blog.image_url || "",
    });
    setEditingId(blog.id);
  };

  // -------------------------
  // Delete Blog
  // -------------------------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await axios.delete(`${API_BASE}${id}/delete/`);
      if (res.data.success) {
        setMessage("🗑️ Blog deleted successfully!");
        fetchBlogs();
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
    }
  };

  // -------------------------
  // Reset Form
  // -------------------------
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      excerpt: "",
      category: "",
      author: "",
      date: "",
      readTime: "",
      image_url: "",
    });
  };

  // -------------------------
  // JSX UI
  // -------------------------
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">📝 Admin Blog Management</h1>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {/* Blog Form */}
      <Card className="max-w-2xl mx-auto mb-10 shadow-md">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="excerpt"
              placeholder="Excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
            />
            <Input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
            <Input
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              required
            />
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <Input
              name="readTime"
              placeholder="Read Time (e.g., 5 min)"
              value={formData.readTime}
              onChange={handleChange}
            />

            {/* ✅ Cloudinary Upload */}
            <div>
              <label className="block mb-1 font-medium">Upload Blog Image</label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Uploaded preview"
                  className="mt-2 w-full h-40 object-cover rounded-md"
                />
              )}
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button type="submit" disabled={loading || uploading}>
                {loading ? "Saving..." : editingId ? "Update Blog" : "Create Blog"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Blog List */}
      <h2 className="text-2xl font-semibold mb-4 text-center">📚 All Blogs</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {blogs.length === 0 ? (
          <p className="text-center text-gray-500 w-full">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="shadow-md">
              <CardContent className="p-4">
                {/* ✅ Safe image rendering */}
                {blog.image_url ? (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md mb-3 text-gray-500">
                    No Image Available
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-2">{blog.excerpt}</p>
                <p className="text-sm text-gray-500">
                  {blog.category} • {blog.readTime} • By {blog.author}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="default" onClick={() => handleEdit(blog)}>
                    ✏️ Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(blog.id)}>
                    🗑️ Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
