/*
  Warnings:

  - You are about to drop the `ficha_individual_homolog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `ficha_individual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ficha_individual" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" BOOLEAN DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userUpdate" TEXT;

-- DropTable
DROP TABLE "ficha_individual_homolog";
