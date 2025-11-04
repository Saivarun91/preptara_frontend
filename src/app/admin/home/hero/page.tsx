"use client";

import { useState } from "react";

export default function HeroUploader() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const CLOUD_NAME = "dhy0krkef"; // your Cloudinary cloud name
  const UPLOAD_PRESET = "preptara"; // your unsigned preset

  // Handle image upload to Cloudinary
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

  // Send hero data to Django backend
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      setMessage("⚠️ Title and Image are required!");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/home/hero/add/", {
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
        setMessage("🎉 Hero section created successfully!");
        setTitle("");
        setSubtitle("");
        setSearchPlaceholder("");
        setImageUrl("");
      } else {
        setMessage(data.message || "❌ Failed to create hero section.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error connecting to backend!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
        Create Hero Section
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
          {loading ? "Please wait..." : "Save Hero Section"}
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
