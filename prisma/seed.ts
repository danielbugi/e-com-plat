import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'signature-rings' },
      update: {},
      create: {
        name: 'Signature Rings',
        slug: 'signature-rings',
        description: 'Bold statement pieces for the modern gentleman',
        image: '/images/ring-1.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'wedding-bands' },
      update: {},
      create: {
        name: 'Wedding Bands',
        slug: 'wedding-bands',
        description: 'Timeless symbols of commitment',
        image: '/images/ring-2.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'custom-pieces' },
      update: {},
      create: {
        name: 'Custom Pieces',
        slug: 'custom-pieces',
        description: 'Bespoke jewelry crafted to your vision',
        image: '/images/ring-3.jpg',
      },
    }),
  ]);

  console.log('Categories created:', categories.length);

  // Create Products
  const products = [
    {
      name: 'Obsidian Steel Ring',
      slug: 'obsidian-steel-ring',
      description:
        'A bold statement piece crafted from premium tungsten carbide with a brushed matte finish. Perfect for the modern gentleman.',
      price: 899,
      comparePrice: 1299,
      image: '/images/ring-1.jpg',
      images: ['/images/ring-1.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 15,
      categoryId: categories[0].id,
    },
    {
      name: 'Damascus Steel Band',
      slug: 'damascus-steel-band',
      description:
        'Hand-forged Damascus steel ring with unique pattern. Each piece is one-of-a-kind.',
      price: 1299,
      comparePrice: 1799,
      image: '/images/ring-2.jpg',
      images: ['/images/ring-2.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 8,
      categoryId: categories[0].id,
    },
    {
      name: 'Eternal Gold Band',
      slug: 'eternal-gold-band',
      description:
        'Classic 18k gold wedding band with polished finish. Timeless elegance.',
      price: 2499,
      comparePrice: 2999,
      image: '/images/ring-3.jpg',
      images: ['/images/ring-3.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 12,
      categoryId: categories[1].id,
    },
    {
      name: 'Carbon Fiber Ring',
      slug: 'carbon-fiber-ring',
      description:
        'Modern design combining aerospace-grade carbon fiber with titanium.',
      price: 699,
      image: '/images/ring-1.jpg',
      images: ['/images/ring-1.jpg'],
      inStock: true,
      featured: false,
      freeShipping: true,
      inventory: 20,
      categoryId: categories[0].id,
    },
    {
      name: 'Platinum Classic',
      slug: 'platinum-classic',
      description: 'Sophisticated platinum band with comfort fit interior.',
      price: 3299,
      comparePrice: 3799,
      image: '/images/ring-2.jpg',
      images: ['/images/ring-2.jpg'],
      inStock: true,
      featured: false,
      freeShipping: true,
      inventory: 6,
      categoryId: categories[1].id,
    },
    {
      name: 'Meteorite Inlay Ring',
      slug: 'meteorite-inlay-ring',
      description:
        'Unique titanium ring with authentic Gibeon meteorite inlay.',
      price: 1599,
      image: '/images/ring-3.jpg',
      images: ['/images/ring-3.jpg'],
      inStock: true,
      featured: true,
      freeShipping: true,
      inventory: 5,
      categoryId: categories[2].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('Products created:', products.length);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
