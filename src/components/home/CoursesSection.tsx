"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Star,
  Award,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const courses = [
  {
    id: 1,
    title: "UPSC Civil Services",
    icon: Award,
    description: "Complete preparation for IAS, IPS, IFS",
    students: 5420,
    tests: 200,
    price: 14999,
    category: "UPSC",
    rating: 4.8,
    gradient: "from-amber-500 via-orange-500 to-red-600",
  },
  {
    id: 2,
    title: "SSC CGL/CHSL",
    icon: FileText,
    description: "Staff Selection Commission exams",
    students: 8200,
    tests: 180,
    price: 7999,
    category: "SSC",
    rating: 4.7,
    gradient: "from-blue-500 via-cyan-500 to-teal-600",
  },
  {
    id: 3,
    title: "Banking & Finance",
    icon: Briefcase,
    description: "IBPS, SBI PO, Clerk preparation",
    students: 6800,
    tests: 150,
    price: 6999,
    category: "Banking",
    rating: 4.6,
    gradient: "from-green-500 via-emerald-500 to-teal-600",
  },
  {
    id: 4,
    title: "NEET Medical",
    icon: GraduationCap,
    description: "Medical entrance exam preparation",
    students: 9500,
    tests: 220,
    price: 12999,
    category: "NEET",
    rating: 4.9,
    gradient: "from-pink-500 via-rose-500 to-red-600",
  },
  {
    id: 5,
    title: "JEE Main & Advanced",
    icon: BookOpen,
    description: "Engineering entrance preparation",
    students: 11000,
    tests: 240,
    price: 11999,
    category: "JEE",
    rating: 4.8,
    gradient: "from-purple-500 via-violet-500 to-indigo-600",
  },
  {
    id: 6,
    title: "CAT MBA",
    icon: Briefcase,
    description: "Management entrance preparation",
    students: 4200,
    tests: 120,
    price: 9999,
    category: "CAT",
    rating: 4.7,
    gradient: "from-indigo-500 via-blue-500 to-cyan-600",
  },
];

const categories = ["All", "UPSC", "SSC", "Banking", "NEET", "JEE", "CAT"];

export const CoursesSection = () => {
  const router = useRouter(); // ✅ Next.js hook instead of react-router-dom
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCourses =
    activeCategory === "All"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Courses
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive exam preparation courses designed by experts
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
              className={
                activeCategory === category
                  ? "bg-gradient-primary hover:shadow-glow"
                  : "border-primary/20 hover:border-primary hover:bg-primary/10"
              }
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Courses Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {filteredCourses.map((course, index) => (
              <CarouselItem
                key={course.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 border-primary/10 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 bg-gradient-to-br ${course.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <course.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-highlight text-highlight-foreground"
                        >
                          {course.category}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{course.tests} tests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-highlight text-highlight" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ₹{course.price.toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-primary hover:shadow-glow"
                          onClick={() => router.push(`/course/${course.id}`)} // ✅ Fixed navigation
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/courses">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              View All Courses
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
