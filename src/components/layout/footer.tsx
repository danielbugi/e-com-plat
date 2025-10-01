"use client";

import Link from "next/link";
import {
  Gem,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/contexts/settings-context";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gem className="h-6 w-6 text-gold-500" />
              <span className="font-bold text-xl">
                {settings?.siteName || "FORGE & STEEL"}
              </span>
            </div>
            <p className="text-gray-400">
              {settings?.siteDescription ||
                "Premium handcrafted jewelry for the modern gentleman."}
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              {settings?.contactEmail && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings?.contactPhone && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone className="h-4 w-4" />
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="hover:text-white transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-white transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Newsletter</h3>
            <p className="text-gray-400">
              Subscribe for updates and exclusive offers
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button className="bg-accent hover:bg-accent/90">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} {settings?.siteName || "Forge & Steel"}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
