"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/shop/product-grid";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchSort } from "@/components/search/search-sort";
import { useLanguage } from "@/contexts/language-context";
import { Loader2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const inStock = searchParams.get("inStock") || "";
  const featured = searchParams.get("featured") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (category) params.append("category", category);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);
        if (inStock) params.append("inStock", inStock);
        if (featured) params.append("featured", featured);
        params.append("lang", language);

        const response = await fetch(`/api/search?${params.toString()}`);
        const data = await response.json();

        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [
    query,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    inStock,
    featured,
    language,
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-steel text-white py-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {query
              ? `${t("search.resultsFor")}: "${query}"`
              : t("search.allProducts")}
          </h1>
          <p className="text-muted-foreground">
            {loading
              ? t("common.loading")
              : `${total} ${t("search.productsFound")}`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <SearchFilters />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Options */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {loading
                    ? t("common.loading")
                    : `${total} ${t("search.productsFound")}`}
                </p>
                <SearchSort />
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}

              {/* Results */}
              {!loading && products.length > 0 && (
                <ProductGrid products={products} />
              )}

              {/* No Results */}
              {!loading && products.length === 0 && (
                <div className="text-center py-20">
                  <h2 className="text-2xl font-bold mb-2">
                    {t("search.noResults")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("search.tryDifferent")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
