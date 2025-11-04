"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type for FAQ data
interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://127.0.0.1:8000/api/home/faqs/";

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const res = await axios.get(API_URL);
        if (res.data.success && res.data.faqs) {
          setFaqs(res.data.faqs);
        } else {
          setError("Failed to load FAQs.");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Unable to fetch FAQs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading FAQs...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">{error}</div>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-card/50" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about PrepTara
          </p>
        </motion.div>

        {/* Accordion List */}
        {faqs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-card border border-primary/10 rounded-lg px-6 data-[state=open]:border-primary/30"
                >
                  <AccordionTrigger className="text-left hover:text-primary font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ) : (
          <p className="text-center text-muted-foreground">No FAQs available.</p>
        )}
      </div>
    </section>
  );
}




// "use client";

// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export default function FAQs({ data }: any) {
//   const [open, setOpen] = useState<number | null>(null);
//   if (!data?.length) return null;

//   return (
//     <section className="px-8 py-16 bg-gray-100">
//       <h2 className="text-center text-3xl font-bold mb-10">Frequently Asked Questions</h2>
//       <div className="max-w-3xl mx-auto">
//         {data.map((faq: any, i: number) => (
//           <div key={i} className="bg-white p-5 mb-3 rounded-xl shadow cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-medium">{faq.question}</h3>
//               <ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
//             </div>
//             {open === i && <p className="mt-3 text-gray-600">{faq.answer}</p>}
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
