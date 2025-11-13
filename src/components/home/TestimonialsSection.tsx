// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { Star, Quote } from "lucide-react";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { type CarouselApi } from "@/components/ui/carousel";

// // ✅ Define testimonial type based on your backend
// interface Testimonial {
//   id: string;
//   name: string;
//   role?: string;
//   text: string;
//   rating: number;
//   image?: string | null;
// }

// export default function TestimonialsSection() {
//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);
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
//       } catch (err) {
//         console.error("Error loading testimonials:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTestimonials();
//   }, []);

//   useEffect(() => {
//     if (!api) return;
//     setCurrent(api.selectedScrollSnap());
//     api.on("select", () => setCurrent(api.selectedScrollSnap()));
//   }, [api]);

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
//     <section className="py-24 relative overflow-hidden">
//       {/* Background gradients */}
//       <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

//       <div className="container mx-auto px-4 relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <motion.div
//             initial={{ scale: 0.9 }}
//             whileInView={{ scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="inline-block mb-4"
//           >
//             <span className="bg-blue-600 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
//               ⭐ Student Success Stories
//             </span>
//           </motion.div>

//           <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
//             Success{" "}
//             <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
//               That Speaks
//             </span>
//           </h2>
//           <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
//             Real achievements from students who chose to succeed with PrepTara
//           </p>
//         </motion.div>

//         {/* Carousel Section */}
//         <div className="max-w-6xl mx-auto">
//           <Carousel
//             setApi={setApi}
//             opts={{ align: "start", loop: true }}
//             className="w-full"
//           >
//             <CarouselContent>
//               {testimonials.map((testimonial, index) => (
//                 <CarouselItem key={testimonial.id}>
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     whileInView={{ opacity: 1, scale: 1 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <Card className="backdrop-blur-md bg-gradient-to-br from-card/90 to-primary/5 border-primary/30 shadow-2xl overflow-hidden">
//                       <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
//                       <CardContent className="p-6 md:p-8 min-h-[280px] flex flex-col justify-center relative">
//                         <div className="relative">
//                           <Quote className="h-10 w-10 text-primary/30 mb-3" />
//                           <p className="text-base md:text-lg text-foreground/90 mb-4 italic leading-relaxed">
//                             "{testimonial.text}"
//                           </p>

//                           <div className="flex items-center gap-6">
//                             {/* Profile Image */}
//                             <div className="relative">
//                               <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-50" />
//                               <Image
//                                 src={
//                                   testimonial.image ||
//                                   "/default-avatar.png" // fallback
//                                 }
//                                 alt={testimonial.name}
//                                 width={80}
//                                 height={80}
//                                 className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-background shadow-xl"
//                               />
//                             </div>

//                             <div>
//                               <h4 className="font-bold text-base md:text-lg text-foreground mb-1">
//                                 {testimonial.name}
//                               </h4>
//                               {testimonial.role && (
//                                 <p className="text-xs text-muted-foreground mb-2">
//                                   {testimonial.role}
//                                 </p>
//                               )}
//                               <div className="flex gap-1">
//                                 {[...Array(Math.round(testimonial.rating))].map(
//                                   (_, i) => (
//                                     <Star
//                                       key={i}
//                                       className="h-4 w-4 fill-highlight text-highlight"
//                                     />
//                                   )
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </CarouselItem>
//               ))}
//             </CarouselContent>
//             <CarouselPrevious className="hidden md:flex -left-12" />
//             <CarouselNext className="hidden md:flex -right-12" />
//           </Carousel>

//           {/* Carousel Dots */}
//           <div className="flex justify-center items-center gap-3 mt-8">
//             {testimonials.map((_, index) => (
//               <motion.button
//                 key={index}
//                 onClick={() => api?.scrollTo(index)}
//                 whileHover={{ scale: 1.2 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="group relative"
//               >
//                 <div
//                   className={`h-2.5 rounded-full transition-all duration-300 ${
//                     index === current
//                       ? "w-10 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-glow"
//                       : "w-2.5 bg-muted hover:bg-muted-foreground/50"
//                   }`}
//                 />
//                 {index === current && (
//                   <motion.div
//                     layoutId="activeIndicator"
//                     className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50"
//                   />
//                 )}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



// // "use client";

// // import { motion } from "framer-motion";
// // import Image from "next/image";

// // export default function Testimonials({ data }: any) {
// //   if (!data?.length) return null;

// //   return (
// //     <section className="py-16 bg-white">
// //       <h2 className="text-center text-3xl font-bold mb-12">What Our Users Say</h2>
// //       <div className="flex overflow-x-auto gap-6 px-8">
// //         {data.map((t: any) => (
// //           <motion.div
// //             key={t.id}
// //             whileHover={{ scale: 1.05 }}
// //             className="min-w-[300px] bg-gray-50 p-6 rounded-2xl shadow-lg"
// //           >
// //             {t.image && (
// //               <Image
// //                 src={t.image}
// //                 width={60}
// //                 height={60}
// //                 alt={t.name}
// //                 className="rounded-full mb-4"
// //               />
// //             )}
// //             <p className="italic mb-2">“{t.text}”</p>
// //             <h4 className="font-bold">{t.name}</h4>
// //             <p className="text-sm text-gray-500">{t.role}</p>
// //           </motion.div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // }

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

// ✅ Match backend structure
interface Testimonial {
  id: string;
  name: string;
  role?: string;
  text: string;
  rating: number;
  image_url?: string | null;
}

export default function TestimonialsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/home/testimonials/`;

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success && res.data.testimonials) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error("Error loading testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

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
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="bg-blue-600 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
              ⭐ Student Success Stories
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Success{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              That Speaks
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real achievements from students who chose to succeed with PrepTara
          </p>
        </motion.div>

        {/* Carousel Section */}
        <div className="max-w-6xl mx-auto">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="backdrop-blur-md bg-gradient-to-br from-card/90 to-primary/5 border-primary/30 shadow-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
                      <CardContent className="p-6 md:p-8 min-h-[280px] flex flex-col justify-center relative">
                        <div className="relative">
                          <Quote className="h-10 w-10 text-primary/30 mb-3" />
                          <p className="text-base md:text-lg text-foreground/90 mb-4 italic leading-relaxed">
                            &quot;{testimonial.text}&quot;
                          </p>

                          <div className="flex items-center gap-6">
                            {/* ✅ Profile Image (Cloudinary URL) */}
                            {testimonial.image_url ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-lg opacity-50" />
                                <Image
                                  src={testimonial.image_url}
                                  alt={testimonial.name}
                                  width={80}
                                  height={80}
                                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-background shadow-xl"
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-background shadow-xl" />
                            )}

                            <div>
                              <h4 className="font-bold text-base md:text-lg text-foreground mb-1">
                                {testimonial.name}
                              </h4>
                              {testimonial.role && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  {testimonial.role}
                                </p>
                              )}
                              <div className="flex gap-1">
                                {[...Array(Math.round(testimonial.rating))].map(
                                  (_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-highlight text-highlight"
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>

          {/* Carousel Dots */}
          <div className="flex justify-center items-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => api?.scrollTo(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="group relative"
              >
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === current
                      ? "w-10 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-glow"
                      : "w-2.5 bg-muted hover:bg-muted-foreground/50"
                  }`}
                />
                {index === current && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
