// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to number for all products
    const productsData = products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice?.toNumber() || null,
    }));

    return NextResponse.json(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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
      slug,
      description,
      descriptionEn,
      descriptionHe,
      price,
      comparePrice,
      image,
      images,
      categoryId,
      inStock,
      featured,
    } = body;

    console.log('Received product data:', {
      nameEn,
      nameHe,
      slug,
      price,
      comparePrice,
      categoryId,
      image,
      hasImages: !!images,
    });

    // Validate required fields
    const missingFields = [];
    if (!nameEn) missingFields.push('nameEn');
    if (!nameHe) missingFields.push('nameHe');
    if (!slug) missingFields.push('slug');
    if (!price) missingFields.push('price');
    if (!categoryId) missingFields.push('categoryId');
    if (!image) missingFields.push('image');

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name || nameEn,
        nameEn,
        nameHe,
        slug,
        description: description || descriptionEn,
        descriptionEn,
        descriptionHe,
        price,
        comparePrice: comparePrice || null,
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
      comparePrice: product.comparePrice?.toNumber() || null,
    };

    return NextResponse.json(productData, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
