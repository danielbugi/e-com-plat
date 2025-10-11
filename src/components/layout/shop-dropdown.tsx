'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface Category {
  id: string;
  name: string;
  nameEn?: string;
  nameHe?: string;
  slug: string;
}

export function ShopDropdown() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  const getCategoryName = (category: Category) => {
    if (language === 'he' && category.nameHe) {
      return category.nameHe;
    }
    return category.nameEn || category.name;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-white/90 hover:text-white hover:bg-white/10 text-sm font-medium h-auto px-0 relative group"
        >
          {t('nav.shop')}
          <ChevronDown className="ml-1 h-4 w-4" />
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all group-hover:w-full"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem asChild>
          <Link href="/shop" className="cursor-pointer">
            {t('shop.dropdown.viewAll')}
          </Link>
        </DropdownMenuItem>

        {categories.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="cursor-pointer"
                >
                  {getCategoryName(category)}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
