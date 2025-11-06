

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: number;
  image_url?: string | null;
}

export default function AdminTestimonialsPage() {
  const { toast } = useToast();

  // ✅ Cloudinary config
  const CLOUD_NAME = "dhy0krkef"; // <-- replace with your cloud name
  const UPLOAD_PRESET = "preptara"; // <-- replace with your unsigned preset name

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const GET_URL = `${API_BASE}/home/testimonials/`;
  const CREATE_URL = `${API_BASE}/home/testimonials/create/`;
  const DELETE_URL = `${API_BASE}/home/testimonials/delete/`;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    rating: 5,
    image: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ✅ Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(GET_URL);
      if (res.data.success && res.data.testimonials) {
        setTestimonials(res.data.testimonials);
      } else {
        setTestimonials(res.data || []);
      }
    } catch (err) {
      console.error("Error loading testimonials:", err);
      toast({
        title: "Error",
        description: "Failed to load testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "rating" ? Math.min(5, Math.max(1, Number(value))) : value,
    }));
  };

  // ✅ Handle image preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  // ✅ Upload image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });

    const uploaded = await res.json();
    if (!uploaded.secure_url) {
      throw new Error("Failed to upload image to Cloudinary.");
    }

    return uploaded.secure_url;
  };

  // ✅ Handle submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.text) {
      toast({
        title: "Validation Error",
        description: "Name and feedback are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = previewImage;

      // Upload image to Cloudinary if new image is selected
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      if (editingId) {
        await axios.delete(`${DELETE_URL}${editingId}/`);
      }

      // ✅ Send Cloudinary URL to Django
      await axios.post(CREATE_URL, {
        name: formData.name,
        role: formData.role,
        text: formData.text,
        rating: formData.rating,
        image_url: imageUrl,
      });

      toast({
        title: editingId ? "Updated" : "Created",
        description: `Testimonial ${editingId ? "updated" : "added"} successfully.`,
      });

      setEditingId(null);
      setFormData({ name: "", role: "", text: "", rating: 5, image: null });
      setPreviewImage(null);
      fetchTestimonials();
    } catch (err) {
      console.error("Error saving testimonial:", err);
      toast({
        title: "Error",
        description: "Failed to save testimonial.",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle edit
  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      role: t.role || "",
      text: t.text,
      rating: t.rating,
      image: null,
    });
    setPreviewImage(t.image_url || null);
  };

  // ✅ Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await axios.delete(`${DELETE_URL}${id}/`);
      toast({
        title: "Deleted",
        description: "Testimonial deleted successfully.",
      });
      fetchTestimonials();
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      toast({
        title: "Error",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      {/* ✅ Form Section */}
      <Card className="max-w-3xl mx-auto shadow-md mb-12">
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div>
              <Label>Role (optional)</Label>
              <Input name="role" value={formData.role} onChange={handleChange} />
            </div>

            <div>
              <Label>Feedback</Label>
              <Textarea name="text" value={formData.text} onChange={handleChange} required />
            </div>

            <div>
              <Label>Rating (1–5)</Label>
              <Input
                name="rating"
                type="number"
                min={1}
                max={5}
                value={formData.rating}
                onChange={handleChange}
              />
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Profile Image</Label>
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="rounded-full border object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: "", role: "", text: "", rating: 5, image: null });
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">{editingId ? "Update" : "Create"} Testimonial</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ✅ Testimonials List */}
      <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500">Loading testimonials...</p>
        ) : testimonials.length > 0 ? (
          testimonials.map((t) => (
            <Card
              key={t.id}
              className="border border-primary/10 hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {t.image_url && (
                    <Image
                      src={t.image_url}
                      alt={t.name}
                      width={70}
                      height={70}
                      className="rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{t.name}</h3>
                    {t.role && <p className="text-sm text-muted-foreground">{t.role}</p>}
                    <div className="flex gap-1">
                      {[...Array(Math.round(t.rating))].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{t.text}</p>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => handleEdit(t)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(t.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No testimonials yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
