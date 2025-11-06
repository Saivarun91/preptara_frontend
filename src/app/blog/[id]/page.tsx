"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  read_time: string;
  image_url: string;
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const API_BASE = `${API_BASE_URL}/api/blogs/`;

  // -------------------------
  // Fetch blog details
  // -------------------------
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_BASE}${id}/`);
        console.log("blog res : ",res.data)
        if (res.data.success) {
          setBlog(res.data.blog);
        }

      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading blog...
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <p className="text-xl mb-4">❌ Blog not found.</p>
        <Button onClick={() => router.push("/blog")}>Back to Blogs</Button>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/blog")}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Button>

          {/* Blog Header */}
          <Card className="overflow-hidden border-primary/10 mb-8">
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-80 object-cover"
            />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                  {blog.category}
                </Badge>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{blog.read_time}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {blog.excerpt}
              </p>
            </CardContent>
          </Card>

          {/* Blog Body (Expandable later if you add full content) */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              {blog.excerpt}
              
            </p>
           
          </div>

          {/* Back to Blog List */}
          <div className="flex justify-center mt-10">
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
              onClick={() => router.push("/blog")}
            >
              ← Back to All Blogs
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
