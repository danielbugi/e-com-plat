import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) return null;

  return {
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() || null,
  };
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">Update product information</p>
      </div>

      <ProductForm
        categories={categories}
        initialData={product}
        productId={product.id}
      />
    </div>
  );
}
