"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export function ShopDropdown() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href="/shop"
        className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 py-2"
      >
        Shop
        <ChevronDown className="h-3 w-3" />
      </Link>

      {isOpen && categories.length > 0 && (
        <div className="absolute top-full left-0 pt-2">
          <div className="bg-popover border rounded-md shadow-lg w-56">
            <div className="py-2">
              <Link
                href="/shop"
                className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                All Products
              </Link>
              <div className="border-t my-2"></div>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
