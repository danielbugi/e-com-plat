"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    nameEn?: string | null;
    nameHe?: string | null;
    slug: string;
    description?: string | null;
    image?: string | null;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // English fields
  const [nameEn, setNameEn] = useState(category?.nameEn || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [description, setDescription] = useState(category?.description || "");
  const [image, setImage] = useState(category?.image || "");

  // Hebrew fields
  const [nameHe, setNameHe] = useState(category?.nameHe || "");

  // Auto-generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameEnChange = (value: string) => {
    setNameEn(value);
    if (!category) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn || !nameHe) {
      toast.error("Please provide both English and Hebrew names");
      return;
    }

    if (!slug) {
      toast.error("Slug is required");
      return;
    }

    setIsLoading(true);

    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";

      const response = await fetch(url, {
        method: category ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameEn, // Keep for backward compatibility
          nameEn,
          nameHe,
          slug,
          description,
          image,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save category");
      }

      toast.success(
        category
          ? "Category updated successfully"
          : "Category created successfully"
      );
      router.push("/admin/categories");
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
          <CardTitle>
            {category ? "Edit Category" : "Create Category"}
          </CardTitle>
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
                  Category Name (English){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameEn"
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  placeholder="Rings"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="rings"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly name (auto-generated from English name)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Handcrafted rings for every occasion"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Hebrew Tab */}
            <TabsContent value="he" className="space-y-4" dir="rtl">
              <div className="space-y-2">
                <Label htmlFor="nameHe">
                  שם הקטגוריה (עברית) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nameHe"
                  value={nameHe}
                  onChange={(e) => setNameHe(e.target.value)}
                  placeholder="טבעות"
                  required
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionHe">תיאור (עברית)</Label>
                <Textarea
                  id="descriptionHe"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="טבעות בעבודת יד לכל אירוע"
                  rows={3}
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Common Fields */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/categories/rings.jpg"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : category
                ? "Update Category"
                : "Create Category"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
