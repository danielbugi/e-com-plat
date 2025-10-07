"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  nameHe?: string | null;
}

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    nameEn?: string | null;
    nameHe?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
    descriptionHe?: string | null;
    price: number;
    image: string;
    images: string[];
    categoryId: string;
    inStock: boolean;
    featured: boolean;
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // English fields
  const [nameEn, setNameEn] = useState(product?.nameEn || product?.name || "");
  const [descriptionEn, setDescriptionEn] = useState(
    product?.descriptionEn || product?.description || ""
  );

  // Hebrew fields
  const [nameHe, setNameHe] = useState(product?.nameHe || "");
  const [descriptionHe, setDescriptionHe] = useState(
    product?.descriptionHe || ""
  );

  // Common fields
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [image, setImage] = useState(product?.image || "");
  const [images, setImages] = useState(product?.images?.join("\n") || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn || !nameHe) {
      toast.error("Please provide both English and Hebrew names");
      return;
    }

    if (!price || !categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";

      const imagesArray = images
        .split("\n")
        .map((img) => img.trim())
        .filter((img) => img.length > 0);

      const response = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameEn, // Keep for backward compatibility
          nameEn,
          nameHe,
          description: descriptionEn, // Keep for backward compatibility
          descriptionEn,
          descriptionHe,
          price: parseFloat(price),
          image,
          images: imagesArray,
          categoryId,
          inStock,
          featured,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save product");
      }

      toast.success(
        product
          ? "Product updated successfully"
          : "Product created successfully"
      );
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Create Product"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="he">עברית</TabsTrigger>
            </TabsList>

            {/* English Tab */}
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">
                  Product Name (English) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Sterling Silver Ring"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionEn">Description (English)</Label>
                <Textarea
                  id="descriptionEn"
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Handcrafted sterling silver ring..."
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Hebrew Tab */}
            <TabsContent value="he" className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="nameHe">
                  שם המוצר (עברית) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameHe"
                  value={nameHe}
                  onChange={(e) => setNameHe(e.target.value)}
                  placeholder="טבעת כסף סטרלינג"
                  required
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionHe">תיאור (עברית)</Label>
                <Textarea
                  id="descriptionHe"
                  value={descriptionHe}
                  onChange={(e) => setDescriptionHe(e.target.value)}
                  placeholder="טבעת כסף סטרלינג בעבודת יד..."
                  rows={4}
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (₪) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299.99"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameEn || category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Main Image URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/products/ring-1.jpg"
              required
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Additional Images (one per line)</Label>
            <Textarea
              id="images"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="/images/products/ring-1.jpg&#10;/images/products/ring-2.jpg"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={inStock}
                onCheckedChange={setInStock}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Featured</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
