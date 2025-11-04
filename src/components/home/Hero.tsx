"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroData {
  id: string;
  title: string;
  subtitle?: string;
  search_placeholder?: string;
  background_image_url?: string | null;
}

export default function Hero({ onSearch }: { onSearch: (query: string) => void }) {
  const [data, setData] = useState<HeroData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/home/hero/");
        if (!res.ok) throw new Error("Failed to fetch hero data");
        const heroData = await res.json();
        setData(heroData.data);
      } catch (error) {
        console.error("Error loading hero data:", error);
      }
    };
    fetchHero();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  if (!data) {
    return (
      <section className="flex items-center justify-center min-h-[70vh] text-gray-500">
        Loading...
      </section>
    );
  }

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {data.background_image_url && (
        <div className="absolute inset-0 z-0">
          <img
            src={data.background_image_url}
            alt="Hero background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10 text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-lg md:text-xl text-gray-200 mb-8">{data.subtitle}</p>
          )}

          {/* ✅ Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="flex flex-col sm:flex-row gap-2 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-2xl border border-gray-200">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-primary/90 p-1.5 rounded-lg">
                    <Search className="h-3.5 w-3.5 text-white" />
                  </div>
                  <Input
                    type="text"
                    placeholder={data.search_placeholder || "Search for a course..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2 h-10 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 h-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Search
                </Button>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
