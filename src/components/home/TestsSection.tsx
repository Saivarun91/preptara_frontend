"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Award,
  FileText,
  Briefcase,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const Icons: Record<string, any> = {
  Award,
  FileText,
  Briefcase,
  GraduationCap,
  BookOpen,
};

interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  gradient?: string;
}

export default function TestsSection({
  searchQuery,
  onResetSearch,
}: {
  searchQuery: string;
  onResetSearch: () => void;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const BASE_URL = `${API_BASE_URL}/api/categories/`;

  const fetchCategories = async () => {
    try {
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error(`Failed to fetch categories (${res.status})`);
      const data = await res.json();
      const formatted = data.map((cat: any) => ({
        id: cat._id?.$oid || cat.id || cat._id || "",
        name: cat.name,
        description: cat.description,
        icon: cat.icon || "Award",
        gradient: cat.gradient || "from-blue-500 via-cyan-500 to-teal-600",
      }));
      setCategories(formatted);
    } catch (err: any) {
      setError(err.message || "Something went wrong fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading)
    return <p className="text-center py-20 text-gray-600">Loading categories...</p>;
  if (error)
    return <p className="text-center py-20 text-red-600">{error}</p>;
  if (!categories.length)
    return <p className="text-center py-20 text-gray-500">No categories available</p>;

  // ✅ Filter categories if searchQuery exists
  const filteredCategories = searchQuery
    ? categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {searchQuery ? `Search results for "${searchQuery}"` : "Explore Test Categories"}
        </motion.h2>

        {/* ✅ Back to All Courses button when filtered */}
        {searchQuery && (
          <div className="text-center mb-8">
            <Button variant="outline" onClick={onResetSearch}>
              Back to All Courses
            </Button>
          </div>
        )}

        <Carousel opts={{ align: "start" }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredCategories.map((category) => {
              const IconComponent = Icons[category.icon || "Award"] || Award;

              return (
                <CarouselItem
                  key={category.id}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="group hover:shadow-xl transition-all rounded-2xl border border-gray-200 h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`p-3 bg-gradient-to-br ${category.gradient} rounded-xl`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {category.description}
                      </p>

                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/practice-tests/category/${category.id}`)
                          }
                        >
                          View Tests
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {!searchQuery && (
          <div className="text-center mt-12">
            <Link href="/practice-tests">
              <Button size="lg" variant="outline">
                View All Categories
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
