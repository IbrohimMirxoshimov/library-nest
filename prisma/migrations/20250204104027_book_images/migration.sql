/*
  Warnings:

  - You are about to drop the column `image` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "file" ADD COLUMN "bookId" INTEGER;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
