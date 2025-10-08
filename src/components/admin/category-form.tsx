// src/components/admin/category-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUploader } from '@/components/admin/image-uploader';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    nameEn?: string | null;
    nameHe?: string | null;
    slug: string;
    description?: string | null;
    image?: string | null;
  };
  categoryId?: string;
}

export function CategoryForm({ initialData, categoryId }: CategoryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // English fields
  const [nameEn, setNameEn] = useState(
    initialData?.nameEn || initialData?.name || ''
  );
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [descriptionEn, setDescriptionEn] = useState(
    initialData?.description || ''
  );

  // Hebrew fields
  const [nameHe, setNameHe] = useState(initialData?.nameHe || '');
  const [descriptionHe, setDescriptionHe] = useState('');

  // Image
  const [image, setImage] = useState<string>(initialData?.image || '');

  // Auto-generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameEnChange = (value: string) => {
    setNameEn(value);
    if (!categoryId) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn || !nameHe) {
      toast.error('Please provide both English and Hebrew names');
      return;
    }

    if (!slug) {
      toast.error('Slug is required');
      return;
    }

    setIsLoading(true);

    try {
      const url = categoryId
        ? `/api/admin/categories/${categoryId}`
        : '/api/admin/categories';

      const payload = {
        name: nameEn,
        nameEn,
        nameHe,
        slug,
        description: descriptionEn,
        image: image || null,
      };

      const response = await fetch(url, {
        method: categoryId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      toast.success(
        categoryId
          ? 'Category updated successfully'
          : 'Category created successfully'
      );
      router.push('/admin/categories');
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
              {categoryId ? 'Edit Category' : 'Create Category'}
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
                    Category Name (English){' '}
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
                  <Label htmlFor="descriptionEn">Description (English)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="Premium handcrafted rings for every occasion"
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
                    value={descriptionHe}
                    onChange={(e) => setDescriptionHe(e.target.value)}
                    placeholder="טבעות בעבודת יד איכותיות לכל אירוע"
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </TabsContent>
            </Tabs>

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
                URL-friendly name (auto-generated from category name)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Category Image Card */}
        <Card>
          <CardHeader>
            <CardTitle>Category Image (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload an image to represent this category
              </p>
              <ImageUploader
                value={image}
                onChange={setImage}
                onRemove={() => setImage('')}
                disabled={isLoading}
                label="Upload Category Image"
                folder="categories"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : categoryId
              ? 'Update Category'
              : 'Create Category'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
