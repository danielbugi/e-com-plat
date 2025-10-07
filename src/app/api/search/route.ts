import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const inStock = searchParams.get("inStock");
    const featured = searchParams.get("featured");
    const lang = searchParams.get("lang") || "en";

    // Build where clause
    const where: any = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { nameEn: { contains: query, mode: "insensitive" } },
        { nameHe: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { descriptionEn: { contains: query, mode: "insensitive" } },
        { descriptionHe: { contains: query, mode: "insensitive" } },
      ],
    };

    // Add filters
    if (category) {
      where.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === "true") {
      where.inStock = true;
    }

    if (featured === "true") {
      where.featured = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Execute query
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    // Localize and serialize
    const localizedProducts = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() || null,
      name:
        lang === "he" && product.nameHe
          ? product.nameHe
          : product.nameEn || product.name,
      description:
        lang === "he" && product.descriptionHe
          ? product.descriptionHe
          : product.descriptionEn || product.description,
      category: {
        ...product.category,
        name:
          lang === "he" && product.category.nameHe
            ? product.category.nameHe
            : product.category.nameEn || product.category.name,
      },
    }));

    return NextResponse.json({
      products: localizedProducts,
      total: localizedProducts.length,
      query,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
