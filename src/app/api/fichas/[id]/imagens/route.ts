import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Buscar apenas as imagens da ficha
    const ficha = await prisma.ficha_individual.findUnique({
      where: { id_ficha: id },
      select: {
        imagem_frente_ficha: true,
        imagem_verso_ficha: true,
      },
    });

    if (!ficha) {
      return NextResponse.json(
        { error: "Ficha não encontrada" },
        { status: 404 }
      );
    }

    // Converter os buffers para arrays
    const imagens = {
      imagem_frente_ficha: ficha.imagem_frente_ficha
        ? Array.from(ficha.imagem_frente_ficha)
        : null,
      imagem_verso_ficha: ficha.imagem_verso_ficha
        ? Array.from(ficha.imagem_verso_ficha)
        : null,
    };

    return NextResponse.json(imagens);
  } catch (error) {
    console.error("Erro ao buscar imagens da ficha:", error);
    return NextResponse.json(
      { error: "Erro ao buscar imagens" },
      { status: 500 }
    );
  }
}
