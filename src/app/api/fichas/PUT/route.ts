import { prisma } from "@/lib/prisma"; // Certifique-se de que o caminho está correto
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verifica autenticação
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Verifica se o ID da ficha foi fornecido
    if (!body.id_ficha) {
      return NextResponse.json(
        { error: "ID da ficha é obrigatório" },
        { status: 400 }
      );
    }

    // Cria o objeto de atualização apenas com os campos fornecidos
    const updateData: { nome?: string; registro?: string; status?: boolean } =
      {};

    if (body.nome !== undefined) updateData.nome = body.nome;
    if (body.registro !== undefined) updateData.registro = body.registro;
    if (body.status !== undefined) updateData.status = body.status;

    // Atualiza a ficha na tabela
    const updatedFicha = await prisma.ficha_individual.update({
      where: { id_ficha: body.id_ficha },
      data: updateData,
    });

    return NextResponse.json(updatedFicha);
  } catch (error) {
    console.error("Erro ao atualizar ficha:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ficha. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
