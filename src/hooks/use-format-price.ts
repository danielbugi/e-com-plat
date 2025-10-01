import { useSettings } from "@/contexts/settings-context";

export function useFormatPrice() {
  const { settings } = useSettings();

  const formatPrice = (price: number) => {
    if (!settings) {
      return `₪${price.toFixed(2)}`;
    }

    return `${settings.currencySymbol}${price.toFixed(2)}`;
  };

  return { formatPrice, settings };
}
