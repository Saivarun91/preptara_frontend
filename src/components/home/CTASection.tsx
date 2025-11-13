"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CTAData {
  heading: string;
  subheading?: string;
  button_text_primary?: string;
  button_link_primary?: string;
  button_text_secondary?: string;
  button_link_secondary?: string;
  footer_note?: string;
  background_image?: string | null;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
export const CTASection = () => {
  const [data, setData] = useState<CTAData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCTA = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/cta/`);
        const result = await res.json();

        if (result.success) {
          // ✅ Force primary button to go to practice tests
          result.data.button_link_primary = "/practice-tests";
          setData(result.data);
        } else {
          console.error("Failed to load CTA:", result.message);
        }
      } catch (error) {
        console.error("Error fetching CTA section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCTA();
  }, []);

  if (loading) return null;
  if (!data) return null;

  return (
    <section className="py-20 relative overflow-hidden bg-blue-100">
      {/* Background image */}
      {data.background_image && (
        <Image
          src={data.background_image}
          alt="CTA Background"
          fill
          className="object-cover brightness-50 absolute inset-0 -z-10"
        />
      )}

      {/* Floating animation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl"
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
            style={{
              left: `${15 + i * 25}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>

      {/* CTA Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Subheading */}
          {data.subheading && (
            <div className="inline-flex items-center gap-2 bg-highlight/10 border border-highlight/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-highlight" />
              <span className="text-sm font-medium text-highlight">
                {data.subheading}
              </span>
            </div>
          )}

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
            {data.heading}
          </h2>

          {/* Description / Footer Note */}
          {data.footer_note && (
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {data.footer_note}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {data.button_text_primary && (
              <Link href={data.button_link_primary || "/practice-tests"}>
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-all"
                >
                  {data.button_text_primary}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            {data.button_text_secondary && data.button_link_secondary && (
              <Link href={data.button_link_secondary}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-lg px-8"
                >
                  {data.button_text_secondary}
                </Button>
              </Link>
            )}
          </div>

          {/* Default footer note if not provided */}
          {!data.footer_note && (
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Cancel anytime • 24/7 support
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};
