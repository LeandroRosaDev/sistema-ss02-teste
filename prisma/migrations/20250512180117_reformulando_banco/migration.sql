/*
  Warnings:

  - You are about to drop the column `frente_bucket_name` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `frente_object_name` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `verso_bucket_name` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `verso_object_name` on the `ficha_individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ficha_individual" DROP COLUMN "frente_bucket_name",
DROP COLUMN "frente_object_name",
DROP COLUMN "verso_bucket_name",
DROP COLUMN "verso_object_name";
