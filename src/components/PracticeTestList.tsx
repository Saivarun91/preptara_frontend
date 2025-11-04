// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Clock, FileQuestion, Target, TrendingUp, Play, Award } from "lucide-react";

// interface PracticeTest {
//   id: string;
//   title: string;
//   questions: number;
//   duration: number;
//   difficulty?: string;
//   category: string;
//   attempts?: number;
//   avgScore?: number;
// }

// const PracticeTestsPage = () => {
//   const router = useRouter();
//   const [tests, setTests] = useState<PracticeTest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState("All");

//   // Fetch tests dynamically from backend
//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/api/tests/");
//         if (!res.ok) throw new Error("Failed to fetch tests");
//         const data: PracticeTest[] = await res.json();
//         setTests(data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTests();
//   }, []);

//   const categories = ["All", ...Array.from(new Set(tests.map((t) => t.category)))];

//   const filteredTests =
//     activeCategory === "All" ? tests : tests.filter((t) => t.category === activeCategory);

//   if (loading) return <p className="text-center py-10">Loading tests...</p>;
//   if (!tests.length) return <p className="text-center py-10">No tests available</p>;

//   return (
//     <div className="min-h-screen pt-16 bg-gray-50">
//       {/* Hero Section */}
//       <section className="relative py-20 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-hero opacity-10" />

//         <div className="container mx-auto px-4 relative z-10 text-center">
//           <motion.h1
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-5xl md:text-6xl font-bold mb-6"
//           >
//             Practice <span className="bg-gradient-primary bg-clip-text text-transparent">Tests</span>
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-xl text-muted-foreground mb-8"
//           >
//             Test your skills with our comprehensive mock exams and track your progress
//           </motion.p>

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
//             {[
//               { icon: FileQuestion, label: "Tests Available", value: tests.length.toString() },
//               { icon: Target, label: "Questions", value: "50,000+" },
//               { icon: TrendingUp, label: "Avg Improvement", value: "35%" },
//               { icon: Award, label: "Success Rate", value: "92%" },
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="p-6 bg-card rounded-lg border border-primary/20"
//               >
//                 <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
//                 <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
//                 <div className="text-sm text-muted-foreground">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Category Filter */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         viewport={{ once: true }}
//         className="flex flex-wrap justify-center gap-3 mb-12"
//       >
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setActiveCategory(category)}
//             className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all border ${
//               activeCategory === category
//                 ? "bg-blue-600 text-white border-blue-600 shadow-sm"
//                 : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </motion.div>

//       {/* Tests Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-4">
//         {filteredTests.map((test, index) => (
//           <motion.div
//             key={test.id}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//           >
//             <Card className="group hover:shadow-card transition-all duration-300 hover:-translate-y-2 border-primary/10 h-full">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <Badge variant="secondary" className="bg-accent/10 text-accent border border-accent/20">
//                     {test.category}
//                   </Badge>
//                 </div>

//                 <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
//                   {test.title}
//                 </h3>

//                 <div className="space-y-3 mb-6">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground flex items-center gap-2">
//                       <FileQuestion className="h-4 w-4" /> Questions
//                     </span>
//                     <span className="font-semibold">{test.questions}</span>
//                   </div>
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-muted-foreground flex items-center gap-2">
//                       <Clock className="h-4 w-4" /> Duration
//                     </span>
//                     <span className="font-semibold">{test.duration} mins</span>
//                   </div>
//                   {test.avgScore !== undefined && (
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-muted-foreground flex items-center gap-2">
//                         <Target className="h-4 w-4" /> Avg Score
//                       </span>
//                       <span className="font-semibold">{test.avgScore}%</span>
//                     </div>
//                   )}
//                 </div>

//                 <Button
//                   className="flex-1 bg-gradient-primary hover:shadow-glow group/btn"
//                   onClick={() => router.push(`/exam-details/${test.id}`)}
//                 >
//                   <Play className="h-4 w-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
//                   View Details
//                 </Button>

//                 {test.attempts !== undefined && (
//                   <p className="text-xs text-muted-foreground mt-4 text-center">
//                     {test.attempts.toLocaleString()} attempts
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PracticeTestsPage;
