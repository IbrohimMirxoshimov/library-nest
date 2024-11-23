/*
  Warnings:

  - You are about to drop the column `region` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `town` on the `address` table. All the data in the column will be lost.
  - Added the required column `region_id` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address" DROP COLUMN "region",
DROP COLUMN "town",
ADD COLUMN     "region_id" INTEGER NOT NULL,
ADD COLUMN     "sub_region_id" INTEGER;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_sub_region_id_fkey" FOREIGN KEY ("sub_region_id") REFERENCES "region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
