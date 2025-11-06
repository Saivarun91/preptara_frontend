"use client";

import { useState, useEffect } from "react";

export default function HeroUploader() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const[heroId, setHeroId] = useState<string | null>(null);
  console.log("imageUrl : ",imageUrl)
  console.log("heroId : ",heroId)

  console.log("title : ",title)
  console.log("subtitle : ",subtitle)
  console.log("searchPlaceholder : ",searchPlaceholder)


  const CLOUD_NAME = "dhy0krkef";
  const UPLOAD_PRESET = "preptara";

  // 1️⃣ Fetch existing hero data
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${API_BASE_URL}/api/home/hero/`);
        const data = await res.json();
        console.log("data : ",data)
        if (data.success) {
          setHeroId(data.data.id);
          setTitle(data.data.title || "");
          setSubtitle(data.data.subtitle || "");
          setSearchPlaceholder(data.data.search_placeholder || "");
          setImageUrl(data.data.background_image_url || "");
        }
      } catch (err) {
        console.error("Failed to fetch hero data:", err);
        setMessage("❌ Failed to load existing hero section.");
      }
    };
    fetchHeroData();
  }, []);

  // 2️⃣ Upload image to Cloudinary
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.secure_url);
      setMessage("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Upload failed", err);
      setMessage("❌ Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Submit form (create or update)
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      setMessage("⚠️ Title and Image are required!");
      return;
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const url = heroId
        ? `${API_BASE_URL}/api/home/hero/update/${heroId}/`
        : `${API_BASE_URL}/api/home/hero/add/`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subtitle,
          search_placeholder: searchPlaceholder,
          background_image_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(heroId ? "🎉 Hero section updated!" : "🎉 Hero section created!");
      } else {
        setMessage(data.message || "❌ Failed to save hero section.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to backend!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
        {heroId ? "Edit Hero Section" : "Create Hero Section"}
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Upload your hero image and customize homepage content.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            placeholder="Enter hero title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Subtitle (optional)</label>
          <input
            type="text"
            placeholder="Enter subtitle"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>

        {/* Search Placeholder */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Search Placeholder
          </label>
          <input
            type="text"
            placeholder="e.g., Search courses..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={searchPlaceholder}
            onChange={(e) => setSearchPlaceholder(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Upload Hero Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        {loading && <p className="text-indigo-500 text-sm">Uploading image...</p>}
        {imageUrl && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-52 object-cover rounded-lg shadow-sm border border-gray-200"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all disabled:opacity-60"
        >
          {loading ? "Please wait..." : heroId ? "Update Hero Section" : "Save Hero Section"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p
          className={`text-center mt-6 font-medium ${
            message.includes("✅") || message.includes("🎉")
              ? "text-green-600"
              : message.includes("⚠️")
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
