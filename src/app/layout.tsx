import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TestProvider } from "@/contexts/TestContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <TestProvider>
            {/* ✅ Add main container with padding to avoid navbar overlap */}
            <main className="flex-1 pt-16 px-4 sm:px-8">
              {children}
            </main>
          </TestProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
