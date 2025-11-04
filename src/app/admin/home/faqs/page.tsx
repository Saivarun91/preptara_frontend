"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export default function AdminFAQPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const API_URL = `${API_BASE}/home/faqs/`;

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  // ✅ Fetch all FAQs
  const fetchFAQs = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success && res.data.faqs) {
        setFaqs(res.data.faqs);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      toast({
        title: "Error",
        description: "Unable to load FAQs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  // ✅ Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create or Update FAQ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Both question and answer are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        // UPDATE
        const res = await axios.put(
          `${API_URL}update/${editingId}/`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        if (res.data.success) {
          toast({ title: "Updated", description: "FAQ updated successfully." });
          setEditingId(null);
        }
      } else {
        // CREATE
        const res = await axios.post(`${API_URL}create/`, formData, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.data.success) {
          toast({ title: "Created", description: "FAQ added successfully." });
        }
      }

      setFormData({ question: "", answer: "" });
      fetchFAQs();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving.",
        variant: "destructive",
      });
    }
  };

  // ✅ Edit FAQ
  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setFormData({ question: faq.question, answer: faq.answer });
  };

  // ✅ Delete FAQ
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const res = await axios.delete(`${API_URL}delete/${id}/`);
      if (res.data.success) {
        toast({ title: "Deleted", description: "FAQ deleted successfully." });
        fetchFAQs();
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ.",
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
          FAQ Management
        </h2>
        <p className="text-muted-foreground text-lg">
          Add, edit, or delete frequently asked questions.
        </p>
      </motion.div>

      {/* ✅ FAQ Form */}
      <Card className="max-w-3xl mx-auto mb-10 shadow-md border border-primary/10">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit FAQ" : "Create New FAQ"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="question"
              placeholder="Enter question"
              value={formData.question}
              onChange={handleChange}
              required
            />
            <Textarea
              name="answer"
              placeholder="Enter answer"
              value={formData.answer}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end gap-3">
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ question: "", answer: "" });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {editingId ? "Update FAQ" : "Create FAQ"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ✅ List of FAQs */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading FAQs...</p>
        ) : faqs.length > 0 ? (
          faqs.map((faq) => (
            <Card
              key={faq.id}
              className="border border-primary/10 hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground mb-4">{faq.answer}</p>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => handleEdit(faq)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(faq.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No FAQs found. Add some using the form above.
          </p>
        )}
      </div>
    </section>
  );
}




// "use client";

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export default function FAQs({ data }: any) {
//   const [open, setOpen] = useState<number | null>(null);
//   if (!data?.length) return null;

//   return (
//     <section className="px-8 py-16 bg-gray-100">
//       <h2 className="text-center text-3xl font-bold mb-10">Frequently Asked Questions</h2>
//       <div className="max-w-3xl mx-auto">
//         {data.map((faq: any, i: number) => (
//           <div key={i} className="bg-white p-5 mb-3 rounded-xl shadow cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">{faq.question}</h3>
//               <ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
//             </div>
//             {open === i && <p className="mt-3 text-gray-600">{faq.answer}</p>}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
