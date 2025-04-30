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
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR456789",
      class_polegar_dir: "A3",
      class_polegar_esq: "B4",
      nome: "Carlos Pereira",
      registro: "REG003",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR321654",
      class_polegar_dir: "A4",
      class_polegar_esq: "B5",
      nome: "Ana Costa",
      registro: "REG004",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR654321",
      class_polegar_dir: "A5",
      class_polegar_esq: "B6",
      nome: "Lucas Santos",
      registro: "REG005",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR159753",
      class_polegar_dir: "A6",
      class_polegar_esq: "B7",
      nome: "Fernanda Lima",
      registro: "REG006",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR753159",
      class_polegar_dir: "A7",
      class_polegar_esq: "B8",
      nome: "Roberto Almeida",
      registro: "REG007",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR852963",
      class_polegar_dir: "A8",
      class_polegar_esq: "B9",
      nome: "Patrícia Martins",
      registro: "REG008",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR951753",
      class_polegar_dir: "A9",
      class_polegar_esq: "B10",
      nome: "Juliana Rocha",
      registro: "REG009",
    },
    {
      imagem_frente_ficha: null,
      imagem_verso_ficha: null,
      ocr_ficha: "OCR258147",
      class_polegar_dir: "A10",
      class_polegar_esq: "B11",
      nome: "André Ferreira",
      registro: "REG010",
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
