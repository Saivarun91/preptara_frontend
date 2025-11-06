"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// Import possible icons dynamically
import {
  Brain,
  BarChart3,
  Users,
  Clock,
  Shield,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";

// Type definitions for better TypeScript support
interface Feature {
  title: string;
  description: string;
  icon: string; // icon name from backend e.g. "BarChart3"
  gradient: string; // e.g. "from-blue-500 via-cyan-500 to-teal-600"
}

// Map string icon names from backend to Lucide components
const iconMap: Record<string, any> = {
  Brain,
  BarChart3,
  Users,
  Clock,
  Shield,
  Zap,
  Target,
  BookOpen,
};

export default function FeaturesSection() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const API_URL = `${API_BASE_URL}/api/home/features/`;

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success && res.data.features) {
          setFeatures(res.data.features);
        }
      } catch (err) {
        console.error("Error loading features:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading features...</div>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              PrepTara
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in competitive exams — all in one
            place.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Brain; // fallback icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full group hover:shadow-card transition-all duration-300 hover:-translate-y-2 border-primary/10">
                  <CardContent className="p-6">
                    <div
                      className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl shadow-lg w-fit mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// "use client";

// import { motion } from "framer-motion";
// import { LucideIcon, icons } from "lucide-react";

// export default function Features({ data }: any) {
//   if (!data?.length) return null;

//   return (
//     <section className="px-8 py-16 bg-gray-50">
//       <h2 className="text-center text-3xl font-bold mb-12">Our Features</h2>
//       <div className="grid md:grid-cols-3 gap-8">
//         {data.map((feature: any, i: number) => {
//           const Icon: LucideIcon = icons[feature.icon as keyof typeof icons] || icons.Star;
//           return (
//             <motion.div
//               key={i}
//               whileHover={{ y: -5 }}
//               className={`p-6 rounded-2xl shadow-lg text-center ${feature.gradient || "bg-white"}`}
//             >
//               <Icon className="mx-auto mb-4 text-4xl" />
//               <h3 className="text-xl font-semibold">{feature.title}</h3>
//               <p className="text-gray-600 mt-2">{feature.description}</p>
//             </motion.div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }
