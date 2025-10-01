-- CreateTable
CREATE TABLE "public"."settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Forge & Steel',
    "siteDescription" TEXT NOT NULL DEFAULT 'Premium Men''s Jewelry',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@forgesteel.com',
    "contactPhone" TEXT NOT NULL DEFAULT '+972-50-123-4567',
    "address" TEXT NOT NULL DEFAULT '123 Main Street, Tel Aviv, Israel',
    "currency" TEXT NOT NULL DEFAULT 'ILS',
    "currencySymbol" TEXT NOT NULL DEFAULT '₪',
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 17,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
