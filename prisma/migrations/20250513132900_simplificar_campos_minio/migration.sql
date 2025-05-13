/*
  Warnings:

  - You are about to drop the column `frente_bucket_name` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `frente_etag` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `frente_version_id` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `imagem_frente_ficha` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `imagem_verso_ficha` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `verso_bucket_name` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `verso_etag` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `verso_version_id` on the `ficha_individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ficha_individual" DROP COLUMN "frente_bucket_name",
DROP COLUMN "frente_etag",
DROP COLUMN "frente_version_id",
DROP COLUMN "imagem_frente_ficha",
DROP COLUMN "imagem_verso_ficha",
DROP COLUMN "verso_bucket_name",
DROP COLUMN "verso_etag",
DROP COLUMN "verso_version_id";
