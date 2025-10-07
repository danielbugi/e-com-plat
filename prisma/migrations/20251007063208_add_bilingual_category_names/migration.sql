-- DropIndex
DROP INDEX "public"."categories_name_key";

-- AlterTable
ALTER TABLE "public"."categories" ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "nameHe" TEXT;
