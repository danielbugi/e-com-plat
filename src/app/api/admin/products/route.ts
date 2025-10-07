import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number for all products
    const productsData = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));

    return NextResponse.json(productsData);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      nameEn,
      nameHe,
      description,
      descriptionEn,
      descriptionHe,
      price,
      image,
      images,
      categoryId,
      inStock,
      featured,
    } = body;

    // Validate required fields
    if (!nameEn || !nameHe || !price || !categoryId || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name || nameEn, // Fallback for compatibility
        nameEn,
        nameHe,
        description: description || descriptionEn,
        descriptionEn,
        descriptionHe,
        price,
        image,
        images: images || [],
        categoryId,
        inStock: inStock ?? true,
        featured: featured ?? false,
      },
    });

    // Convert Decimal to number
    const productData = {
      ...product,
      price: product.price.toNumber(),
    };

    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
