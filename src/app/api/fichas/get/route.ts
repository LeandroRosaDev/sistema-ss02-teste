import { prisma } from "@/lib/prisma"; // Certifique-se de que o caminho está correto
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const ocr = searchParams.get("ocr");
    const nome = searchParams.get("nome");
    const registro = searchParams.get("registro");

    // Calcular o offset baseado na página
    const skip = (page - 1) * limit;

    // Criar array de condições
    const whereConditions: Prisma.ficha_individualWhereInput[] = [];

    if (status !== null) {
      whereConditions.push({ status: status === "true" });
    }

    if (ocr) {
      whereConditions.push({
        ocr_ficha: {
          contains: ocr,
          mode: "insensitive",
        },
      });
    }

    if (nome) {
      whereConditions.push({
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      });
    }

    if (registro) {
      whereConditions.push({
        registro: {
          contains: registro,
          mode: "insensitive",
        },
      });
    }

    // Construir o objeto where final
    const where: Prisma.ficha_individualWhereInput =
      whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Buscar as fichas no banco (sem as imagens)
    const fichas = await prisma.ficha_individual.findMany({
      where,
      select: {
        id_ficha: true,
        nome: true,
        registro: true,
        ocr_ficha: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
      skip,
    });

    // Contar o total de fichas
    const total = await prisma.ficha_individual.count({
      where,
    });

    return NextResponse.json({
      fichas,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Erro ao buscar fichas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar fichas" },
      { status: 500 }
    );
  }
}
