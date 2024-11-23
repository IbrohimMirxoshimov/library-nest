/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `region` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "region" ADD COLUMN     "code" TEXT,
ADD COLUMN     "parent_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "region_code_key" ON "region"("code");

-- CreateIndex
CREATE INDEX "region_parent_id_idx" ON "region"("parent_id");

-- AddForeignKey
ALTER TABLE "region" ADD CONSTRAINT "region_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "region"("id") ON DELETE SET NULL ON UPDATE CASCADE;
