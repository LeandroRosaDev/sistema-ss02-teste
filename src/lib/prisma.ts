// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Verifica se já existe uma instância do Prisma Client globalmente em desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Adiciona opções de log e de gerenciamento de pool de conexão
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Logs úteis para depuração
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
