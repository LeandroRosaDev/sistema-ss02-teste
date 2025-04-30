/*
  Warnings:

  - You are about to alter the column `userUpdate` on the `ficha_individual` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to drop the `identidade_digital` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ficha_individual" ALTER COLUMN "userUpdate" SET DATA TYPE VARCHAR(10);

-- DropTable
DROP TABLE "identidade_digital";

-- CreateIndex
CREATE INDEX "ficha_individual_registro_idx" ON "ficha_individual"("registro");

-- CreateIndex
CREATE INDEX "ficha_individual_nome_idx" ON "ficha_individual"("nome");

-- CreateIndex
CREATE INDEX "ficha_individual_status_idx" ON "ficha_individual"("status");

-- CreateIndex
CREATE INDEX "ficha_individual_created_at_idx" ON "ficha_individual"("created_at");

-- CreateIndex
CREATE INDEX "ficha_individual_userUpdate_idx" ON "ficha_individual"("userUpdate");
