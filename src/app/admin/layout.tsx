"use client";

import AdminNavbar from "@/components/admin/adminnavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar (scrolls with the page) */}
      <aside className="w-64 bg-white shadow-md border-r border-gray-200">
        <AdminSidebar />
      </aside>

      {/* Main Section (Navbar + Content) */}
      <div className="flex flex-col flex-1">
        {/* Navbar (scrolls with the page) */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200">
          <AdminNavbar />
        </header>
        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}



// import AdminNavbar from "@/components/admin/adminnavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <div className="flex flex-1">
//         {/* Sidebar on the left */}
//         <AdminSidebar />

//         {/* Main content area */}
//         <div className="flex flex-col flex-1">
//           {/* Navbar after sidebar */}
//           <AdminNavbar />

//           <main className="p-6 bg-gray-50 flex-1 overflow-auto">
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import AdminNavbar from "@/components/admin/adminnavbar";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Fixed Sidebar */}
//       <div className="fixed top-0 left-0 h-screen w-64">
//         <AdminSidebar />
//       </div>

//       {/* Main Content Area (with left margin to avoid overlap) */}
//       <div className="ml-64 flex flex-col flex-1">
//         {/* Fixed Navbar */}
//         <div className="fixed top-0 left-64 right-0 z-50">
//           <AdminNavbar />
//         </div>

//         {/* Scrollable main area */}
//         <main className="mt-16 p-6 overflow-auto h-[calc(100vh-4rem)]">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }





