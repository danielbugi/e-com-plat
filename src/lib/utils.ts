import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency?: string, symbol?: string) {
  // Use provided currency/symbol or fallback to ILS
  const curr = currency || "ILS";
  const sym = symbol || "₪";

  return `${sym}${price.toFixed(2)}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}
