"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { Category } from "@prisma/client";
import { ImageUpload } from "./image-upload";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  comparePrice: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  inventory: z.string().min(1, "Inventory is required"),
  inStock: z.boolean(),
  featured: z.boolean(),
  freeShipping: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
  productId?: string;
}

export function ProductForm({
  categories,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [mainImage, setMainImage] = useState<string>(initialData?.image || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          price: initialData.price.toString(),
          comparePrice: initialData.comparePrice?.toString() || "",
          categoryId: initialData.categoryId,
          inventory: initialData.inventory.toString(),
          inStock: initialData.inStock,
          featured: initialData.featured,
          freeShipping: initialData.freeShipping,
        }
      : {
          inStock: true,
          featured: false,
          freeShipping: false,
        },
  });

  const categoryId = watch("categoryId");
  const inStock = watch("inStock");
  const featured = watch("featured");
  const freeShipping = watch("freeShipping");

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", slug);
  };

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!mainImage) {
      toast.error("Please select a main image");
      return;
    }

    console.log("Form submission - images array:", images); // Debug log
    console.log("Form submission - images length:", images.length); // Debug log

    setIsLoading(true);
    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = productId ? "PUT" : "POST";

      const payload = {
        ...data,
        price: parseFloat(data.price),
        comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
        inventory: parseInt(data.inventory),
        image: mainImage,
        images: images,
      };

      console.log("Sending payload to API:", payload); // Debug log
      console.log("Payload images length:", payload.images.length); // Debug log

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save product");

      const result = await response.json();
      console.log("API response:", result); // Debug log

      toast.success(
        productId
          ? "Product updated successfully"
          : "Product created successfully"
      );
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Save error:", error); // Debug log
      toast.error("Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                handleNameChange(e);
              }}
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && (
              <p className="text-sm text-destructive mt-1">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={4} />
          </div>

          <div>
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setValue("categoryId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="comparePrice">Compare Price</Label>
              <Input
                id="comparePrice"
                type="number"
                step="0.01"
                {...register("comparePrice")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="inventory">Inventory *</Label>
            <Input id="inventory" type="number" {...register("inventory")} />
            {errors.inventory && (
              <p className="text-sm text-destructive mt-1">
                {errors.inventory.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            mainImage={mainImage}
            onImagesChange={setImages}
            onMainImageChange={setMainImage}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setValue("inStock", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="inStock" className="cursor-pointer">
              In Stock
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setValue("featured", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Featured Product
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="freeShipping"
              checked={freeShipping}
              onChange={(e) => setValue("freeShipping", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="freeShipping" className="cursor-pointer">
              Free Shipping
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : productId
            ? "Update Product"
            : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
