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
  read_time: string;
  image: string;
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
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api/blogs/";

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
  // Handle form input change
  // -------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
          setMessage("Blog updated successfully ✅");
          setEditingId(null);
        }
      } else {
        // CREATE
        const res = await axios.post(`${API_BASE}create/`, formData);
        if (res.data.success) {
          setMessage("Blog created successfully ✅");
        }
      }
      setFormData({
        title: "",
        excerpt: "",
        category: "",
        author: "",
        date: "",
        readTime: "",
        image: "",
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
  // Edit Blog (prefill form)
  // -------------------------
  const handleEdit = (blog: Blog) => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author,
      date: blog.date,
      readTime: blog.read_time,
      image: blog.image,
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
        setMessage("Blog deleted successfully 🗑️");
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
      image: "",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">📝 Admin Blog Management</h1>

      {/* Status Message */}
      {message && <p className="text-center text-green-600 mb-4">{message}</p>}

      {/* Form Section */}
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
            <Input
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
            />

            <div className="flex justify-center gap-3 pt-4">
              <Button type="submit" disabled={loading}>
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
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-2">{blog.excerpt}</p>
                <p className="text-sm text-gray-500">
                  {blog.category} • {blog.read_time} • By {blog.author}
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
