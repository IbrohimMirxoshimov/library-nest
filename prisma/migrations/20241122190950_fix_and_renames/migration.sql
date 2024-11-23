/*
  Warnings:

  - You are about to drop the column `leased_at` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `returning_date` on the `rent` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `rent` table. All the data in the column will be lost.
  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `customer_id` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `librarian_id` to the `rent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rented_at` to the `rent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "rent" DROP CONSTRAINT "rent_user_id_fkey";

-- AlterTable
ALTER TABLE "book" ALTER COLUMN "rent_duration" DROP DEFAULT;

-- AlterTable
ALTER TABLE "rent" DROP COLUMN "leased_at",
DROP COLUMN "returning_date",
DROP COLUMN "user_id",
ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "due_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "librarian_id" INTEGER NOT NULL,
ADD COLUMN     "rented_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "rent" ADD CONSTRAINT "rent_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent" ADD CONSTRAINT "rent_librarian_id_fkey" FOREIGN KEY ("librarian_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
