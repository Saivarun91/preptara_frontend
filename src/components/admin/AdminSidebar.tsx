// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";
// import {
//   Home,
//   Layers,
//   User,
//   Activity,
//   Settings,
//   LayoutDashboard,
//   ChevronDown,
//   ChevronRight,
//   FileText,
//   BarChart3,
//   MessageSquare,
//   HelpCircle,
//   MousePointerClick,
//   TestTubes,
// } from "lucide-react";

// export default function AdminSidebar() {
//   const router = useRouter();
//   const pathname = usePathname()?.replace(/\/$/, "") || "";
//   const [isHomeOpen, setIsHomeOpen] = useState(false);

//   const links = [
//     { name: "Categories", path: "/admin/categories", icon: Layers },
//     { name: "Enrollments", path: "/admin/enrollments", icon: User },
//     { name: "Analytics", path: "/admin/analytics", icon: Activity },
//     { name: "Settings", path: "/admin/settings", icon: Settings },
//     { name: "Blog", path: "/admin/blog", icon: FileText },
//   ];

//   const homeLinks = [
//     { name: "Hero Sections", path: "/admin/home/hero", icon: LayoutDashboard },
//     { name: "Features", path: "/admin/home/features", icon: FileText },
//     { name: "Analytics Stats", path: "/admin/home/analytics-stats", icon: BarChart3 },
//     { name: "Testimonials", path: "/admin/home/testimonials", icon: MessageSquare },
//     { name: "FAQs", path: "/admin/home/faqs", icon: HelpCircle },
//     { name: "CTA Sections", path: "/admin/home/cta", icon: MousePointerClick },
//     { name: "Tests Sections", path: "/admin/home/tests", icon: TestTubes },
//   ];

//   return (
//     <aside
//       className="
//         fixed top-16 left-0 
//         w-64 h-[calc(100vh-4rem)] 
//         bg-white shadow-xl 
//         p-6 flex flex-col gap-6 
//         border-r border-gray-200 
//         overflow-y-auto 
//         z-40
//       "
//     >
//       {/* Sidebar Title */}
//       <div className="flex items-center justify-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
//       </div>

//       {/* Navigation Links */}
//       <div className="flex flex-col gap-2">
//         {links.map((link) => {
//           const isActive = pathname === link.path;
//           const Icon = link.icon;
//           return (
//             <button
//               key={link.name}
//               onClick={() => router.push(link.path)}
//               className={`flex items-center gap-3 p-3 rounded-xl font-medium w-full transition-all duration-200 ${
//                 isActive
//                   ? "bg-blue-100 shadow-md text-blue-700"
//                   : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//               }`}
//             >
//               <Icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
//               <span className="text-left">{link.name}</span>
//             </button>
//           );
//         })}

//         {/* Home Management dropdown */}
//         <div>
//           <button
//             onClick={() => setIsHomeOpen(!isHomeOpen)}
//             className={`flex items-center justify-between w-full p-3 rounded-xl font-medium transition-all duration-200 ${
//               pathname.startsWith("/admin/home")
//                 ? "bg-blue-100 text-blue-700"
//                 : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <Home
//                 className={`h-5 w-5 ${
//                   pathname.startsWith("/admin/home") ? "text-blue-700" : "text-gray-500"
//                 }`}
//               />
//               <span>Home Management</span>
//             </div>
//             {isHomeOpen ? (
//               <ChevronDown className="h-4 w-4 text-gray-500" />
//             ) : (
//               <ChevronRight className="h-4 w-4 text-gray-500" />
//             )}
//           </button>

//           {isHomeOpen && (
//             <div className="ml-6 mt-2 flex flex-col gap-1 border-l border-gray-200 pl-3">
//               {homeLinks.map((link) => {
//                 const isActive = pathname === link.path;
//                 const Icon = link.icon;
//                 return (
//                   <button
//                     key={link.name}
//                     onClick={() => router.push(link.path)}
//                     className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-200 ${
//                       isActive
//                         ? "bg-blue-50 text-blue-700 font-semibold"
//                         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                     }`}
//                   >
//                     <Icon className={`h-4 w-4 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
//                     {link.name}
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-auto text-center text-sm text-gray-400">
//         PrepTara Admin © 2025
//       </div>
//     </aside>
//   );
// }



"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Layers,
  User,
  Activity,
  Settings,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  MessageSquare,
  HelpCircle,
  MousePointerClick,
  TestTubes,
} from "lucide-react";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname()?.replace(/\/$/, "") || "";
  const [isHomeOpen, setIsHomeOpen] = useState(false);

  // ✅ First: Home Management nested links
  const homeLinks = [
    { name: "Hero Sections", path: "/admin/home/hero", icon: LayoutDashboard },
    { name: "Features", path: "/admin/home/features", icon: FileText },
    { name: "Analytics Stats", path: "/admin/home/analytics-stats", icon: BarChart3 },
    { name: "Testimonials", path: "/admin/home/testimonials", icon: MessageSquare },
    { name: "FAQs", path: "/admin/home/faqs", icon: HelpCircle },
    { name: "CTA Sections", path: "/admin/home/cta", icon: MousePointerClick },
    { name: "Tests Sections", path: "/admin/home/tests", icon: TestTubes },
  ];

  // ✅ Then: main sidebar links
  const links = [
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Enrollments", path: "/admin/enrollments", icon: User },
    { name: "Analytics", path: "/admin/analytics", icon: Activity },
    { name: "Settings", path: "/admin/settings", icon: Settings },
    { name: "Blog", path: "/admin/blog", icon: FileText },
  ];

  return (
    <aside
      className="
        fixed top-16 left-0 
        w-64 h-[calc(100vh-4rem)] 
        bg-white shadow-xl 
        p-6 flex flex-col gap-6 
        border-r border-gray-200 
        overflow-y-auto 
        z-40
      "
    >
      {/* Sidebar Title */}
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2">
        {/* Regular links */}
        {links.map((link) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;
          return (
            <button
              key={link.name}
              onClick={() => router.push(link.path)}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium w-full transition-all duration-200 ${
                isActive
                  ? "bg-blue-100 shadow-md text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
              <span className="text-left">{link.name}</span>
            </button>
          );
        })}

        {/* 🏠 Home Management dropdown */}
        <div>
          <button
            onClick={() => setIsHomeOpen(!isHomeOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-xl font-medium transition-all duration-200 ${
              pathname.startsWith("/admin/home")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <Home
                className={`h-5 w-5 ${
                  pathname.startsWith("/admin/home") ? "text-blue-700" : "text-gray-500"
                }`}
              />
              <span>Home Management</span>
            </div>
            {isHomeOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </button>

          {isHomeOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-1 border-l border-gray-200 pl-3">
              {homeLinks.map((link) => {
                const isActive = pathname === link.path;
                const Icon = link.icon;
                return (
                  <button
                    key={link.name}
                    onClick={() => router.push(link.path)}
                    className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? "text-blue-700" : "text-gray-500"}`} />
                    {link.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto text-center text-sm text-gray-400">
        PrepTara Admin © 2025
      </div>
    </aside>
  );
}

