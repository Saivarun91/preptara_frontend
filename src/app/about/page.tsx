"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Lightbulb,
  Quote,
  BookOpen,
  Clock,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import ourStoryImage from "@/assets/our-story.jpg";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Continuously improving our platform with cutting-edge technology",
  },
  {
    icon: Heart,
    title: "Student First",
    description: "Every decision we make puts student success at the center",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering the highest quality education",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive network of learners and educators",
  },
];

const stats = [
  { icon: UserCheck, number: "50,000+", label: "Active Students" },
  { icon: BookOpen, number: "1,000+", label: "Practice Tests" },
  { icon: CheckCircle, number: "98%", label: "Success Rate" },
  { icon: Clock, number: "24/7", label: "Support" },
];

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-blue-50">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="bg-gradient-primary bg-clip-text text-blue-500">PrepTara</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering learners. Inspiring success.
            </p>
          </motion.div>
        </div>
      </section>

     {/* Mission & Vision */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed text-center md:text-left">
                    To democratize quality education and make competitive exam preparation
                    accessible to every aspiring student across India. We believe that with
                    the right guidance and tools, every student can achieve their dreams.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-primary/20 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed text-center md:text-left">
                    To become India's most trusted and comprehensive platform for competitive
                    exam preparation, helping millions of students transform their aspirations
                    into achievements through technology and innovation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-blue-500">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Our <span className="bg-gradient-primary bg-clip-text text-blue-500">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-card transition-all duration-300 hover:-translate-y-2 border-primary/10">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">
                Our <span className="bg-gradient-primary bg-clip-text text-blue-500">Story</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden shadow-card"
              >
                <Image 
                  src={ourStoryImage} 
                  alt="Students learning together at PrepTara" 
                  className="w-full h-full object-cover rounded-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-primary/10" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="prose prose-lg max-w-none"
              >
                <p className="text-muted-foreground mb-4">
                  PrepTara was born from a simple observation: millions of talented students
                  across India struggle to access quality preparation resources for competitive
                  exams. In 2020, a group of educators and technologists came together with a
                  mission to change this.
                </p>
                <p className="text-muted-foreground mb-4">
                  We started with a vision to create a platform that combines the best of
                  technology and pedagogy. Today, PrepTara serves over 50,000 students across
                  India, offering comprehensive preparation for UPSC, SSC, Banking, NEET, JEE,
                  CAT, and many other competitive examinations.
                </p>
                <p className="text-muted-foreground">
                  Our journey has just begun, and we're committed to continuously evolving our
                  platform to meet the changing needs of students and the education landscape.
                </p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <Card className="relative overflow-hidden border-primary/20 shadow-elegant bg-white dark:bg-gray-900">
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Quote Icon */}
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                        <Quote className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Quote Text */}
                    <div className="flex-1 text-center md:text-left">
                      <blockquote className="text-2xl md:text-3xl font-semibold text-blue-600 mb-3">
                        "Empowering learners. Inspiring success."
                      </blockquote>
                      <p className="text-blue-400 font-medium">— PrepTara Team</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
