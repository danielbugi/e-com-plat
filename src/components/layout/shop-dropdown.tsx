"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  nameHe?: string | null;
  slug: string;
}

export function ShopDropdown() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.slice(0, 5)));
  }, []);

  const getCategoryName = (category: Category) => {
    if (language === "he") {
      return category.nameHe || category.nameEn || category.name;
    }
    return category.nameEn || category.name;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-1 text-sm font-medium"
          aria-label={t("nav.shop")}
        >
          {t("nav.shop")}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-sm font-semibold">
          {t("shop.dropdown.featured")}
        </div>
        <DropdownMenuSeparator />
        {categories.map((category) => (
          <DropdownMenuItem key={category.id} asChild>
            <Link href={`/shop?category=${category.slug}`}>
              {getCategoryName(category)}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/shop" className="font-medium">
            {t("shop.dropdown.viewAll")}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
