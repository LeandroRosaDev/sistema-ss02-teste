import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extrair os dados do FormData
    const nome = formData.get("nome");
    const registro = formData.get("registro");
    const ocr_ficha = formData.get("ocr_ficha");
    const imagem_frente_ficha = formData.get("imagem_frente_ficha");
    const imagem_verso_ficha = formData.get("imagem_verso_ficha");
    const class_polegar_esq = formData.get("class_polegar_esq") || "";
    const class_polegar_dir = formData.get("class_polegar_dir") || "";

    // Obter apenas os nomes dos objetos do MinIO
    const frente_object_name = formData.get("frente_object_name");
    const verso_object_name = formData.get("verso_object_name");

    // Validar dados obrigatórios
    if (!nome || !registro) {
      return NextResponse.json(
        { error: "Nome e registro são obrigatórios" },
        { status: 400 }
      );
    }

    if (!imagem_frente_ficha || !imagem_verso_ficha) {
      return NextResponse.json(
        { error: "As URLs das imagens são obrigatórias" },
        { status: 400 }
      );
    }

    if (!frente_object_name || !verso_object_name) {
      return NextResponse.json(
        { error: "Os nomes dos objetos são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar a ficha no banco de dados apenas com os nomes dos objetos
    const ficha = await prisma.ficha_individual.create({
      data: {
        nome: nome.toString(),
        registro: registro.toString(),
        ocr_ficha: ocr_ficha?.toString() || "",
        class_polegar_esq: class_polegar_esq.toString(),
        class_polegar_dir: class_polegar_dir.toString(),
        status: false,
        userUpdate: "API",
        frente_object_name: frente_object_name.toString(),
        verso_object_name: verso_object_name.toString(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Ficha cadastrada com sucesso!",
        ficha: {
          id_ficha: ficha.id_ficha,
          nome: ficha.nome,
          registro: ficha.registro,
          status: ficha.status,
          class_polegar_esq: ficha.class_polegar_esq,
          class_polegar_dir: ficha.class_polegar_dir,
          imagem_frente_url: imagem_frente_ficha.toString(),
          imagem_verso_url: imagem_verso_ficha.toString(),
          objetos: {
            frente: ficha.frente_object_name,
            verso: ficha.verso_object_name,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar ficha:", error);
    return NextResponse.json(
      {
        error: "Erro ao criar ficha",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
