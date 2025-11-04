"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Loader2, Trash2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

interface CTA {
  _id?: string;
  heading: string;
  subheading?: string;
  button_text_primary?: string;
  button_link_primary?: string;
  button_text_secondary?: string;
  button_link_secondary?: string;
  footer_note?: string;
  background_image?: string | null;
}

export default function CTAAdminPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const [cta, setCTA] = useState<CTA>({
    heading: "",
    subheading: "",
    button_text_primary: "",
    button_link_primary: "",
    button_text_secondary: "",
    button_link_secondary: "",
    footer_note: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ✅ Fetch existing CTA
  const fetchCTA = async () => {
    try {
      const res = await axios.get(`${API_URL}/home/cta/`);
      if (res.data.success && res.data.data) {
        setCTA(res.data.data);
        setPreview(res.data.data.background_image || null);
        setEditingId(res.data.data._id || null);
      } else {
        console.log("No active CTA found");
      }
    } catch (err) {
      console.log("No CTA found yet");
    }
  };

  useEffect(() => {
    fetchCTA();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCTA({ ...cta, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Select
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Create or Update CTA
  const handleSave = async () => {
    if (!cta.heading) return toast.error("Heading is required");

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(cta).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (image) formData.append("background_image", image);

      if (editingId) {
        // UPDATE
        const res = await axios.post(
          `${API_URL}/home/api/cta/update/${editingId}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data.success) toast.success("CTA updated successfully!");
      } else {
        // CREATE
        const res = await axios.post(`${API_URL}/home/cta/add/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.success) toast.success("CTA created successfully!");
      }

      fetchCTA();
    } catch (err) {
      console.error("Error saving CTA:", err);
      toast.error("Failed to save CTA section");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete CTA
  const handleDelete = async () => {
    if (!editingId) return toast.error("No CTA to delete");

    if (!confirm("Are you sure you want to delete this CTA section?")) return;

    try {
      const res = await axios.delete(
        `${API_URL}/home/api/cta/delete/${editingId}/`
      );
      if (res.data.success) {
        toast.success("CTA deleted successfully!");
        setCTA({
          heading: "",
          subheading: "",
          button_text_primary: "",
          button_link_primary: "",
          button_text_secondary: "",
          button_link_secondary: "",
          footer_note: "",
        });
        setPreview(null);
        setEditingId(null);
      } else {
        toast.error(res.data.message || "Failed to delete CTA");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete CTA");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <PlusCircle className="text-blue-600" /> Manage CTA Section
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {/* Heading */}
        <div>
          <label className="font-semibold">Heading *</label>
          <Input
            name="heading"
            value={cta.heading}
            onChange={handleChange}
            placeholder="Enter CTA heading"
          />
        </div>

        {/* Subheading */}
        <div>
          <label className="font-semibold">Subheading</label>
          <Input
            name="subheading"
            value={cta.subheading || ""}
            onChange={handleChange}
            placeholder="Enter subheading"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Primary Button Text</label>
            <Input
              name="button_text_primary"
              value={cta.button_text_primary || ""}
              onChange={handleChange}
              placeholder="Start Learning"
            />
          </div>
          <div>
            <label className="font-semibold">Primary Button Link</label>
            <Input
              name="button_link_primary"
              value={cta.button_link_primary || ""}
              onChange={handleChange}
              placeholder="/courses"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Secondary Button Text</label>
            <Input
              name="button_text_secondary"
              value={cta.button_text_secondary || ""}
              onChange={handleChange}
              placeholder="Learn More"
            />
          </div>
          <div>
            <label className="font-semibold">Secondary Button Link</label>
            <Input
              name="button_link_secondary"
              value={cta.button_link_secondary || ""}
              onChange={handleChange}
              placeholder="/about"
            />
          </div>
        </div>

        {/* Footer Note */}
        <div>
          <label className="font-semibold">Footer Note</label>
          <Textarea
            name="footer_note"
            value={cta.footer_note || ""}
            onChange={handleChange}
            placeholder="Enter footer note or message"
            rows={3}
          />
        </div>

        {/* Background Image */}
        <div>
          <label className="font-semibold">Background Image</label>
          <div className="flex items-center gap-4 mt-2">
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {preview && (
              <div className="relative w-32 h-20">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {editingId ? "Update CTA" : "Create CTA"}
          </Button>

          {editingId && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
