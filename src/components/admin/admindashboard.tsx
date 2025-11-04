// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   Menu,
//   LayoutDashboard,
//   Folder,
//   User,
//   Users,
//   BookOpen,
//   FileText,
//   DollarSign,
//   Activity,
//   Award,
//   Target,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// // Sample Data
// const stats = [
//   { title: "Total Users", value: "52,483", change: "+12.5%", icon: Users, trend: "up" },
//   { title: "Active Courses", value: "127", change: "+8.2%", icon: BookOpen, trend: "up" },
//   { title: "Revenue", value: "₹12.5L", change: "+23.1%", icon: DollarSign, trend: "up" },
//   { title: "Tests Taken", value: "1.2M", change: "+45.3%", icon: FileText, trend: "up" },
// ];

// const recentActivity = [
//   { user: "Priya Sharma", action: "Completed UPSC Mock Test", time: "2 mins ago" },
//   { user: "Rahul Kumar", action: "Enrolled in SSC CGL Course", time: "15 mins ago" },
//   { user: "Ananya Reddy", action: "Achieved 95% in NEET Practice", time: "1 hour ago" },
//   { user: "Amit Patel", action: "Purchased Banking Course", time: "2 hours ago" },
//   { user: "Sneha Gupta", action: "Started JEE Preparation", time: "3 hours ago" },
// ];

// const topCourses = [
//   { name: "UPSC Civil Services", students: 5420, revenue: "₹81.3L" },
//   { name: "JEE Main & Advanced", students: 11000, revenue: "₹131.9L" },
//   { name: "NEET Medical", students: 9500, revenue: "₹123.4L" },
//   { name: "SSC CGL/CHSL", students: 8200, revenue: "₹65.6L" },
// ];

// const sidebarLinks = [
//   { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/admin" },
//   { label: "Categories", icon: <Folder className="w-5 h-5" />, href: "/admin/categories" },
// ];

// export default function AdminDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const pathname = usePathname();

//   const isDashboard = pathname === "/admin";
//   const isCategories = pathname === "/admin/categories";

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <motion.aside
//         animate={{ width: sidebarOpen ? 220 : 60 }}
//         className="bg-white border-r shadow-sm flex flex-col transition-all duration-300"
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           {sidebarOpen && <h2 className="text-lg font-bold text-blue-600">PrepTara</h2>}
//           <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
//             <Menu className="w-5 h-5" />
//           </Button>
//         </div>

//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {sidebarLinks.map((link) => (
//             <SidebarItem
//               key={link.label}
//               icon={link.icon}
//               label={link.label}
//               href={link.href}
//               open={sidebarOpen}
//               active={pathname === link.href}
//             />
//           ))}
//         </nav>
//       </motion.aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <header className="flex items-center justify-between bg-white shadow-sm px-6 py-3 border-b">
//           <h1 className="text-xl font-bold text-blue-600">PrepTara Admin</h1>
//           <div className="flex items-center gap-3">
//             <span className="hidden sm:block font-medium">Admin</span>
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="/avatar.png" alt="Profile" />
//               <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
//             </Avatar>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-6">
//           {isDashboard && <DashboardContent />}
//           {isCategories && <CategoriesContent />}
//         </main>
//       </div>
//     </div>
//   );
// }

// function SidebarItem({ icon, label, href, open, active }: { icon: React.ReactNode; label: string; href: string; open: boolean; active: boolean }) {
//   return (
//     <Link
//       href={href}
//       className={`flex items-center w-full text-gray-700 rounded-lg px-3 py-2 hover:bg-gray-100 transition ${active ? "bg-blue-100 text-blue-600 font-semibold" : ""}`}
//     >
//       {icon}
//       {open && <span className="ml-3 text-sm">{label}</span>}
//     </Link>
//   );
// }

// // Dashboard content
// function DashboardContent() {
//   return (
//     <>
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//         <h1 className="text-4xl font-bold mb-2 text-blue-600">Admin Dashboard</h1>
//         <p className="text-gray-500">Monitor platform performance and user activity</p>
//       </motion.div>

//       {/* Stats */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, idx) => (
//           <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
//             <Card className="border bg-white hover:shadow-lg transition-all">
//               <CardContent>
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="p-3 bg-blue-100 rounded-lg">
//                     <stat.icon className="h-6 w-6 text-blue-600" />
//                   </div>
//                   <div className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
//                     {stat.change}
//                   </div>
//                 </div>
//                 <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
//                 <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* Recent Activity */}
//       <div className="grid lg:grid-cols-3 gap-6">
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Activity className="h-5 w-5 text-blue-600" /> User Activity Trends
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
//               <p className="text-gray-500">Analytics Chart Placeholder</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Target className="h-5 w-5 text-blue-600" /> Recent Activity
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {recentActivity.map((activity, idx) => (
//               <div key={idx} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="p-2 bg-blue-100 rounded-full">
//                   <Activity className="h-4 w-4 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">{activity.user}</p>
//                   <p className="text-xs text-gray-500">{activity.action}</p>
//                   <p className="text-xs text-gray-400">{activity.time}</p>
//                 </div>
//               </div>
//             ))}
//             <Button variant="outline" className="w-full">View All Activity</Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Top Courses */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Award className="h-5 w-5 text-blue-600" /> Top Performing Courses
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           {topCourses.map((course, idx) => (
//             <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full text-white font-bold">{idx + 1}</div>
//                 <div>
//                   <h4 className="font-semibold">{course.name}</h4>
//                   <p className="text-sm text-gray-500">{course.students.toLocaleString()} students</p>
//                 </div>
//               </div>
//               <div className="text-blue-600 font-bold">{course.revenue}</div>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </>
//   );
// }

// // Categories content
// function CategoriesContent() {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Categories Management</h2>
//       <p className="text-gray-500 mb-4">Manage all course categories (Add, Edit, Delete)</p>
//       <div className="border rounded-lg p-4 bg-white shadow-sm text-gray-500">Categories table placeholder</div>
//     </div>
//   );
// }
