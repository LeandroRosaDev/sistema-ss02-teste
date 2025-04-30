import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Total de fichas
    const totalFichas = await prisma.ficha_individual.count();

    // Fichas verificadas (status = true)
    const fichasVerificadas = await prisma.ficha_individual.count({
      where: {
        status: true,
      },
    });

    // Fichas não verificadas (status = false ou null)
    const fichasNaoVerificadas = await prisma.ficha_individual.count({
      where: {
        OR: [{ status: false }, { status: null }],
      },
    });

    return NextResponse.json({
      total: totalFichas,
      verificadas: fichasVerificadas,
      naoVerificadas: fichasNaoVerificadas,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
