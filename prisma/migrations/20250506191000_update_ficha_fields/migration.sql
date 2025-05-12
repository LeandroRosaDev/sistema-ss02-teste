/*
  Warnings:

  - You are about to drop the column `url_imagem_frente` on the `ficha_individual` table. All the data in the column will be lost.
  - You are about to drop the column `url_imagem_verso` on the `ficha_individual` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ficha_individual" DROP COLUMN "url_imagem_frente",
DROP COLUMN "url_imagem_verso",
ADD COLUMN     "frente_bucket_name" TEXT,
ADD COLUMN     "frente_object_name" TEXT,
ADD COLUMN     "verso_bucket_name" TEXT,
ADD COLUMN     "verso_object_name" TEXT;
