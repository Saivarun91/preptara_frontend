// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Star, Quote } from "lucide-react";

// interface Testimonial {
//   id: string;
//   name: string;
//   role?: string;
//   text: string;
//   rating: number;
//   image?: string | null;
// }

// export default function TestimonialsPage() {
//   const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
//   const [loading, setLoading] = useState(true);
//   const API_URL = "http://127.0.0.1:8000/api/home/testimonials/";

//   useEffect(() => {
//     async function fetchTestimonials() {
//       try {
//         const res = await axios.get(API_URL);
//         if (res.data.success && res.data.testimonials) {
//           setTestimonials(res.data.testimonials);
//         }
//       } catch (error) {
//         console.error("Error fetching testimonials:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTestimonials();
//   }, []);

//   if (loading)
//     return (
//       <div className="text-center py-20 text-gray-500">
//         Loading testimonials...
//       </div>
//     );

//   if (testimonials.length === 0)
//     return (
//       <div className="text-center py-20 text-gray-500">
//         No testimonials available yet.
//       </div>
//     );

//   return (
//     <main className="min-h-screen pt-20 bg-gradient-to-b from-sky-50 via-white to-sky-100">
//       {/* Hero Section */}
//       <section className="relative py-20 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="container mx-auto px-6"
//         >
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">
//             Inspiring{" "}
//             <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
//               Success Stories
//             </span>
//           </h1>
//           <p className="text-lg text-slate-600 max-w-2xl mx-auto">
//             Hear how thousands of learners achieved their goals with{" "}
//             <span className="font-semibold text-blue-600">PrepTara</span>.
//           </p>
//         </motion.div>
//       </section>

//       {/* Testimonials Grid */}
//       <section className="py-20 bg-gradient-to-t from-blue-50 to-transparent">
//         <div className="container mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//             {testimonials.map((t, index) => (
//               <motion.div
//                 key={t.id}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Card className="bg-white/70 backdrop-blur-xl border border-blue-100 hover:shadow-2xl transition-all rounded-2xl overflow-hidden">
//                   <CardContent className="p-6">
//                     <Quote className="h-8 w-8 text-blue-400/30 mb-3" />
//                     <p className="text-sm text-slate-700 italic mb-6 leading-relaxed">
//                       “{t.text}”
//                     </p>

//                     <div className="flex items-center gap-4">
//                       <Image
//                         src={t.image ? t.image : "/default-avatar.png"}
//                         alt={t.name}
//                         width={48}
//                         height={48}
//                         className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
//                       />
//                       <div>
//                         <h4 className="font-semibold text-slate-800">
//                           {t.name}
//                         </h4>
//                         {t.role && (
//                           <p className="text-xs text-slate-500">{t.role}</p>
//                         )}
//                         <div className="flex gap-1 mt-1">
//                           {[...Array(Math.round(t.rating))].map((_, i) => (
//                             <Star
//                               key={i}
//                               className="h-3 w-3 fill-yellow-400 text-yellow-400"
//                             />
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-24 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="container mx-auto px-6"
//         >
//           <h2 className="text-4xl font-bold mb-4">
//             Ready to Write Your Own Success Story?
//           </h2>
//           <p className="text-lg opacity-90 mb-8">
//             Start your journey towards excellence with{" "}
//             <span className="font-semibold">PrepTara</span>.
//           </p>
//           <a
//             href="/practice-tests"
//             className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
//           >
//             Start Practice Tests
//           </a>
//         </motion.div>
//       </section>
//     </main>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import Link from "next/link";


interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: number;
  image_url?: string | null; // updated to match backend field
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const API_URL = `${API_BASE_URL}/api/home/testimonials/`;

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success && res.data.testimonials) {
          setTestimonials(res.data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading testimonials...
      </div>
    );

  if (testimonials.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        No testimonials available yet.
      </div>
    );

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-b from-sky-50 via-white to-sky-100">
      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Inspiring{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hear how thousands of learners achieved their goals with{" "}
            <span className="font-semibold text-blue-600">PrepTara</span>.
          </p>
        </motion.div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-gradient-to-t from-blue-50 to-transparent">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/70 backdrop-blur-xl border border-blue-100 hover:shadow-2xl transition-all rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-blue-400/30 mb-3" />
                    <p className="text-sm text-slate-700 italic mb-6 leading-relaxed">
                      “{t.text}”
                    </p>

                    <div className="flex items-center gap-4">
                      {t.image_url ? (
                        <Image
                          src={t.image_url}
                          alt={t.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-300 border-2 border-blue-200" />
                      )}

                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {t.name}
                        </h4>
                        {t.role && (
                          <p className="text-xs text-slate-500">{t.role}</p>
                        )}
                        <div className="flex gap-1 mt-1">
                          {[...Array(Math.round(t.rating))].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3 w-3 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
<section className="py-24 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-blue-900 text-center">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="container mx-auto px-6"
  >
    <h2 className="text-4xl font-bold mb-4">
      Ready to Write Your Own Success Story?
    </h2>
    <p className="text-lg opacity-90 mb-8">
      Start your journey towards excellence with{" "}
      <span className="font-semibold">PrepTara</span>.
    </p>

    <Link
      href="/practice-tests"
      className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1"
    >
      Start Practice Tests
    </Link>
  </motion.div>
</section>

    </main>
  );
}
