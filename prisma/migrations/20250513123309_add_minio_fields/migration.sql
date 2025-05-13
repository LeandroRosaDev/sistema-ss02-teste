/*
  Warnings:

  - The `imagem_frente_ficha` column on the `ficha_individual` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imagem_verso_ficha` column on the `ficha_individual` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ficha_individual" ADD COLUMN     "frente_bucket_name" TEXT,
ADD COLUMN     "frente_etag" TEXT,
ADD COLUMN     "frente_object_name" TEXT,
ADD COLUMN     "frente_version_id" TEXT,
ADD COLUMN     "verso_bucket_name" TEXT,
ADD COLUMN     "verso_etag" TEXT,
ADD COLUMN     "verso_object_name" TEXT,
ADD COLUMN     "verso_version_id" TEXT,
DROP COLUMN "imagem_frente_ficha",
ADD COLUMN     "imagem_frente_ficha" BYTEA,
DROP COLUMN "imagem_verso_ficha",
ADD COLUMN     "imagem_verso_ficha" BYTEA;
