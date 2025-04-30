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

    // Validar dados obrigatórios
    if (!nome || !registro) {
      return NextResponse.json(
        { error: "Nome e registro são obrigatórios" },
        { status: 400 }
      );
    }

    if (!imagem_frente_ficha || !imagem_verso_ficha) {
      return NextResponse.json(
        { error: "As imagens são obrigatórias" },
        { status: 400 }
      );
    }

    // Verificar se as imagens são do tipo Blob
    if (
      !(imagem_frente_ficha instanceof Blob) ||
      !(imagem_verso_ficha instanceof Blob)
    ) {
      return NextResponse.json(
        { error: "Formato de imagem inválido" },
        { status: 400 }
      );
    }

    // Converter Blobs para ArrayBuffer e depois para Buffer
    const frente_buffer = Buffer.from(await imagem_frente_ficha.arrayBuffer());
    const verso_buffer = Buffer.from(await imagem_verso_ficha.arrayBuffer());

    // Criar a ficha no banco de dados
    const ficha = await prisma.ficha_individual.create({
      data: {
        nome: nome.toString(),
        registro: registro.toString(),
        ocr_ficha: ocr_ficha?.toString() || "",
        imagem_frente_ficha: frente_buffer,
        imagem_verso_ficha: verso_buffer,
        class_polegar_esq: class_polegar_esq.toString(),
        class_polegar_dir: class_polegar_dir.toString(),
        status: false,
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
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar ficha:", error);
    return NextResponse.json({ error: "Erro ao criar ficha" }, { status: 500 });
  }
}
