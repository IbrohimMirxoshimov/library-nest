/*
  Warnings:

  - The `status` column on the `stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `source` column on the `stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StockSource" AS ENUM ('PURCHASED', 'GIFT');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('ACTIVE', 'RESTRICTED', 'NEEDS_REPAIR', 'LOST', 'INACTIVE');

-- AlterTable
ALTER TABLE "stock" DROP COLUMN "status",
ADD COLUMN     "status" "StockStatus" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "price" DROP DEFAULT,
DROP COLUMN "source",
ADD COLUMN     "source" "StockSource";
