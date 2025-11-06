"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

interface AnalyticsStat {
  title: string;
  value: string;
  icon: string;
  gradient: string;
}

interface AnalyticsSectionProps {
  data?: AnalyticsStat[];
}

export default function AnalyticsSection({ data }: AnalyticsSectionProps) {
  const [stats, setStats] = useState<AnalyticsStat[]>(data || []);
  const [loading, setLoading] = useState(!data);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (data) return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/home/analytics/`);
        const json = await res.json();
        if (json.success && json.stats) setStats(json.stats);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [data]);

  if (loading)
    return (
      <section className="py-20 text-center text-muted-foreground">
        Loading analytics stats...
      </section>
    );

  if (!stats?.length)
    return (
      <section className="py-20 text-center text-muted-foreground">
        No analytics stats available.
      </section>
    );

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background opacity-80" />

      {/* Soft ambient gradient blobs for depth */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Success You Can Measure
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real Results. Real Students. Real Impact.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {stats.map((stat, i) => {
            const IconComponent =
              (LucideIcons as any)[stat.icon] || LucideIcons.BarChart2;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group relative h-full overflow-hidden rounded-3xl border border-primary/10 backdrop-blur-md bg-gradient-to-b from-white/80 to-white/60 dark:from-slate-900/60 dark:to-slate-800/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-10 text-center">
                    {/* Gradient Icon */}
                    <div
                      className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Stat Value */}
                    <h3 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-3">
                      {stat.value}
                    </h3>

                    {/* Stat Title */}
                    <p className="text-base font-medium text-muted-foreground leading-relaxed">
                      {stat.title}
                    </p>

                    {/* Animated underline accent */}
                    <motion.div
                      className="absolute inset-x-10 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={false}
                    />
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

// export default function Analytics({ data }: any) {
//   if (!data?.length) return null;

//   return (
//     <section className="grid md:grid-cols-3 gap-6 px-8">
//       {data.map((stat: any, i: number) => (
//         <motion.div
//           key={i}
//           whileHover={{ scale: 1.05 }}
//           className={`rounded-2xl p-6 text-white shadow-lg ${stat.gradient || "bg-gradient-to-r from-blue-500 to-purple-600"}`}
//         >
//           <h3 className="text-3xl font-bold">{stat.value}</h3>
//           <p className="mt-2 text-lg">{stat.title}</p>
//         </motion.div>
//       ))}
//     </section>
//   );
// }
