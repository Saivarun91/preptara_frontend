"use client";

import { useState, useRef } from "react";
import Hero from "@/components/home/Hero";
import AnalyticsSection from "@/components/home/AnalyticsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestsSection from "@/components/home/TestsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FAQSection from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const testsSectionRef = useRef<HTMLDivElement>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setTimeout(() => {
      testsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleResetSearch = () => setSearchQuery("");

  return (
    <>
      <Hero onSearch={handleSearch} />
      <AnalyticsSection />
      <FeaturesSection />
      <div ref={testsSectionRef}>
        {/* ✅ These props must exist in TestsSection */}
        <TestsSection
          searchQuery={searchQuery}
          onResetSearch={handleResetSearch}
        />
      </div>
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Hero from "@/components/home/Hero";
// import Analytics from "@/components/home/AnalyticsSection";
// import Features from "@/components/home/FeaturesSection";
// import Testimonials from "@/components/home/TestimonialsSection";
// import FAQs from "@/components/home/FAQSection";
// import CTA from "@/components/home/CTASection";

// export default function HomePage() {
//   const [data, setData] = useState<any>({});
//   const [loading, setLoading] = useState(true);

//   // Your backend API base URL
//   const API_BASE = "http://127.0.0.1:8000/api/home";

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const [
//           heroRes,
//           analyticsRes,
//           featuresRes,
//           testimonialsRes,
//           faqsRes,
//           ctaRes,
//         ] = await Promise.all([
//           axios.get(`${API_BASE}/hero/`),
//           axios.get(`${API_BASE}/analytics/`),
//           axios.get(`${API_BASE}/features/`),
//           axios.get(`${API_BASE}/testimonials/`),
//           axios.get(`${API_BASE}/faqs/`),
//           axios.get(`${API_BASE}/cta/`),
//         ]);

//         setData({
//           hero: heroRes.data.data,
//           analytics: analyticsRes.data.stats,
//           features: featuresRes.data.features,
//           testimonials: testimonialsRes.data.testimonials,
//           faqs: faqsRes.data.faqs,
//           cta: ctaRes.data.data || ctaRes.data.cta,
//         });
//       } catch (e) {
//         console.error("Error loading homepage:", e);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadData();
//   }, []);

//   if (loading)
//     return <div className="text-center py-20 text-gray-500">Loading...</div>;

//   return (
//     <div className="flex flex-col gap-16">
//       <Hero data={data.hero} />
//       <Analytics data={data.analytics} />
//       <Features data={data.features} />
//       <Testimonials data={data.testimonials} />
//       <FAQs data={data.faqs} />
//       <CTA data={data.cta} />
//     </div>
//   );
// }
