// src/components/admin/product-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/image-uploader';
import { MultipleImagesUploader } from '@/components/admin/multiple-images-uploader';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  nameHe?: string | null;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    nameEn?: string | null;
    nameHe?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
    descriptionHe?: string | null;
    price: number;
    comparePrice?: number | null;
    image: string;
    images: string[];
    categoryId: string;
    inStock: boolean;
    featured: boolean;
  };
  productId?: string;
}

export function ProductForm({
  categories,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // English fields
  const [nameEn, setNameEn] = useState(
    initialData?.nameEn || initialData?.name || ''
  );
  const [descriptionEn, setDescriptionEn] = useState(
    initialData?.descriptionEn || initialData?.description || ''
  );

  // Hebrew fields
  const [nameHe, setNameHe] = useState(initialData?.nameHe || '');
  const [descriptionHe, setDescriptionHe] = useState(
    initialData?.descriptionHe || ''
  );

  // Common fields
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [inStock, setInStock] = useState(initialData?.inStock ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  // Image management - all images in one array, first is main
  const [images, setImages] = useState<string[]>(() => {
    if (initialData?.image) {
      // If we have initialData, combine main image + gallery
      const allImages = [initialData.image];
      if (initialData.images && initialData.images.length > 0) {
        // Add gallery images that aren't the main image
        initialData.images.forEach((img) => {
          if (img !== initialData.image) {
            allImages.push(img);
          }
        });
      }
      return allImages;
    }
    return [];
  });

  // Compare Price (מחיר לפני)
  const [comparePrice, setComparePrice] = useState(
    initialData?.comparePrice?.toString() || ''
  );

  // Auto-generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameEnChange = (value: string) => {
    setNameEn(value);
    // Only auto-generate slug for new products
    if (!productId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!nameEn || !nameHe) {
      toast.error('Please provide both English and Hebrew names');
      return;
    }

    if (!slug) {
      toast.error('Slug is required');
      return;
    }

    if (!price || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsLoading(true);

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : '/api/admin/products';

      const payload = {
        name: nameEn,
        nameEn,
        nameHe,
        slug,
        description: descriptionEn || '',
        descriptionEn: descriptionEn || '',
        descriptionHe: descriptionHe || '',
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        image: images[0], // First image is main
        images: images, // All images including main
        categoryId,
        inStock,
        featured,
      };

      const response = await fetch(url, {
        method: productId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save product');
      }

      toast.success(
        productId
          ? 'Product updated successfully'
          : 'Product created successfully'
      );
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {productId ? 'Edit Product' : 'Create Product'}
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
                    Product Name (English){' '}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nameEn"
                    value={nameEn}
                    onChange={(e) => handleNameEnChange(e.target.value)}
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
                    placeholder="Handcrafted sterling silver ring with..."
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
                    placeholder="טבעת כסף סטרלינג בעבודת יד עם..."
                    rows={4}
                    dir="rtl"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="sterling-silver-ring"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly name (auto-generated from product name)
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={categoryId}
                  onValueChange={setCategoryId}
                  required
                >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comparePrice">
                  Compare Price (₪) - מחיר לפני
                </Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="499.00"
                />
                <p className="text-xs text-muted-foreground">
                  Original price (optional, for showing discount)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (₪) - מחיר אחרי <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299.00"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Current selling price
                </p>
              </div>
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
          </CardContent>
        </Card>

        {/* Images Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Product Images <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload product images. The first image will be the main product
                image. Drag to reorder.
              </p>
              <MultipleImagesUploader
                value={images}
                onChange={setImages}
                maxImages={6}
                disabled={isLoading}
                folder="products"
              />
            </div>

            {images.length > 0 && (
              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium">
                  Main Image: {images[0] ? '✓ Set' : 'Not set'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  The first image in the gallery is your main product image
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : productId
              ? 'Update Product'
              : 'Create Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
