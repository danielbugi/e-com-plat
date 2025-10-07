import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const lang = searchParams.get("lang") || "en";

    const products = await prisma.product.findMany({
      where: {
        ...(category && {
          category: {
            slug: category,
          },
        }),
        ...(featured === "true" && {
          featured: true,
        }),
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Localize product and category names
    const localizedProducts = products.map((product) => ({
      ...product,
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

    return NextResponse.json(localizedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
