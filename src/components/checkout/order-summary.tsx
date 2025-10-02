"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { useSettings } from "@/contexts/settings-context";
import Image from "next/image";

export function OrderSummary() {
  const { items, getTotalPrice } = useCartStore();
  const { settings } = useSettings();
  const subtotal = getTotalPrice();
  const taxRate = settings?.taxRate || 17;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  const currencySymbol = settings?.currencySymbol || "₪";

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>סיכום הזמנה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-secondary">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  כמות: {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm">
                {currencySymbol}
                {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">סכום ביניים</span>
            <span className="font-medium">
              {currencySymbol}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">משלוח</span>
            <span className="font-medium text-green-600">חינם</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">מע"מ ({taxRate}%)</span>
            <span className="font-medium">
              {currencySymbol}
              {taxAmount.toFixed(2)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>סה"כ</span>
            <span>
              {currencySymbol}
              {total.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
