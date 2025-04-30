import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const fichas = [
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR123456",
      class_polegar_dir: "A1",
      class_polegar_esq: "B2",
      nome: "João Silva",
      registro: "REG001",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR987654",
      class_polegar_dir: "A2",
      class_polegar_esq: "B3",
      nome: "Maria Oliveira",
      registro: "REG002",
    },
  ];

  for (const ficha of fichas) {
    await prisma.ficha_individual.create({ data: ficha });
  }

  console.log("Dados inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
