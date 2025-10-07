"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/language-context";

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  nameHe?: string | null;
  slug: string;
}

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true"
  );
  const [featuredOnly, setFeaturedOnly] = useState(
    searchParams.get("featured") === "true"
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const getCategoryName = (category: Category) => {
    if (language === "he") {
      return category.nameHe || category.nameEn || category.name;
    }
    return category.nameEn || category.name;
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Keep search query
    const query = searchParams.get("q");
    if (query) params.set("q", query);

    // Apply filters
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (inStockOnly) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }

    if (featuredOnly) {
      params.set("featured", "true");
    } else {
      params.delete("featured");
    }

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const query = searchParams.get("q");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategory("");
    setInStockOnly(false);
    setFeaturedOnly(false);

    if (query) {
      router.push(`/search?q=${query}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("search.filters")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">
            {t("search.category")}
          </Label>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                !selectedCategory
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-secondary"
              }`}
            >
              {t("search.allCategories")}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                  selectedCategory === category.slug
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            {t("search.priceRange")}
          </Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="minPrice" className="text-sm">
                {t("search.minPrice")}
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-sm">
                {t("search.maxPrice")}
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Filters */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            {t("search.availability")}
          </Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="inStock" className="text-sm cursor-pointer">
                {t("search.inStockOnly")}
              </Label>
              <Switch
                id="inStock"
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured" className="text-sm cursor-pointer">
                {t("search.featuredOnly")}
              </Label>
              <Switch
                id="featured"
                checked={featuredOnly}
                onCheckedChange={setFeaturedOnly}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={applyFilters} className="w-full">
            {t("search.applyFilters")}
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            {t("search.clearFilters")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
