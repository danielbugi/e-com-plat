'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface CartItemProps {
  item: {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const subtotal = item.price * item.quantity;

  return (
    <div>
      <div className="flex gap-4 py-4">
        <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div className="flex justify-between">
            <div>
              <Link
                href={`/shop/${item.productId}`}
                className="font-semibold hover:text-accent"
              >
                {item.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                {formatPrice(item.price)} each
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.productId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center font-medium">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <p className="font-bold">{formatPrice(subtotal)}</p>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
