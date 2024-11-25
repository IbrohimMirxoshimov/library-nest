/*
  Warnings:

  - You are about to drop the column `books_group_id` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `few` on the `book` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookImportance" AS ENUM ('AUTO', 'NOT_NECESSARY', 'NECESSARY', 'RARE', 'EXPENSIVE');

-- AlterTable
ALTER TABLE "book" DROP COLUMN "books_group_id",
DROP COLUMN "few",
ADD COLUMN     "importance" "BookImportance";
