"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";

export function SearchSort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const currentSort = `${sortBy}-${sortOrder}`;

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    const params = new URLSearchParams(searchParams.toString());

    params.set("sortBy", newSortBy);
    params.set("sortOrder", newSortOrder);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("search.sortBy")}:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">{t("search.newest")}</SelectItem>
          <SelectItem value="createdAt-asc">{t("search.oldest")}</SelectItem>
          <SelectItem value="price-asc">
            {t("search.priceLowToHigh")}
          </SelectItem>
          <SelectItem value="price-desc">
            {t("search.priceHighToLow")}
          </SelectItem>
          <SelectItem value="name-asc">{t("search.nameAZ")}</SelectItem>
          <SelectItem value="name-desc">{t("search.nameZA")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
