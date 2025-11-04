"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-card via-primary/5 to-card border-t border-primary/20 mt-20">
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />

      <div className="container mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-bold">
                <span className="text-foreground">Prep</span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Tara
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Empowering learners. Inspiring success. Your ultimate platform for
              competitive exam preparation.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:border-primary"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:border-primary"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:border-primary"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:border-primary"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Home", "Courses", "Practice Tests", "Blog", "About"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {[
                "FAQ",
                "Help Center",
                "Terms of Service",
                "Privacy Policy",
                "Refund Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Stay Connected
            </h3>
            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>support@preptara.com</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>New Delhi, India</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <Input placeholder="Enter your email" className="text-sm" />
                <Button
                  size="sm"
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PrepTara. All rights reserved. Built with passion for learners.
          </p>
        </div>
      </div>
    </footer>
  );
};
